# https://github.com/nodejs/node-addon-api/blob/master/doc/setup.md
# https://github.com/nodejs/node-addon-api/blob/master/test/binding.gyp
{
    "targets": [{ 
        "target_name": "rgbTrans",

        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "defines": [ "NAPI_CPP_EXCEPTIONS" ], #NAPI_DISABLE_CPP_EXCEPTIONS
        "include_dirs" : [
            "<!@(node -p \"require('node-addon-api').include\")"
        ], 
        "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],

        # 여기서 타겟 소스파일을 지정합니다.
        "sources": [ "cpp/rgbTrans.cc" ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }, { 
        "target_name": "test",

        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "defines": [ "NAPI_CPP_EXCEPTIONS" ], #NAPI_DISABLE_CPP_EXCEPTIONS
        "include_dirs" : [
            "<!@(node -p \"require('node-addon-api').include\")"
        ], 
        "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],

        # 여기서 타겟 소스파일을 지정합니다.
        "sources": [ "test.cpp" ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}