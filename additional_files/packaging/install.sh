#!/bin/bash

TARGET_FOLDER="./targets"

TARGET_IP=""
TARGET_PASSWD=""

SERVICES=(
"daphne.service"
"react.service"
)

ROOT_UPDATE_TARGET=(
"capsuleFW"
"capsuleSetting.json"
"rc.local"
"autostart"
"sshd_config"
"lightdm.conf"
"black_image.jpg"
"daphne.service"
"react.service"
"version.json"
"LXDE-pi/desktop-items-0.conf"
"LXDE-pi/desktop-items-1.conf"
"LXDE-pi/pcmanfm.conf"
"C10.service"
)
ROOT_UPDATE_PATH=(
"/opt/capsuleFW/bin/capsuleFW"
"/opt/capsuleFW/capsuleSetting.json"
"/etc/rc.local"
"/etc/xdg/lxsession/LXDE-pi/autostart"
"/etc/ssh/sshd_config"
"/etc/lightdm/lightdm.conf"
"/usr/share/rpd-wallpaper/black_image.jpg"
"/etc/systemd/system/daphne.service"
"/etc/systemd/system/react.service"
"/opt/capsuleFW/version.json"
"/etc/xdg/pcmanfm/LXDE-pi/desktop-items-0.conf"
"/etc/xdg/pcmanfm/LXDE-pi/desktop-items-1.conf"
"/etc/xdg/pcmanfm/LXDE-pi/pcmanfm.conf"
"/etc/avahi/services/C10.service"
)

PI_UPDATE_TARGET=(
"desktop-items-0.conf"
"desktop-items-1.conf"
)

PI_UPDATE_PATH=(
"/home/pi/.config/pcmanfm/LXDE-pi/desktop-items-0.conf"
"/home/pi/.config/pcmanfm/LXDE-pi/desktop-items-1.conf"
)

if [ $# -eq 0 ]; then
	echo "usage : %s [address] [passwd]" $0
	exit 0
fi

TARGET_IP=$1
TARGET_PASSWD=$2

SSHPASS="sshpass -p ${TARGET_PASSWD}"

SSH_COMMAND_PI="${SSHPASS} ssh pi@${TARGET_IP}"
SSH_COMMAND_ROOT="${SSHPASS} ssh root@${TARGET_IP}"

#capsuleFW process kill

${SSHPASS} ssh pi@${TARGET_IP} pkill capsuleFW

for (( i = 0 ; i < ${#ROOT_UPDATE_TARGET[@]} ; i++ )) ; do
	echo ${ROOT_UPDATE_TARGET[$i]} ${ROOT_UPDATE_PATH[$i]}
	${SSHPASS} scp ${TARGET_FOLDER}/${ROOT_UPDATE_TARGET[$i]} root@${TARGET_IP}:${ROOT_UPDATE_PATH[$i]}
done

for (( i = 0 ; i < ${#PI_UPDATE_TARGET[@]} ; i++ )) ; do
	echo ${PI_UPDATE_TARGET[$i]} ${PI_UPDATE_PATH[$i]}
	${SSHPASS} scp ${TARGET_FOLDER}/${PI_UPDATE_TARGET[$i]} pi@${TARGET_IP}:${PI_UPDATE_PATH[$i]}
done

for (( i = 0 ; i < ${#SERVICES[@]} ; i++ )) ; do
	${SSHPASS} ssh root@${TARGET_IP} systemctl enable ${SERVICES[$i]}
	${SSHPASS} ssh root@${TARGET_IP} systemctl start ${SERVICES[$i]}
done

#${SSH_COMMAND_ROOT} mkdir /opt/capsuleFW_react/ 2>&1 > /dev/null
${SSH_COMMAND_ROOT} "rm -rf /opt/capsuleFW_react"
${SSH_COMMAND_ROOT} "service avahi-daemon restart"
${SSHPASS} scp -r ./capsuleFW_react root@${TARGET_IP}:/opt/
${SSHPASS} scp -r ./resin root@${TARGET_IP}:/opt/capsuleFW/
${SSH_COMMAND_ROOT} chmod 777 /opt/capsuleFW/resin
${SSH_COMMAND_ROOT} chmod 666 /opt/capsuleFW/resin/*

${SSH_COMMAND_ROOT} "mkdir /opt/capsuleFW/print"
${SSH_COMMAND_ROOT} "mkdir /opt/capsuleFW/download"

${SSH_COMMAND_ROOT} "chmod 777 /opt/capsuleFW/print"
${SSH_COMMAND_ROOT} "chmod 777 /opt/capsuleFW/download"

#frontend
#yarn installed

if ${SSH_COMMAND_PI} type yarn 2> /dev/null; then
	echo "yarn installed"
else
	echo "yarn install"
	${SSH_COMMAND_PI} "curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -"
	${SSH_COMMAND_PI} "echo \"deb https://dl.yarnpkg.com/debian/ stable main\" | sudo tee /etc/apt/sources.list.d/yarn.list"

	${SSH_COMMAND_PI} sudo apt-get update -y
	${SSH_COMMAND_PI} sudo apt-get install yarn -y

	${SSH_COMMAND_PI} yarn global add serve
fi

#backend
if ${SSH_COMMAND_PI} type redis-server 2> /dev/null; then
	echo "redis-server installed"
else
	echo "redis-server install"
	${SSH_COMMAND_PI} "sudo apt-get install redis-server -y"
fi
${SSH_COMMAND_PI} "sudo pip3 install -r /opt/capsuleFW_react/backend/requirements.txt"

${SSH_COMMAND_PI} "sudo python3 /opt/capsuleFW_react/backend/manage.py makemigrations"
${SSH_COMMAND_PI} "sudo python3 /opt/capsuleFW_react/backend/manage.py migrate"

echo "Finish"
