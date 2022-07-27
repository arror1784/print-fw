#ifndef WIFIINFO_H
#define WIFIINFO_H


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

public:

    int getNetworkID() const;
    void setNetworkID(int value);

    std::string getSsid() const;
    void setSsid(const std::string &value);

    std::string getBssid() const;
    void setBssid(const std::string &value);

    bool getFlags() const;
    void setFlags(bool &value);

    int getFreq() const;
    void setFreq(int value);

    int getSignal_level() const;
    void setSignal_level(int value);

    bool getSaved() const;
    void setSaved(bool value);

    bool getConnected() const;
    void setConnected(bool value);

};

#endif // WIFIINFO_H
