#!/bin/sh

export DISPLAY=:0.1
export ARM_VERSION=7

xhost +local:root
xhost +localhost

echo rasp | sudo -S /opt/capsuleFW/bin/w10 --no-sandbox