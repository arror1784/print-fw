#include <napi.h>

#include "dt/dt.h"
#include "base64/base64.h"

#include <cmath>
#include <execution>

#include <filesystem>
#include <iostream>
#include <string>
#include <fstream>

#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION

#include "stb/stb_image.h"
#include "stb/stb_image_write.h"

std::vector<uint8_t>& pixelContration(uint8_t* png,std::vector<uint8_t>& out, int delta, float yMult,const int width,const int height);
std::vector<uint8_t>& imageCompressL10(std::vector<uint8_t>& out,const int width,const int height);
// 자바스크립트의 String 객체를 반환하는 함수입니다.
// 파라미터는 info[n] 형태로 얻어올 수 있습니다.
Napi::String transRgbToBase64C10(const Napi::CallbackInfo& info){ 
    // 이미지 path 를 받아와서 변환을 한뒤 base64 형식으로 반환 
    // image path, int delta, float yMult, pixelCompress bool
    Napi::Env env = info.Env();

    return Napi::String::New(env,"asd");
}
Napi::String transRgbToBase64L10(const Napi::CallbackInfo& info){ 
    // 이미지 path 를 받아와서 변환을 한뒤 base64 형식으로 반환 
    // image path, int delta, float yMult
    Napi::Env env = info.Env();
	if(info.Length() < 3){
		return Napi::String::New(env,"");
	}
	std::string path = info[0].As<Napi::String>();
	int delta = info[1].As<Napi::Number>().Int32Value();
	double ymult = info[2].As<Napi::Number>().DoubleValue();

	std::ifstream in(path,std::ios_base::binary);
    in.seekg(0, std::ios::end);
    int fileSize = in.tellg();

    std::vector<uint8_t> buff(fileSize,0);

    in.seekg(0, std::ios::beg);
    in.read((char*)buff.data(), fileSize);

    int w;
    int h;
    int comp;

    uint8_t* png = stbi_load_from_memory(buff.data(), fileSize, &w, &h, &comp, STBI_grey);

    if(w != 2560 || h != 1620)
        return Napi::String::New(env,"error");

    int pngSize = w*h*comp;

	std::vector<uint8_t> finalImg(pngSize,0);
    pixelContration(png,finalImg,delta,ymult,w,h);
    // imageCompressL10(buff,1620,2560);
    
    // stbi_image_free(png);
    
    int len;
    unsigned char* pngInMem = stbi_write_png_to_mem(finalImg.data(), w, w, h, 1, &len);
    std::string pngStringMem((char*)pngInMem, len);

    std::ofstream out("/home/jsh/test.png");

    if(out.is_open()){
        out << pngStringMem;
    }
    out.close();

    std::string result = base64_encode(finalImg.data(),pngSize);
    return Napi::String::New(env,result);
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

        std::transform(sdfImage->data, sdfImage->data + imgSize, out.begin(), [threshold](float flt)->uint8_t {
            if (std::round(flt) >= threshold)
                return 255;
            return 0;
            });

    }
    else
    {
        sdfImage = dt(&origImg, 255, yMult);
        int threshold = delta;
        std::transform(sdfImage->data, sdfImage->data + imgSize, out.begin(), [threshold](float flt)->uint8_t {
            if (std::round(flt) <= threshold)
                return 255;
            return 0;
        });

    }
    delete sdfImage;
  	return out;
}
std::vector<uint8_t>& imageCompressL10(std::vector<uint8_t>& out,const int width,const int height){ 

//     const int targetWidth = 540;

//     for(int x = 0; x < width; x++){
//         int y = 1;
//         for(int i = 0; i < height;i+=3){

//             uint32_t transRed = 0;
//             uint32_t transGreen = 0;
//             uint32_t transBlue = 0;

//             for(int j = 0; j < 3; j++){
//                 if(i + j > height){
//                     break;
//                 }
//                 auto col = img.pixel(x,i + j);
//                 uint32_t total = col & 0x000000ff;
//                 if(j == 0){
//                     transRed = total;
//                 }else if(j == 1){
//                     transGreen = total;
//                 }else{
//                     transBlue = total;
//                 }
//             }
//             QRgb rgb = RGB_MASK & (transBlue << 16 | transGreen << 8 | transRed);
//             imgE.setPixel(targetWidth - y++,x, rgb);
//         }
//     }
  return out;
}
//
// 애드온 이니셜라이져입니다.
// 자바스크립트 오브젝트(exports)에 함수를 하나씩 집어넣고,
// 다 집어넣었으면 리턴문으로 반환하면 됩니다.
Napi::Object init(Napi::Env env, Napi::Object exports) {
    //d
    // 위의 함수를 "sayHi"라는 이름으로 집어넣습니다.
    exports.Set(Napi::String::New(env, "transRgbToBase64C10"), Napi::Function::New(env, transRgbToBase64C10));
    exports.Set(Napi::String::New(env, "transRgbToBase64L10"), Napi::Function::New(env, transRgbToBase64L10));

    //
    // 다 집어넣었다면 반환합니다.
    return exports;
};

//
// 애드온의 별명과, 이니셜라이져를 인자로 받습니다.
NODE_API_MODULE(rgbTrans, init);