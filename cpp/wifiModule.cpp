#include "napi.h"

#include "wifi/wpa.h"

Napi::Boolean wifiInit(const Napi::CallbackInfo& info);

Napi::Boolean wifiScan(const Napi::CallbackInfo& info);
Napi::Boolean wifiConnect(const Napi::CallbackInfo& info); //ssid:string bssid:string password?:string
Napi::Boolean wifiDisconnect(const Napi::CallbackInfo& info);
Napi::Array wifiGetList(const Napi::CallbackInfo& info);
Napi::Boolean wifiDeleteConnection(const Napi::CallbackInfo& info);
Napi::Object wifiGetCurrentConnection(const Napi::CallbackInfo& info);
Napi::Boolean wifiOnData(const Napi::CallbackInfo& info);


Napi::Object init(Napi::Env env, Napi::Object exports) {
    
    exports.Set(Napi::String::New(env, "init"), Napi::Function::New(env, wifiInit));

    exports.Set(Napi::String::New(env, "scan"), Napi::Function::New(env, wifiScan));
    exports.Set(Napi::String::New(env, "connect"), Napi::Function::New(env, wifiConnect));
    exports.Set(Napi::String::New(env, "disconnect"), Napi::Function::New(env, wifiDisconnect));
    exports.Set(Napi::String::New(env, "getList"), Napi::Function::New(env, wifiGetList));
    exports.Set(Napi::String::New(env, "deleteConnection"), Napi::Function::New(env, wifiDeleteConnection));
    exports.Set(Napi::String::New(env, "getCurrentConnection"), Napi::Function::New(env, wifiGetCurrentConnection));
    exports.Set(Napi::String::New(env, "onData"), Napi::Function::New(env, wifiOnData));

    return exports;
};

WPA wpa;

Napi::Boolean wifiInit(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();

    if(info.Length() > 1){
        Napi::TypeError::New(env, "Invalid argument count").ThrowAsJavaScriptException();
    }else if(info.Length() == 1 && !info[0].IsString()){
        Napi::TypeError::New(env, "Invalid argument type").ThrowAsJavaScriptException();
    }
    info.Length() == 1 ? wpa.init(env,info[0].As<Napi::String>()) : wpa.init(env);

    return Napi::Boolean::New(env,true);
}
Napi::Boolean wifiScan(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    wpa.networkScan();

    return Napi::Boolean::New(env,true);    
}

Napi::Boolean wifiConnect(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();

    if(info.Length() != 3){
        Napi::TypeError::New(env, "Invalid argument count").ThrowAsJavaScriptException();
    }else if(!info[0].IsString() && !info[1].IsString() && !info[2].IsString()){
        Napi::TypeError::New(env, "Invalid argument type").ThrowAsJavaScriptException();
    }

    wpa.networkConnect(info[0].As<Napi::String>(),info[1].As<Napi::String>(),info[2].As<Napi::String>());

    return Napi::Boolean::New(env,true);
}
Napi::Boolean wifiDisconnect(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();

    wpa.networkDisconnect();

    return Napi::Boolean::New(env,true);
    
}
Napi::Array wifiGetList(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();

    auto result = wpa.getWifiList();

    Napi::Array arr = Napi::Array::New(env);

    for (int i = 0; i < result.size(); i++)
    {
        Napi::Object ob = Napi::Object::New(env);
    
        ob.Set("bssid",result[i].bssid);
        ob.Set("ssid",result[i].ssid);
        ob.Set("flags",result[i].flags);
        ob.Set("freq",result[i].freq);
        ob.Set("signal_level",result[i].signal_level);

        ob.Set("connected",result[i].connected);
        arr.Set(i,ob);
    }
    
    return arr;
    
}
Napi::Boolean wifiDeleteConnection(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();

    return Napi::Boolean::New(env,true);
    
}
Napi::Object wifiGetCurrentConnection(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    Napi::Object ob = Napi::Object::New(env);

    auto result = wpa.getCurrentStatus();
    ob.Set("bssid",result.bssid);
    ob.Set("ssid",result.ssid);
    ob.Set("flags",result.flags);
    ob.Set("freq",result.freq);
    ob.Set("signal_level",result.signal_level);

    ob.Set("connected",result.connected);

    return ob;
    
}
Napi::Boolean wifiOnData(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();

    if(info.Length() != 1){
        Napi::TypeError::New(env, "Invalid argument count").ThrowAsJavaScriptException();
        return Napi::Boolean::New(env,true);

    }

    wpa.onData = Napi::ThreadSafeFunction::New(
      env,
      info[0].As<Napi::Function>(),  // JavaScript function called asynchronously
      "Resource Name",         // Name
      0,                       // Unlimited queue
      1,                       // Only one thread will use this initially
      []( Napi::Env ) {        // Finalizer used to clean threads up

      } );

    return Napi::Boolean::New(env,true);
    
}

NODE_API_MODULE(wifiModule, init);