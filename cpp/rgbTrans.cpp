#include "napi.h"

#include "dt/dt.h"
#include "base64/base64.h"

#include <cmath>
#include <execution>

#include <iostream>
#include <string>
#include <fstream>

#include <mutex>

#include "mio/mio.hpp"


#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION

#include "stb/stb_image.h"
#include "stb/stb_image_write.h"

#include "communicate.h"

std::mutex m;
unsigned char* pngInMem = nullptr;
int len = 0;

std::vector<uint8_t>& pixelContration(uint8_t* png,std::vector<uint8_t>& out, int delta, float yMult,const int width,const int height);
std::vector<uint32_t> imageCompressL10(std::vector<uint8_t>& out,const int width,const int height);
// 자바스크립트의 String 객체를 반환하는 함수입니다.
// 파라미터는 info[n] 형태로 얻어올 수 있습니다.

Napi::String setImage(const Napi::CallbackInfo& info){
    std::lock_guard<std::mutex> lock(m);
    Communicate::getInstance().addData(pngInMem,len);
    // std::string result = "data:image/png;base64," + base64_encode(pngInMem,len);
    return Napi::String::New(info.Env(),"");
}
Napi::String transRgbToBase64(const Napi::CallbackInfo& info){ 
    // 이미지 path 를 받아와서 변환을 한뒤 base64 형식으로 반환 
    // image path, int delta, float yMult, bool isL10
    Napi::Env env = info.Env();
	if(info.Length() < 3){
		return Napi::String::New(env,"");
	}
	std::string path = info[0].As<Napi::String>();
	int delta = info[1].As<Napi::Number>().Int32Value();
	double ymult = info[2].As<Napi::Number>().DoubleValue();
    bool isL10 = info[3].As<Napi::Number>().ToBoolean();

	std::ifstream in(path,std::ios_base::binary);
    in.seekg(0, std::ios::end);
    int fileSize = in.tellg();

    std::vector<uint8_t> buff(fileSize,0);

    in.seekg(0, std::ios::beg);
    in.read((char*)buff.data(), fileSize);

    int w;
    int h;
    int comp;

    stbi_set_flip_vertically_on_load(true);
    
    uint8_t* png = stbi_load_from_memory(buff.data(), fileSize, &w, &h, &comp, STBI_grey);

    int pngSize = w*h;

	std::vector<uint8_t> finalImg(pngSize,0);
    pixelContration(png,finalImg,delta,ymult,w,h);
    stbi_image_free(png);

    std::lock_guard<std::mutex> lock(m);

    if(isL10){
        if(h != 1620)
            return Napi::String::New(env,"");
    }else{
        if(h != 1440)
            return Napi::String::New(env,"");
    }
    
    STBIW_FREE(pngInMem);

    if(isL10){
        auto compressedImage = imageCompressL10(finalImg,2560,1620);

        pngInMem = stbi_write_png_to_mem((const unsigned char*)compressedImage.data(), 2160, 540, 2560, STBI_rgb_alpha, &len);

    }else{
        pngInMem = stbi_write_png_to_mem((const unsigned char*)finalImg.data(), 1440, 1440, 2560, STBI_grey, &len);
    }
    return Napi::String::New(env,"");
}
std::vector<uint8_t>& pixelContration(uint8_t* png,std::vector<uint8_t>& out, int delta, float yMult,const int width,const int height){ 
  // 이미지 path 를 받아와서 변환을 한뒤 base64 형식으로 반환 
  // image path,

    bool isShrink = delta < 0;

    const int imgSize = width * height;

    // unsigned char* bits = ori.data();
    image<uint8_t> origImg(width, height, png);
    image<float>* sdfImage;

    if (isShrink)
    {
        sdfImage = dt(&origImg, 0, yMult);
        int threshold = 1 - delta;

        std::transform(std::execution::par_unseq,sdfImage->data, sdfImage->data + imgSize, out.begin(), [threshold](float flt)->uint8_t {
            if (std::round(flt) >= threshold)
                return 255;
            return 0;
            });

    }
    else
    {
        sdfImage = dt(&origImg, 255, yMult);
        int threshold = delta;

        std::transform(std::execution::par_unseq,sdfImage->data, sdfImage->data + imgSize, out.begin(), [threshold](float flt)->uint8_t {
            if (std::round(flt) <= threshold)
                return 255;
            return 0;
        });

    }
    delete sdfImage;
  	return out;
}
std::vector<uint32_t> imageCompressL10(std::vector<uint8_t>& ori,const int width,const int height){ 

    const int targetWidth = 540;
    const int targetHeight = 2560;

    image<uint8_t> orig(width, height,ori.data());
    image<uint32_t> target(targetWidth, targetHeight,true);

    for(int x = 0; x < 2560; x++){
        int y = 1;
        for(int i = 0; i < 1620;i+=3){

            uint8_t transRed = 0;
            uint8_t transGreen = 0;
            uint8_t transBlue = 0;

            for(int j = 0; j < 3; j++){
                if(i + j > height){
                    break;
                }

                auto col = imRef((&orig),x,i+j);
                uint8_t total = col;
                if(j == 0){
                    transRed = total;
                }else if(j == 1){
                    transGreen = total;
                }else{
                    transBlue = total;
                }
            }
            uint32_t rgba = ( 0xff << 24 | transRed << 16 | transGreen << 8 | transBlue);
            // uint32_t rgba = 0xff00ff00;

            imRef((&target),targetWidth - (i/3) - 1,x) = rgba;
        }
    }
    std::vector<uint32_t> out(targetWidth*targetHeight);
    std::copy(target.data,target.data + (targetHeight * targetWidth),out.begin());
    return std::move(out);
}
Napi::Object init(Napi::Env env, Napi::Object exports) {
    
    Communicate::getInstance();

    exports.Set(Napi::String::New(env, "transRgbToBase64"), Napi::Function::New(env, transRgbToBase64));
    exports.Set(Napi::String::New(env, "setImage"), Napi::Function::New(env, setImage));


    return exports;
};

NODE_API_MODULE(rgbTrans, init);