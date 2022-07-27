#include "wifiinfo.h"

WifiInfo::WifiInfo(int networkID, std::string ssid, std::string bssid, bool flags, int freq, int signal_level, bool saved,bool connected):
    networkID(networkID),ssid(ssid),bssid(bssid),flags(flags),freq(freq),signal_level(signal_level),saved(saved),connected(connected)
{

}

bool WifiInfo::getConnected() const
{
    return connected;
}

void WifiInfo::setConnected(bool value)
{
    connected = value;
}

bool WifiInfo::getSaved() const
{
    return saved;
}

void WifiInfo::setSaved(bool value)
{
    saved = value;
}

int WifiInfo::getSignal_level() const
{
    return signal_level;
}

void WifiInfo::setSignal_level(int value)
{
    signal_level = value;
}

int WifiInfo::getFreq() const
{
    return freq;
}

void WifiInfo::setFreq(int value)
{
    freq = value;
}

bool WifiInfo::getFlags() const
{
    return flags;
}

void WifiInfo::setFlags(bool &value)
{
    flags = value;
}

std::string WifiInfo::getBssid() const
{
    return bssid;
}

void WifiInfo::setBssid(const std::string &value)
{
    bssid = value;
}

std::string WifiInfo::getSsid() const
{
    return ssid;
}

void WifiInfo::setSsid(const std::string &value)
{
    ssid = value;
}

int WifiInfo::getNetworkID() const
{
    return networkID;
}

void WifiInfo::setNetworkID(int value)
{
    networkID = value;
}
