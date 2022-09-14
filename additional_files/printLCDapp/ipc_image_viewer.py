import tkinter as tk

import threading

import mmap
import json

import sysv_ipc

import base64

mq = sysv_ipc.MessageQueue(115200,sysv_ipc.IPC_CREAT)

root = tk.Tk()

lb = tk.Label(root,image=tk.PhotoImage())
lb.pack()

def msg():
    mmpfn = open('/opt/capsuleFW/print/mmap',"r+b")
    mmp = mmap.mmap(mmpfn.fileno(),0)
    while(1):
        try:
            (message,type) = mq.receive()
            parsingMsg = json.loads(message.decode('utf-8','ignore').split('}')[0]+'}')
            if(parsingMsg["cmd"] == "imageChanged"):
                print("changeImage command")
                mmp.seek(0)
                imgbs64=base64.b64encode(mmp.read(parsingMsg["size"]))
                baseImg = tk.PhotoImage(data=imgbs64)
                lb.configure(image = baseImg)
                lb.pack()
            if(parsingMsg["cmd"] == "changeWH"):
                pass
            if(parsingMsg["cmd"] == "openMmap"):
                mmpfn = open(parsingMsg["path"],"r+b")
                mmp = mmap.mmap(mmpfn.fileno(),0)
        except:
            print("except")
            continue
        
    return
try:
    while(1):
        mq.receive(block=False)
except:
    print("clear queue message")
    
t = threading.Thread(target=msg)
t.daemon = True
t.start()

root.configure(bg='black')
root.attributes("-fullscreen",True)
root.mainloop()