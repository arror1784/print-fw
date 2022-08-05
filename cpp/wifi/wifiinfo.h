#ifndef WIFIINFO_H
#define WIFIINFO_H

#include <string>

class WifiInfo
{
public:
    WifiInfo(std::string ssid, std::string bssid, bool flags, int freq, int signal_level);

    std::string ssid;
    std::string bssid;
    bool flags;
    int freq;
    int signal_level;
};

#endif // WIFIINFO_H
