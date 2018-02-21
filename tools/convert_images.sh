#!/bin/bash

rootDir=$(dirname "$0")/..
srcDir=$rootDir/orig_images
destDir=$rootDir/card_images


if [ ! -d "$destDir" ]
then
	mkdir $destDir
fi

#rm -f $destDir/*

for f in $srcDir/*.png
do
	srcfile=$(basename "$f")

	if [ ! -f "$destDir/$srcfile" ]
	then
		echo "Copying $srcfile to $destDir"
		cp $f $destDir/
	fi
done


for f in $srcDir/*.{jpg,jpeg}
do
	if [ ! -f "$f" ]
	then
		# skip case where for example *.jpeg does not expand because there is no match
		# to avoid later expansion in convert command which creates a mess
		continue
	fi

	srcfile=$(basename "$f")
	ext="${srcfile##*.}"
	noext="${srcfile%.*}"
	destfile=$noext.png

	if [ ! -f "$destDir/$destfile" ]
	then
		echo "Converting $srcfile to $destfile"
		echo convert $f $destDir/$destfile
	fi
done