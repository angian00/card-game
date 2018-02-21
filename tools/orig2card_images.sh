#!/bin/bash

rootDir=$(dirname "$0")/..
srcDir=$rootDir/orig_images
destDir=$rootDir/card_images


if [ ! -d "$destDir" ]
then
	mkdir $destDir
fi

rm -f $destDir/*

for f in $srcDir/*.png
do
	echo "Copying $f"
	cp $f $destDir/
done


for f in $srcDir/*.{jpg,jpeg}
do
	srcfile=$(basename "$f")
	ext="${srcfile##*.}"
	noext="${srcfile%.*}"
	destfile=$noext.png

	echo "Converting $f"

	convert $f $destDir/$destfile
done