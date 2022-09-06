import sys
import json

print(sys.argv)
if len(sys.argv) < 2:
    exit()

rel_path = sys.argv[1]
target_path = "/opt/capsuleFW/capsuleSetting.json"

rel_file = open(rel_path,'r')
target_file = open(target_path,'r')

rel_json = json.load(rel_file)
target_json = json.load(target_file)

target_json["material_list"] = rel_json["material_list"]

save_file = open(target_path,'w')

save_file.write(json.dumps(target_json,indent=4))

