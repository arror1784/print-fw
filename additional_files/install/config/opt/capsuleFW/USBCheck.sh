#!/bin/sh

watch_path=$1
folder_name=$2

target_path=$watch_path/$folder_name/C10update

resin_folder=$target_path/RESIN_UPDATE
resin_file=$resin_folder/RESIN_UPDATE
sw_folder=$target_path/SW_UPDATE
sw_file=$sw_folder/SW_UPDATE
hardreset_folder=$target_path/HARDRESET
hardreset_file=$hardreset_folder/HARDRESET

update_bool=false
echo "sdasdasd" >> /home/pi/asd
#check resin update
if [ -d "$resin_folder" ] && [ -e "$resin_file" ];then
	#echo "resin update" >> /home/pi/log
	unzip -P "HIXPW_C10" -o $resin_folder/USBResin.zip -d /opt/resinUpdate/ \
		|| exit
	python3 /opt/resinUpdate/resinUpdate.py /opt/resinUpdate/material_list.json
	rm /opt/capsuleFW/resin/*
	cp /opt/resinUpdate/*.json /opt/capsuleFW/resin/
	chmod 777 /opt/capsuleFW/resin/*
	rm /opt/capsuleFW/resin/material_list.json
	rm /opt/resinUpdate/*.json

	rm $resin_file

	update_bool=true
fi

#check SW update
if [ -d "$sw_folder" ] && [ -e "$sw_file" ];then
	#echo "SW update" >> /home/pi/log
	unzip -P "HIXPW_C10" -o $sw_folder/USBUpdate.zip -d /opt/SWUpdate/ && \
	chmod +x /opt/SWUpdate/update.sh && \
	/opt/SWUpdate/update.sh /opt/SWUpdate/files.zip /opt/SWUpdate/ /opt/SWUpdate/version.json
	
	rm $sw_file
	update_bool=true
fi

if [ "$update_bool" = true ]; then
	reboot
	exit
fi

#check hardReset
if [ -d "$hardreset_folder" ] && [ -e "$hardreset_file" ];then
	#echo "there is hardreset" >> /home/pi/log
	rm $hardreset_file
	
	/boot/factory_reset --reset
fi

