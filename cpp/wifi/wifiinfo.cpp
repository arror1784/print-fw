#include "wifiinfo.h"

WifiInfo::WifiInfo(int networkID, std::string ssid, std::string bssid, bool flags, int freq, int signal_level, bool saved,bool connected):
    networkID(networkID),ssid(ssid),bssid(bssid),flags(flags),freq(freq),signal_level(signal_level),saved(saved),connected(connected)
{

}