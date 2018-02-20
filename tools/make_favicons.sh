#!/bin/sh

pngPath=~/Downloads/cards.png
iconPath=web_gui/favicon.ico
iconPngPath=web_gui/apple-touch-icon.png

magick convert $pngPath -define icon:auto-resize=64,48,32,16 $iconPath

magick convert $pngPath -resize 152x152 $iconPngPath
