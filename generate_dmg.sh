#!/bin/bash

echo "Removing old build folders!"
rm -r dist
rm -r build

python3 mac_setup.py py2app

create-dmg --overwrite --dmg-title='Vilmio battery protection' --identity="Apple Development: Pavel Lpa (YQK86A3456)" dist/Vilmio\ battery\ protection.app/

rm -r dist
rm -r build