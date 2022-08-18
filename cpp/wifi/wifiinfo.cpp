#include "wifiinfo.h"

WifiInfo::WifiInfo(std::string ssid, std::string bssid, bool flags, int freq, int signal_levelo,bool connected):
    ssid(ssid),bssid(bssid),flags(flags),freq(freq),signal_level(signal_level),connected(connected)
{

}