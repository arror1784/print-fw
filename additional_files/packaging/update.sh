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
)
ROOT_UPDATE_PATH=(
"/opt/capsuleFW/bin/capsuleFW"
"/etc/avahi/services/C10.service"
"/usr/lib/arm-linux-gnueabihf/libstdc++.so.6"
"/etc/wpa_supplicant/wpa_supplicant.conf"
"/etc/rc.local"
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

#frontend
#yarn installed
if type yarn 2> /dev/null; then
	echo "yarn installed"
else
	echo "yarn install"
	curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
	echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

	apt-get update -y
	apt-get install yarn -y

	yarn global add serve
fi
#backend
if type redis-server 2> /dev/null; then
	echo "redis-server installed"
else
	echo "redis-server install"
	apt-get install redis-server -y
fi


dpkg -l | grep exfat-fuse || apt-get install exfat-fuse -y
dpkg -l | grep exfat-utils || apt-get install exfat-utils -y
dpkg -l | grep ntfs-3g || apt-get install ntfs-3g -y


pip3 install -r /opt/capsuleFW_react/backend/requirements.txt

python3 /opt/capsuleFW_react/backend/manage.py makemigrations
python3 /opt/capsuleFW_react/backend/manage.py migrate

for (( i = 0 ; i < ${#SERVICES[@]} ; i++ )) ; do
	systemctl enable ${SERVICES[$i]}
	systemctl start ${SERVICES[$i]}
done

dpkg -i ${TARGET_FOLDER_NAME}/libtbb2_2018~U6-4_armhf.deb

pkill capsuleFW

rm -rf /opt/capsuleFW/bin/capsuleFW
cp -rf ${TARGET_FOLDER_NAME}/capsuleFW /opt/capsuleFW/bin/capsuleFW
chmod 755 /opt/capsuleFW/bin/capsuleFW

rm -rf /opt/capsuleFW/version.json
cp -rf $3 /opt/capsuleFW/

sleep 1

chmod +x ${TARGET_FOLDER_NAME}/HGCommandSender
${TARGET_FOLDER_NAME}/HGCommandSender "H201"

rm -rf $2/*
	
shutdown -h now
