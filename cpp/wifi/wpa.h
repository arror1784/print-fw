#pragma once

#include <thread>
#include <mutex>

#include "wpa_ctrl/wpa_ctrl.h"
#include "wifiinfo.h"

#ifdef __arm__
#define WPA_CTRL_INTERFACE "/var/run/wpa_supplicant/wlan0"
#else
#define WPA_CTRL_INTERFACE "/var/run/wpa_supplicant/wlp3s0"
#endif

#define TRY_ASSOCIATE "Trying to associate"

enum class WIFIInfoType{
    BSSID=0,
    FREQ=1,
    SIGLEV=2,
    FLAGS=3,
    SSID=4,
};
enum class NetworkInfoType{
    ID=0,
    BSSID=1,
    SSID=2,
    FREQ=3,
    SIGLEV=4,
    FLAGS=5,
};

class WPA
{
public:
    WPA();
    WPA(const char* ctrl_path);

    void selectNetwork(std::string ssid, std::string pwd);
    void runEvent();

    void networkListUpdate();
    void currentStateChange();

    void connectedChange(bool connected);

    void refreshAvailable();
    void wifiTryAssociate();

    void wifiScanFail(int value);
    void wifiAssocFailed(int value);

public:
    void networkScan();

    std::vector<WifiInfo*> getWifiList();

    bool networkConnect(std::string ssid,std::string bssid,std::string passwd,int networkID);
    bool networkConnect(int id);

    bool networkDisconnect();

    void checkNetworkConnect();

private:
    bool checkFileExists();
    bool checkCommandSucess(char*);

    void ctrlConnect();
    void wpa_ctrl_event();

    void clearList();

    void parseWifiInfo(); //scan_result
    void parseNetworkInfo(); //saved_network_list
    void parseConnectedWifi();

    bool checkConnected();

    int networkAdd(struct wpa_ctrl *ctrl);
    void networkSelect(struct wpa_ctrl *ctrl,int id);
    void networkEnable(struct wpa_ctrl *ctrl,int id);
    void networkDisable(struct wpa_ctrl *ctrl,int id);
    void networkDelete(struct wpa_ctrl *ctrl,int id);
    void networkSaveConfig(struct wpa_ctrl *ctrl);
    void networkSet(struct wpa_ctrl *ctrl,int id,std::string key,std::string value);

    int wpa_ctrl_cmd(struct wpa_ctrl *ctrl, const char *cmd, char *buf);

    std::vector<WifiInfo*> _wifiList;

    std::mutex _commandMutex;
    std::mutex _listMutex;

    std::thread th;

    wpa_ctrl* _ctrl;
    wpa_ctrl* _ctrl_event;
    
    std::string _ctrlPath;
    std::string _lastTrySsid;

};
