#!/bin/bash

# work on rapsberry pi local system

# copy "install" folder to raspberry pi

# run ./hixPrinterInstaller [product_name]

# To do after run this script

# rsync -avz ./config/qt5pi pi@$1:/usr/local
# sudo raspi-config (set to wifi country)
# sudo incrontab -e (set incrontab setting config/incrontab-e)

if [ "$#" -ne 1 ]
	then
	echo "usage: sudo " $0 "[product_name]"
	exit 1
fi

git clone https://github.com/waveshare/LCD-show.git

cd LCD-show
head -n -6 ./LCD35C-show > ./LCD32C-show-temp
chmod +x ./LCD32C-show-temp
./LCD32C-show-temp

cd ..

cp ./config/rc.local /etc/rc.local
cp ./config/autostart /etc/xdg/lxsession/LXDE-pi/autostart
cp ./config/sshd_config /etc/ssh/sshd_config
cp ./config/lightdm.conf /etc/lightdm/lightdm.conf
cp ./config/black_image.jpg /usr/share/rpd-wallpaper/black_image.jpg
cp ./config/cmdline.txt /boot/cmdline.txt
cp ./config/react.service /etc/systemd/system/react.service
cp ./config/daphne.service /etc/systemd/system/daphne.service
cp ./config/desktop-items-0.conf /home/pi/.config/pcmanfm/LXDE-pi/desktop-items-0.conf
cp ./config/desktop-items-1.conf /home/pi/.config/pcmanfm/LXDE-pi/desktop-items-1.conf
cp ./config/pcmanfm.conf /home/pi/.config/pcmanfm/LXDE-pi/pcmanfm.conf
cp ./config/LXDE-pi/desktop-items-0.conf /etc/xdg/pcmanfm/LXDE-pi/desktop-items-0.conf
cp ./config/LXDE-pi/desktop-items-1.conf /etc/xdg/pcmanfm/LXDE-pi/desktop-items-1.conf
cp ./config/LXDE-pi/pcmanfm.conf /etc/xdg/pcmanfm/LXDE-pi/pcmanfm.conf
cp ./config/C10.service /etc/avahi/services/C10.service
cp ./config/libstdc++.so.6.0.26 /usr/lib/arm-linux-gnueabihf/libstdc++.so.6
cp ./config/wpa_supplicant.conf /etc/wpa_supplicant/wpa_supplicant.conf

cp ./config/99-fbturbo.conf /usr/share/X11/xorg.conf.d/99-fbturbo.conf

service avahi-daemon restart

systemctl enable react.service
systemctl start react.service
systemctl enable daphne.service
systemctl start daphne.service

cp ./config/opt/* /opt/ -r
chmod 777 /opt/capsuleFW/capsuleSetting.json
chmod 777 /opt/capsuleFW/download
chmod 777 /opt/capsuleFW/print
chmod 777 /opt/capsuleFW/resin
chown pi:pi /opt/capsuleFW/print/printFilePath
chmod +x /opt/capsuleFW/USBCheck.sh

if [ "$1" == "C10" ]; then
	cp ./config/C10/config.txt /boot/config.txt
	cp ./config/C10/99-calibration.conf /usr/share/X11/xorg.conf.d/99-calibration.conf
	echo "{\"product\":\"C10\"}" > /opt/capsuleFW/product.json
elif [ "$1" == "L10" ]; then
	cp ./config/L10/config.txt /boot/config.txt
	cp ./config/L10/99-calibration.conf /usr/share/X11/xorg.conf.d/99-calibration.conf
	echo "{\"product\":\"L10\"}" > /opt/capsuleFW/product.json
else
	echo "no product " $1
fi

rm /etc/xdg/autostart/piwiz.desktop

echo "rasp
rasp" | passwd pi

echo "rasp
rasp" | passwd root

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

apt-get update 

apt-get install yarn -y
yarn global add serve

apt-get install redis-server -y

apt-get install exfat-fuse exfat-utils -y
apt-get install fonts-unfonts-core -y

apt-get build-dep qt4-x11 -y
apt-get build-dep libqt5gui5 -y
apt-get install libudev-dev libinput-dev libts-dev libxcb-xinerama0-dev libxcb-xinerama0 -y
apt-get install incron -y

mkdir /usr/local/qt5pi
chown pi:pi /usr/local/qt5pi 

rpi-update

rm ./config -r
rm ./@0

reboot

