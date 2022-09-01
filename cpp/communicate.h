#include "mio/mio.hpp"
#include "singleton.h"

#include <fstream>

#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>

void allocate_file(const std::string& path, const int size)
{
    std::ofstream file(path);
    std::string s(size, '0');
    file << s;
}

class Communicate : public Singleton<Communicate>{

    struct messageBuf
    {
        long msg_type;
        char mtext[256];
    };

public:
    explicit Communicate(){
        allocate_file(mmpPath,100000);
        mqKey = msgget(115200,IPC_CREAT|0666);

        ummap.map(mmpPath,0,mio::map_entire_file,error);
    }
    void addData(uint8_t *data,int size){
        std::copy_n(data,size,ummap.begin());

        std::string msg = "{\"cmd\":\"imageChanged\",\"size\":" + std::to_string(size) + "}";

        sendMessage(msg);
    }
private:    
    void sendMessage(std::string msg){
        struct messageBuf mybuf;
        if(msg.length() > 255){
            return;
        }
        std::fill_n(mybuf.mtext,256,0x00);
        std::copy_n(msg.data(),msg.length(),mybuf.mtext);
        mybuf.msg_type = 1;
        if (msgsnd( mqKey, &mybuf, sizeof(mybuf), IPC_NOWAIT) == -1)
        {
            perror("msgsnd error : ");
            // exit(0);
        }
        
    }


    mio::ummap_sink ummap;
    std::error_code error;

    key_t mqKey;

    const std::string mmpPath = "/opt/capsuleFW/print/mmap";

};