#!/bin/sh

pngPath=~/Downloads/cards.png
iconPath=web_gui/favicon.ico
iconPngPath=web_gui/apple-touch-icon.png

convert $pngPath -define icon:auto-resize=64,48,32,16 $iconPath

convert $pngPath -resize 152x152 $iconPngPath
