#include <napi.h>

void wifiScan(const Napi::CallbackInfo& info);

void wifiConnect(const Napi::CallbackInfo& info); //ssid:string bssid:string password?:string
void wifiDisconnect(const Napi::CallbackInfo& info);
void wifiGetList(const Napi::CallbackInfo& info);
void wifiDeleteConnection(const Napi::CallbackInfo& info);
void wifiGetCurrentConnection(const Napi::CallbackInfo& info);
void wifiOnData(const Napi::CallbackInfo& info);




Napi::Object init(Napi::Env env, Napi::Object exports) {
    
    exports.Set(Napi::String::New(env, "scan"), Napi::Function::New(env, wifiScan));

    exports.Set(Napi::String::New(env, "connect"), Napi::Function::New(env, wifiConnect));
    exports.Set(Napi::String::New(env, "disconnect"), Napi::Function::New(env, wifiDisconnect));
    exports.Set(Napi::String::New(env, "getList"), Napi::Function::New(env, wifiGetList));
    exports.Set(Napi::String::New(env, "deleteConnection"), Napi::Function::New(env, wifiDeleteConnection));
    exports.Set(Napi::String::New(env, "getCurrentConnection"), Napi::Function::New(env, wifiGetCurrentConnection));
    exports.Set(Napi::String::New(env, "onData"), Napi::Function::New(env, wifiOnData));

    return exports;
};

NODE_API_MODULE(wifiModule, init);