#include "wpa.h"

#include <napi.h>

#include <iostream>
#include <fstream>
#include <sstream>
#include <cstring>
#include <stdio.h>
#include <utility>

#ifndef _MSC_VER
#include <unistd.h>

#include <error.h>

#endif
#include <cstdlib>

#include <regex>

WPA::WPA() : _ctrlPath(WPA_CTRL_INTERFACE)
{
}


void WPA::init(Napi::Env env,std::string ctrl_path){
    this->_ctrlPath = ctrl_path;
    this->init(env);
}
void WPA::init(Napi::Env env){
    ctrlConnect();
    runEvent();

    networkScan();
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

std::vector<WifiInfo> WPA::getWifiList()
{
   return _wifiList;
}

bool WPA::networkConnect(std::string ssid,std::string bssid, std::string passwd)
{
    int id = networkAdd(_ctrl);

    networkSet(_ctrl,id,"ssid",ssid);
    networkSet(_ctrl,id,"bssid",bssid);

    if(passwd.length() == 0){
        networkSet(_ctrl,id,"key_mgmt","NONE");
    }else{
        if(passwd.length() < 8){
            return false;
        }else if(passwd.length() > 63){
            return false;
        }
        networkSet(_ctrl,id,"psk",passwd);
    }

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

void WPA::ctrlConnect()
{
#ifndef _MSC_VER
    _ctrl = wpa_ctrl_open(_ctrlPath.data());
    _ctrl_event = wpa_ctrl_open(_ctrlPath.data());
//    checkConnected();
#endif
}
void WPA::callbackSend(NoticeType type,int value){

    auto callback = []( Napi::Env env, Napi::Function jsCallback, std::pair<int,int> *type) {
        jsCallback.Call( {Napi::Number::New( env, type->first ),Napi::Number::New( env, type->second )} );

        delete type;
    };
    if(!onData)
        return;
        
    onData.BlockingCall(new std::pair<int,int>(type,value),callback);
}
void WPA::wpa_ctrl_event()
{
    #ifndef _MSC_VER
    char *resBuff = new char[4096];
    size_t size = 4096;
    int a;
    std::pair<int,int> res;

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
        if(stdResBuff.find(WPA_EVENT_SCAN_RESULTS) != std::string::npos){
            clearList();

            parseWifiInfo();
            callbackSend(NoticeType::LIST_UPDATE,0);

        }else if(stdResBuff.find(WPA_EVENT_CONNECTED) != std::string::npos){

            connected = true;


            networkSaveConfig(_ctrl);
            callbackSend(NoticeType::LIST_UPDATE,0);
            callbackSend(NoticeType::STATE_CHANGE,0);

        }else if(stdResBuff.find(WPA_EVENT_DISCONNECTED) != std::string::npos){

            // networkDelete(_ctrl);
            connected = false;

            callbackSend(NoticeType::LIST_UPDATE,0);
            callbackSend(NoticeType::STATE_CHANGE,0);

        }else if(stdResBuff.find(WPA_EVENT_SCAN_FAILED) != std::string::npos){
            clearList();

            callbackSend(NoticeType::LIST_UPDATE,0);
            networkDisable(_ctrl);
            networkDelete(_ctrl);
            networkSaveConfig(_ctrl);

            auto pos = stdResBuff.find("ret=");
            if(pos != std::string::npos){
                auto ret = stdResBuff.substr(pos+4);
                if(atoi(ret.c_str()) == -52){
                    callbackSend(NoticeType::SCAN_FAIL,-52);
                }else{
                    callbackSend(NoticeType::SCAN_FAIL,1);
                }
            }else{
                    callbackSend(NoticeType::SCAN_FAIL,0);
            }
        }else if(stdResBuff.find(WPA_EVENT_ASSOC_REJECT) != std::string::npos || stdResBuff.find(HANDSHAKE_FAIL) != std::string::npos){
            std::regex re("bssid=(\\w|:)*");
            std::smatch result;
            auto flag = std::regex_search(stdResBuff,result,re);
            
            networkDelete(_ctrl);
            networkSaveConfig(_ctrl);

            callbackSend(NoticeType::ASSOCIATE_FAIL,0);
            callbackSend(NoticeType::LIST_UPDATE,0);

        }else if(stdResBuff.find(TRY_ASSOCIATE_TEXT) != std::string::npos){
            callbackSend(NoticeType::TRY_ASSOCIATE,0);
        }
    }
#endif
}

void WPA::clearList()
{
    std::lock_guard<std::mutex> listLock(_listMutex);

    while(_wifiList.size() > 0){
        _wifiList.erase(_wifiList.begin());
    }
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
                _wifiList.emplace_back(row[4],row[0],true,std::atoi(row[1].data()),std::atoi(row[2].data()),false);
            }else{
                _wifiList.emplace_back(row[4],row[0],false,std::atoi(row[1].data()),std::atoi(row[2].data()),false);
            }
        }
    }

    return;
}

WifiInfo WPA::getCurrentStatus()
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
            mp.emplace(row[0],row[1]);
        }
    }
    if(mp.find("wpa_state") != mp.end()){
        if(!mp["wpa_state"].compare("DISCONNECTED")){
            return std::move(WifiInfo("","",false,0,0,false));
        }
    }
    return std::move(WifiInfo(mp["ssid"],mp["bssid"],false,std::atoi(mp["freq"].data()),0,true));
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
            mp.emplace(row[0],row[1]);
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

void WPA::networkDisable(struct wpa_ctrl *ctrl)
{
    char resBuff[4096] = {0};
    std::string buf;

    buf = "DISABLE_NETWORK all";

    wpa_ctrl_cmd(ctrl,buf.c_str(),resBuff);
}

void WPA::networkDelete(struct wpa_ctrl *ctrl)
{
    char resBuff[4096] = {0};
    std::string buf;

    buf = "REMOVE_NETWORK all";

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
