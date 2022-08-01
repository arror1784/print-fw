#ifndef WIFIINFO_H
#define WIFIINFO_H

#include <string>

class WifiInfo
{
public:
    WifiInfo(int networkID, std::string ssid, std::string bssid, bool flags, int freq, int signal_level, bool saved,bool connected);

    int networkID;
    std::string ssid;
    std::string bssid;
    bool flags;
    int freq;
    int signal_level;

    bool saved = false;
    bool connected = false;

};

#endif // WIFIINFO_H
