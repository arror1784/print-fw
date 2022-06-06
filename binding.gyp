# https://github.com/nodejs/node-addon-api/blob/master/doc/setup.md
# https://github.com/nodejs/node-addon-api/blob/master/test/binding.gyp
{
    "targets": [{ 
        "target_name": "rgbTrans",
        
        'cflags_cc': [ '-std=c++17' ],
        'cflags!': [ "-fno-exceptions" ],
        "cflags_cc!": [ '-fexceptions', '-fno-rtti', '-fno-exceptions','-std=gnu++14' ],

        "defines": [ "NAPI_CPP_EXCEPTIONS" ], #NAPI_DISABLE_CPP_EXCEPTIONS
        
        "include_dirs" : [
            "<!@(node -p \"require('node-addon-api').include\")"
        ], 
        "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
        "libraries": [
            
        ],
        # 여기서 타겟 소스파일을 지정합니다.
        "sources": [ "cpp/rgbTrans.cpp","cpp/base64/base64.cpp","cpp/dt/*.h","cpp/stb/stb_image.h","cpp/stb/stb_image_write.h","cpp/stb/stb_image_resize.h" ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
        'msvs_settings': {
            'VCCLCompilerTool': {
                'AdditionalOptions': [ '-std:c++17', ],
            }
        },
        'conditions': [
            [ 'OS=="win"', {
                'libraries':[
                    '-LC:\Program Files\oneapi-tbb\lib'
                ]
            }],['OS=="linux"', {
                'libraries': [
                    "-ltbb"
                ],
            }],['target_arch=="arm"',{
                'libraries':[
                    '-Llib'
                ],
                'libraries!':[
                    '-ltbb'
                ]
            }]
        ]
    }]
}
