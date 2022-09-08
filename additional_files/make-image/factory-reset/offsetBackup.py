import sys
import json

if len(sys.argv) < 3:
    exit()

rel_path = sys.argv[1]
target_path = sys.argv[2]
#target_path = "/opt/capsuleFW/capsuleSetting.json"

rel_file = open(rel_path,'r')
target_file = open(target_path,'r')

rel_json = json.load(rel_file)
target_json = json.load(target_file)

target_json["led_offset"] = rel_json["led_offset"]
target_json["height_offset"] = rel_json["height_offset"]

save_file = open(target_path,'w')

save_file.write(json.dumps(target_json,indent=4))

