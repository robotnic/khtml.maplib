#!/bin/bash

LICENSE_FILE=./tools/license_header.txt
TEMP_MIN=khtml_min_tmp.js
TEMP_ALL=khtml_all_tmp.js

if [ ! -f "$LICENSE_FILE" ]; then
	echo "Run this script from the TOP FOLDER!"
	echo "Error: Could not find '$LICENSE_FILE'."
	exit 1
fi

java -jar ./tools/closure-compiler/compiler.jar \
--js js/khtml.js \
--js js/base/Helpers.js  --js js/base/Map.js \
--js js/geometry/Bounds.js --js js/geometry/LatLng.js \
--js js/ui/Keyboard.js \
--js_output_file=$TEMP_MIN

java -jar ./tools/closure-compiler/compiler.jar \
--js js/khtml.js \
--js js/base/Helpers.js \
--js js/base/Map.js \
--js js/geometry/Bounds.js \
--js js/geometry/LatLng.js \
--js js/geometry/Feature.js \
--js js/overlay/Vector.js \
--js js/overlay/Marker.js \
--js js/overlay/InfoWindow.js \
--js js/overlay/SimpleMarker.js \
--js js/overlay/WMS.js \
--js js/overlay/GroundOverlay.js \
--js js/overlay/FeatureCollection.js \
--js js/overlay/renderer/Canvas.js \
--js js/overlay/renderer/SVG.js \
--js js/overlay/renderer/VML.js \
--js js/overlay/renderer/Styler.js \
--js js/parser/MapCSS.js \
--js js/parser/Osm.js \
--js js/parser/Gpx.js \
--js js/parser/Kml.js \
--js js/ui/Keyboard.js \
--js js/ui/Zoombar.js \
--js js/util/Http.js \
--js js/util/Urlparam.js \
--js_output_file=$TEMP_ALL

cat $LICENSE_FILE > khtml_min.js
cat $LICENSE_FILE > khtml_all.js

cat khtml_min_tmp.js >> khtml_min.js
cat khtml_all_tmp.js >> khtml_all.js

rm -f $TEMP_MIN
rm -f $TEMP_ALL
