#!/bin/sh

reboot_pi () {
  umount /boot
  mount / -o remount,ro
  sync

  echo b > /proc/sysrq-trigger
  sleep 5
  exit 0
}

check_commands () {
  if ! command -v whiptail > /dev/null; then
      echo "whiptail not found"
      sleep 5
      return 1
  fi
  for COMMAND in grep cut sed parted fdisk findmnt partprobe; do
    if ! command -v $COMMAND > /dev/null; then
      FAIL_REASON="$COMMAND not found"
      return 1
    fi
  done
  return 0
}


get_variables () {
  ROOT_PART_DEV=$(findmnt / -o source -n)
  ROOT_PART_NAME=$(echo "$ROOT_PART_DEV" | cut -d "/" -f 3)
  ROOT_DEV_NAME=$(echo /sys/block/*/"${ROOT_PART_NAME}" | cut -d "/" -f 4)
  ROOT_DEV="/dev/${ROOT_DEV_NAME}"
  ROOT_PART_NUM=$(cat "/sys/block/${ROOT_DEV_NAME}/${ROOT_PART_NAME}/partition")

  BOOT_PART_DEV=$(findmnt /boot -o source -n)
  BOOT_PART_NAME=$(echo "$BOOT_PART_DEV" | cut -d "/" -f 3)
  BOOT_DEV_NAME=$(echo /sys/block/*/"${BOOT_PART_NAME}" | cut -d "/" -f 4)
  BOOT_PART_NUM=$(cat "/sys/block/${BOOT_DEV_NAME}/${BOOT_PART_NAME}/partition")

  OLD_DISKID=$(fdisk -l "$ROOT_DEV" | sed -n 's/Disk identifier: 0x\([^ ]*\)/\1/p')

  check_noobs

  ROOT_DEV_SIZE=$(cat "/sys/block/${ROOT_DEV_NAME}/size")
  TARGET_END=$((ROOT_DEV_SIZE - 1))

  PARTITION_TABLE=$(parted -m "$ROOT_DEV" unit s print | tr -d 's')

  LAST_PART_NUM=$(echo "$PARTITION_TABLE" | tail -n 1 | cut -d ":" -f 1)

  ROOT_PART_LINE=$(echo "$PARTITION_TABLE" | grep -e "^${ROOT_PART_NUM}:")
  ROOT_PART_START=$(echo "$ROOT_PART_LINE" | cut -d ":" -f 2)
  ROOT_PART_END=$(echo "$ROOT_PART_LINE" | cut -d ":" -f 3)

  if [ "$NOOBS" = "1" ]; then
    EXT_PART_LINE=$(echo "$PARTITION_TABLE" | grep ":::;" | head -n 1)
    EXT_PART_NUM=$(echo "$EXT_PART_LINE" | cut -d ":" -f 1)
    EXT_PART_START=$(echo "$EXT_PART_LINE" | cut -d ":" -f 2)
    EXT_PART_END=$(echo "$EXT_PART_LINE" | cut -d ":" -f 3)
  fi
}

fix_partuuid() {
  DISKID="$(fdisk -l "$ROOT_DEV" | sed -n 's/Disk identifier: 0x\([^ ]*\)/\1/p')"

  sed -i "s/${OLD_DISKID}/${DISKID}/g" /etc/fstab
  sed -i "s/${OLD_DISKID}/${DISKID}/" /boot/cmdline.txt
}





main () {


cat << 'EOF' | logger
##    _____          _
##   |  ___|_ _  ___| |_ ___  _ __ _   _
##   | |_ / _` |/ __| __/ _ \| '__| | | |
##   |  _| (_| | (__| || (_) | |  | |_| |
##   |_|  \__,_|\___|\__\___/|_|   \__, |
##                                 |___/
##    ____           _             _
##   |  _ \ ___  ___| |_ ___  _ __(_)_ __   __ _
##   | |_) / _ \/ __| __/ _ \| '__| | '_ \ / _` |
##   |  _ <  __/\__ \ || (_) | |  | | | | | (_| |
##   |_| \_\___||___/\__\___/|_|  |_|_| |_|\__, |
##                                         |___/
EOF

  # dd bs=4M if=/opt/recovery.img of=/dev/mmcblk0p3 conv=fsync status=progress
  unzip -p /opt/recovery.img.zip \
        | dd bs=4M \
          of=/dev/mmcblk0p3 \
          conv=fsync \
          status=progress
  mount /dev/mmcblk0p3 /opt/mntrootfs

  cp -f /boot/cmdline.txt_original /boot/cmdline.txt
  
  cp -f /boot/modelNo.json /opt/mntrootfs/opt/capsuleFW/modelNo.json
  python3 /usr/lib/raspi-config/offsetBackup.py /boot/capsuleSetting.json /opt/mntrootfs/opt/capsuleFW/capsuleSetting.json

  umount /opt/mntrootfs

  touch /boot/ssh

  return 0
}

mount -t proc proc /proc
mount -t sysfs sys /sys
mount -t tmpfs tmp /run
mkdir -p /run/systemd

mount /boot
mount / -o remount,rw

sync

echo 1 > /proc/sys/kernel/sysrq

if ! check_commands; then
  reboot_pi
fi

if main; then
  whiptail --infobox "restored filesystem. Rebooting in 5 seconds..." 20 60
  sleep 5
else
  sleep 5
  whiptail --msgbox "Could not restore, rebooting" 20 60
fi

reboot_pi
