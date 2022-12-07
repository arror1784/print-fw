#!/bin/bash

SERVICES=(
"daphne.service"
"react.service"
)

ROOT_UPDATE_TARGET=(
"capsuleFW"
"C10.service"
"libstdc++.so.6.0.26"
"wpa_supplicant.conf"
"rc.local"
"autostart"
)
ROOT_UPDATE_PATH=(
"/opt/capsuleFW/bin/capsuleFW"
"/etc/avahi/services/C10.service"
"/usr/lib/arm-linux-gnueabihf/libstdc++.so.6"
"/etc/wpa_supplicant/wpa_supplicant.conf"
"/etc/rc.local"
"/etc/xdg/lxsession/LXDE-pi/autostart"
)

if [ $# -eq 0 ]; then
    echo "usage : %s [files] [dir] [version]" $0
    exit 0
fi
TARGET_FILE_NAME=$1
TARGET_FOLDER_NAME=${TARGET_FILE_NAME%%.*}
CURRENT_VERSION=$(cat "/opt/capsuleFW/version.json" | python3 -c "import sys, json; print(json.load(sys.stdin)['version'])")
unzip -o $TARGET_FILE_NAME -d $2

RMLIBLIST="${TARGET_FOLDER_NAME}/rmLibList"

for (( i = 0 ; i < ${#SERVICES[@]} ; i++ )) ; do
	systemctl stop ${SERVICES[$i]}
done

if [ "$CURRENT_VERSION" == "1.1.1" ]; then
	echo "1.1.1 wpa_supplicant"	
	cp -rf ${TARGET_FOLDER_NAME}/wpa_supplicant.conf /etc/wpa_supplicant/wpa_supplicant.conf
fi

echo "libstdc++.so.6"
cp -rf "${TARGET_FOLDER_NAME}/libstdc++.so.6.0.26" "/usr/lib/arm-linux-gnueabihf/libstdc++.so.6"

while read path
do
	echo "remove ${path}"
	rm -rf ${path}
done < $RMLIBLIST

cp -rf ${TARGET_FOLDER_NAME}/rc.local /etc/rc.local
cp -rf ${TARGET_FOLDER_NAME}/react.service /etc/systemd/system/react.service
cp -rf ${TARGET_FOLDER_NAME}/C10.service /etc/avahi/services/C10.service
service avahi-daemon restart

mv /opt/capsuleFW_react/backend/db.sqlite3 /opt/capsuleFW/

rm -rf /opt/capsuleFW_react/*
cp -rf ${TARGET_FOLDER_NAME}/capsuleFW_react/* /opt/capsuleFW_react/
echo "${TARGET_FOLDER_NAME}/capsuleFW_react"

mv /opt/capsuleFW/db.sqlite3 /opt/capsuleFW_react/backend/

for (( i = 0 ; i < ${#SERVICES[@]} ; i++ )) ; do
	systemctl enable ${SERVICES[$i]}
	systemctl start ${SERVICES[$i]}
done

dpkg -i ${TARGET_FOLDER_NAME}/libtbb2_2018~U6-4_armhf.deb


rm -rf /opt/capsuleFW/bin/capsuleFW
rm -rf /opt/capsuleFW/bin/print-fw
rm -rf /opt/capsuleFW/bin/print-fw-start.sh
rm -rf /opt/capsuleFW/bin/hix-image-viewer

cp -rf ${TARGET_FOLDER_NAME}/print-fw /opt/capsuleFW/bin/print-fw
cp -rf ${TARGET_FOLDER_NAME}/print-fw-start.sh /opt/capsuleFW/bin/print-fw-start.sh
cp -rf ${TARGET_FOLDER_NAME}/hix-image-viewer /opt/capsuleFW/bin/hix-image-viewer

chmod 755 /opt/capsuleFW/bin/print-fw
chmod 755 /opt/capsuleFW/bin/print-fw-start
chmod 755 /opt/capsuleFW/bin/hix-image-viewer

rm -rf /opt/capsuleFW/version.json
cp -rf $3 /opt/capsuleFW/

if ls /opt/capsuleFW/bin/capsuleFW; then
	pkill capsuleFW

	sleep 10

	chmod +x ${TARGET_FOLDER_NAME}/HGCommandSender
	${TARGET_FOLDER_NAME}/HGCommandSender "H201"

	rm -rf $2/*

	shutdown -h now

else

	sleep 1

	rm -rf $2/*

fi
