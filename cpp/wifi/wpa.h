#include "napi.h"

#include <thread>
#include <mutex>

#include "wpa_ctrl/wpa_ctrl.h"
#include "wifiinfo.h"

#ifdef __arm__
#define WPA_CTRL_INTERFACE "/var/run/wpa_supplicant/wlan0"
#else
#define WPA_CTRL_INTERFACE "/var/run/wpa_supplicant/wlp3s0"
#endif

#define TRY_ASSOCIATE_TEXT "Trying to associate"
#define HANDSHAKE_FAIL "Handshake failed"

enum class WIFIInfoType{
    BSSID=0,
    FREQ=1,
    SIGLEV=2,
    FLAGS=3,
    SSID=4
};
enum class NetworkInfoType{
    ID=0,
    BSSID=1,
    SSID=2,
    FREQ=3,
    SIGLEV=4,
    FLAGS=5
};
enum NoticeType{
    LIST_UPDATE=0,
    STATE_CHANGE=1,
    SCAN_FAIL=2,
    ASSOCIATE_FAIL=3,
    TRY_ASSOCIATE=4
};
class WPA
{
public:
    WPA();

    void init(Napi::Env env,std::string ctrl_path);
    void init(Napi::Env env);

    void selectNetwork(std::string ssid, std::string pwd);
    void runEvent();

    void networkScan();

    std::vector<WifiInfo> getWifiList();

    bool networkConnect(std::string ssid,std::string bssid,std::string passwd);

    bool networkDisconnect();
    WifiInfo getCurrentStatus();

    Napi::ThreadSafeFunction onData = NULL;
private:
    void callbackSend(NoticeType type,int value);
    bool checkCommandSucess(char*);
    
    void ctrlConnect();
    void wpa_ctrl_event();

    void clearList();

    void parseWifiInfo(); //scan_result

    bool checkConnected();

    int networkAdd(struct wpa_ctrl *ctrl);
    void networkSelect(struct wpa_ctrl *ctrl,int id);
    void networkEnable(struct wpa_ctrl *ctrl,int id);
    void networkDisable(struct wpa_ctrl *ctrl);
    void networkDelete(struct wpa_ctrl *ctrl);
    void networkSaveConfig(struct wpa_ctrl *ctrl);
    void networkSet(struct wpa_ctrl *ctrl,int id,std::string key,std::string value);

    int wpa_ctrl_cmd(struct wpa_ctrl *ctrl, const char *cmd, char *buf);

    std::vector<WifiInfo> _wifiList;
    bool connected;

    std::mutex _commandMutex;
    std::mutex _listMutex;

    std::thread th;

    wpa_ctrl* _ctrl;
    wpa_ctrl* _ctrl_event;
    
    std::string _ctrlPath;

};
