#include "wpa.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <cstring>
#include <stdio.h>

#ifndef _MSC_VER
#include <unistd.h>

#include <error.h>

#endif
#include <cstdlib>

#include <regex>

WPA::WPA() : _ctrlPath(WPA_CTRL_INTERFACE)
{
    if(!checkFileExists()){
        return;
    }
    ctrlConnect();
    runEvent();
}

WPA::WPA(const char *ctrl_path) : _ctrlPath(ctrl_path)
{
    if(!checkFileExists()){
        return;
    }
    ctrlConnect();
    runEvent();
}

void WPA::runEvent()
{
    th = std::thread(&WPA::wpa_ctrl_event,this);
}

void WPA::networkScan()
{
    int ret;
    char resBuff[4096] = {0};

    ret = wpa_ctrl_cmd(_ctrl, "SCAN", resBuff);
}

std::vector<WifiInfo*> WPA::getWifiList()
{
   return _wifiList;
}

bool WPA::networkConnect(std::string ssid,std::string bssid, std::string passwd,int networkID)
{
    int id;

    if(networkID == -1){
        id = networkAdd(_ctrl);
    }else{
        id = networkID;
    }


    networkSet(_ctrl,id,"ssid",ssid);
    networkSet(_ctrl,id,"bssid",bssid);

    if(passwd.length() == 0){
        networkSet(_ctrl,id,"key_mgmt","NONE");
    }else{
        if(passwd.length() < 8){
            wifiAssocFailed(1);
            return false;
        }else if(passwd.length() > 63){
            wifiAssocFailed(2);
            return false;
        }
        networkSet(_ctrl,id,"psk",passwd);
    }

    networkConnect(id);

    return true;
}

bool WPA::networkConnect(int id)
{
    networkSelect(_ctrl,id);
    networkEnable(_ctrl,id);

    return true;
}

bool WPA::networkDisconnect()
{
    char resBuff[4096] = {0};

    wpa_ctrl_cmd(_ctrl,"DISCONNECT",resBuff);

    return true;
}

void WPA::checkNetworkConnect()
{
    connectedChange(checkConnected());
}

void WPA::ctrlConnect()
{
#ifndef _MSC_VER
    _ctrl = wpa_ctrl_open(_ctrlPath.data());
    _ctrl_event = wpa_ctrl_open(_ctrlPath.data());
//    checkConnected();
#endif
}

void WPA::wpa_ctrl_event()
{
#ifndef _MSC_VER
    char *resBuff = new char[4096];
    size_t size = 4096;
    int a;

    if(wpa_ctrl_attach(_ctrl_event)){
        std::cout << "wpa attack error" << _ctrlPath << std::endl;
        return;
    }else{
        std::cout << "wpa attack sucess" << _ctrlPath << std::endl;
    }

    while (1) {
        size = 4096;
        memset(resBuff,'\0',size);

        wpa_ctrl_pending_blocking(_ctrl_event);
        wpa_ctrl_recv(_ctrl_event,resBuff,&size);

        std::string stdResBuff(resBuff);
//        qDebug() << QString::fromStdString(stdResBuff) << "event";
        if(stdResBuff.find(WPA_EVENT_SCAN_RESULTS) != std::string::npos){
            clearList();

            parseWifiInfo();
            parseNetworkInfo();
            parseConnectedWifi();

            networkListUpdate();

        }else if(stdResBuff.find(WPA_EVENT_CONNECTED) != std::string::npos){

            networkSaveConfig(_ctrl);
            parseConnectedWifi();
            networkListUpdate();
            connectedChange(true);

        }else if(stdResBuff.find(WPA_EVENT_DISCONNECTED) != std::string::npos){

            parseConnectedWifi();
            networkScan();

            networkListUpdate();
            connectedChange(false);

        }else if(stdResBuff.find(WPA_EVENT_SCAN_FAILED) != std::string::npos){
            clearList();
            networkListUpdate();
            networkDisable(_ctrl,-1);
            networkDelete(_ctrl,-1);
            networkSaveConfig(_ctrl);

            auto pos = stdResBuff.find("ret=");
            if(pos != std::string::npos){
                auto ret = stdResBuff.substr(pos+4);
                if(atoi(ret.c_str()) == -52){
                    wifiScanFail(-52);
                }else{
                    wifiScanFail(1);
                }
            }else{
                 wifiScanFail(0);
            }
        }else if(stdResBuff.find(WPA_EVENT_ASSOC_REJECT) != std::string::npos){
            std::regex re("bssid=(\\w|:)*");
            std::smatch result;
            auto flag = std::regex_search(stdResBuff,result,re);
            if(flag){
                auto bssid = result.str().substr(6);
                if(bssid == "00:00:00:00:00:00"){
                    for (int i = 0; i < _wifiList.size();i++) {
                        if(_wifiList[i]->getSsid() == _lastTrySsid){
                            networkDelete(_ctrl,_wifiList[i]->getNetworkID());
                            _wifiList[i]->setSaved(false);
                            _wifiList[i]->setNetworkID(-1);
                        }
                    }
                }else{
                    for (int i = 0; i < _wifiList.size();i++) {
                        if(_wifiList[i]->getBssid() == bssid){
                            networkDelete(_ctrl,_wifiList[i]->getNetworkID());
                            _wifiList[i]->setSaved(false);
                            _wifiList[i]->setNetworkID(-1);
                        }
                    }
                }
            }
            networkDisable(_ctrl,-1);
            networkSaveConfig(_ctrl);
            wifiAssocFailed(0);
            networkListUpdate();

        }else if(stdResBuff.find(TRY_ASSOCIATE) != std::string::npos){
            stdResBuff.erase(stdResBuff.end() - 1);
            _lastTrySsid = stdResBuff.substr(34);
            wifiTryAssociate();
        }
    }
#endif
}

void WPA::clearList()
{
    std::lock_guard<std::mutex> listLock(_listMutex);

    while(_wifiList.size() > 0){
        delete _wifiList[0];
        _wifiList.erase(_wifiList.begin());
    }
}

#include <filesystem>
bool WPA::checkFileExists()
{
    auto target = std::filesystem::u8path(_ctrlPath);
    return std::filesystem::exists(target);
}

bool WPA::checkCommandSucess(char *buf)
{
    std::string stdBuf(buf,4);

    if(stdBuf == "FAIL"){
        return false;
    }else if(stdBuf == "OK"){
        return true;
    }else{
        return true;
    }
}

void WPA::parseWifiInfo()
{
    std::lock_guard<std::mutex> listLock(_listMutex);

    int r_size = 0;
    bool first = true;

    int ret;
    char resBuff[4096] = {0};

    memset(resBuff,0x00,4096);
    ret = wpa_ctrl_cmd(_ctrl, "SCAN_RESULTS", resBuff);

    std::string myStr(resBuff), val, line;
    std::stringstream ss(myStr);

    while (getline(ss, line, '\n')) {
        std::vector<std::string> row;
        std::stringstream s(line);
        if(first){
            first = false;
            continue;
        }
        while (getline(s, val, '\t')) {
            row.push_back(val);
        }
        if(row.size() == 5){
            if(row[3].find("WPA")){
                _wifiList.push_back(new WifiInfo(-1,row[4],row[0],true,std::atoi(row[1].data()),std::atoi(row[2].data()),false,false));
            }else{
                _wifiList.push_back(new WifiInfo(-1,row[4],row[0],false,std::atoi(row[1].data()),std::atoi(row[2].data()),false,false));
            }
        }
    }

    return;
}
void WPA::parseNetworkInfo()
{
    std::lock_guard<std::mutex> listLock(_listMutex);

    bool first = true;

    int ret;
    char resBuff[4096] = {0};

    do {
        memset(resBuff,0x00,4096);
        ret = wpa_ctrl_cmd(_ctrl, "LIST_NETWORKS", resBuff);
    } while (std::string(resBuff) == "OK");

    std::string myStr(resBuff), val, line;
    std::stringstream ss(myStr);

    while (getline(ss, line, '\n')) {
        std::vector<std::string> row;
        std::stringstream s(line);
        if(first){
            first = false;
            continue;
        }
        while (getline(s, val, '\t')) {
            row.push_back(val);
        }
//        if(row.size() == 4){
        for (int i = 0; i < _wifiList.size();i++) {
            if(_wifiList[i]->getSsid() == row[1] && _wifiList[i]->getBssid() == row[2]){
                _wifiList[i]->setSaved(true);
                _wifiList[i]->setNetworkID(std::atoi(row[0].data()));
            }
        }
//        }
    }
    //    return vvs;
}

void WPA::parseConnectedWifi()
{
    std::lock_guard<std::mutex> listLock(_listMutex);

    int tryCount = 3;

    char resBuff[4096] = {0};
    wpa_ctrl_cmd(_ctrl,"STATUS",resBuff);

    std::string myStr(resBuff), val, line;
    std::stringstream ss(myStr);
    std::vector<std::string> array;
    std::map<std::string,std::string> mp;

    while (getline(ss, line, '\n')) {
        std::vector<std::string> row;
        std::stringstream s(line);
        while (getline(s, val, '=')) {
            row.push_back (val);
        }
        if(row.size() == 2){
            mp.insert(row[0],row[1]);
        }
    }
    if(mp["wpa_state"] == "COMPLETED"){
        for (int i = 0; i < _wifiList.size();i++) {
            if(_wifiList[i]->getSsid() == mp["ssid"] && (_wifiList[i]->getBssid() == mp["bssid"] || mp["bssid"] == "00:00:00:00:00:00")){
                _wifiList[i]->setConnected(true);
            }else{
                _wifiList[i]->setConnected(false);
            }
        }
    }else{
        for (int i = 0; i < _wifiList.size();i++) {
            _wifiList[i]->setConnected(false);
        }
    }
}

bool WPA::checkConnected()
{

    char resBuff[4096] = {0};
    wpa_ctrl_cmd(_ctrl,"STATUS",resBuff);

    std::string myStr(resBuff), val, line;
    std::stringstream ss(myStr);
    std::vector<std::string> array;
    std::map<std::string,std::string> mp;

    while (getline(ss, line, '\n')) {
        std::vector<std::string> row;
        std::stringstream s(line);
        while (getline(s, val, '=')) {
            row.push_back (val);
        }
        if(row.size() == 2){
            mp.insert(row[0],row[1]);
        }
    }
    if(mp["wpa_state"] == "COMPLETED"){
        return true;
    }else{
        return false;
    }
}
int WPA::networkAdd(struct wpa_ctrl *ctrl)
{
    char resBuff[4096] = {0};

    wpa_ctrl_cmd(ctrl,"ADD_NETWORK",resBuff);

    return atoi(resBuff);
}

void WPA::networkSelect(struct wpa_ctrl *ctrl,int id)
{
    char resBuff[4096] = {0};

    std::string buf;
    buf = "SELECT_NETWORK ";
    buf += std::to_string(id);

    wpa_ctrl_cmd(ctrl,buf.c_str(),resBuff);
}

void WPA::networkEnable(struct wpa_ctrl *ctrl,int id)
{
    char resBuff[4096] = {0};

    std::string buf;
    buf = "ENABLE_NETWORK ";
    buf += std::to_string(id);

    wpa_ctrl_cmd(ctrl,buf.c_str(),resBuff);
}

void WPA::networkDisable(struct wpa_ctrl *ctrl,int id)
{
    char resBuff[4096] = {0};
    std::string buf;

    if(id == -1){
        buf = "DISABLE_NETWORK all";
    }else{
        buf = "DISABLE_NETWORK ";
        buf += std::to_string(id);
    }
    wpa_ctrl_cmd(ctrl,buf.c_str(),resBuff);
}

void WPA::networkDelete(struct wpa_ctrl *ctrl,int id)
{
    char resBuff[4096] = {0};
    std::string buf;

    if(id == -1){
        buf = "REMOVE_NETWORK all";
    }else{
        buf = "REMOVE_NETWORK ";
        buf += std::to_string(id);
    }
    wpa_ctrl_cmd(ctrl,buf.c_str(),resBuff);
}
void WPA::networkSaveConfig(struct wpa_ctrl *ctrl)
{
    char resBuff[4096] = {0};
    wpa_ctrl_cmd(ctrl,"SAVE_CONFIG",resBuff);
}


void WPA::networkSet(struct wpa_ctrl *ctrl,int id, std::string key, std::string value)
{
    char resBuff[4096] = {0};

    std::string buf;
    buf = "SET_NETWORK ";
    buf += std::to_string(id);
    buf += " ";
    buf += key;
    buf += " ";
    if(key == "ssid" || key == "psk"){
        std::string stdValue = value;
        stdValue.push_back('"');
        stdValue.insert(0,1,'"');
        buf += stdValue;
    }else
        buf += value;

    wpa_ctrl_cmd(ctrl,buf.c_str(),resBuff);
}

int WPA::wpa_ctrl_cmd(struct wpa_ctrl *ctrl, const char *cmd, char *buf)
{
#ifndef _MSC_VER
    std::lock_guard<std::mutex> commandLock(_commandMutex);

    int ret;
    size_t len = 4096;

    if(!checkFileExists()){
        return -3;
    }

    ret = wpa_ctrl_request(ctrl, cmd, strlen(cmd), buf, &len, NULL);
    if (ret == -2) {
        printf("'%s' command timed out.\n", cmd);
        return -2;
    } else if (ret < 0) {
        printf("'%s' command failed.\n", cmd);
        return -1;
    }

    buf[len -1] = '\0';

#endif
    return 0;

}
