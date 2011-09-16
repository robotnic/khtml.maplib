// --------------------------------------------------------------------------------------------
// khtml javascript library
// --------------------------------------------------------------------------------------------
// (C) Copyright 2010-2011 by Bernhard Zwischenbrugger, Florian Hengartner, Stefan Kemper
//
// Project Info:  http://www.khtml.org
//				  http://www.khtml.org/iphonemap/help.php
//
// This library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
// 
// You should have received a copy of the GNU Lesser General Public License
// along with this library.  If not, see <http://www.gnu.org/licenses/>.
// --------------------------------------------------------------------------------------------

/** @namespace */
var khtml = new Object();
/** @namespace */
khtml.maplib = new Object();
/**
 * Basic elements that are required for every map.
 * 
 * @namespace
*/
khtml.maplib.base = new Object();
/**
 * Geometric functions and shapes like: Point, Bounds, LineString, Polygon, etc.
 *
 * @namespace
*/
khtml.maplib.geometry = new Object();
/**
 * Visible elements on the map.
 * Markers, Images, Placemarks, Icons, POI's, ...
 *
 * @namespace
*/
khtml.maplib.overlay = new Object();

/**
 * Transforms Vector data to native browser Vector Format
 * SVG, Canvas, VML
 *
 * @namespace
*/
khtml.maplib.overlay.renderer = new Object();
/** @namespace */
khtml.maplib.parser = new Object();
/**
 * Stuff relating to user interaction with the map.
 * Zoombar, Layer select, Keyboard stuff, Mouse stuff.
 *
 * @namespace 
*/
khtml.maplib.ui = new Object();
/**
 * Utility classes.
 *
 * @namespace 
*/
khtml.maplib.util = new Object();
/**
 * Vector renderer.
 *
 * @namespace
*/
khtml.maplib.overlay.renderer = new Object();

/**
 * @namespace
*/
//khtml.maplib.tilesource = new Object();


/**
 * Version String
 *
 * @function
*/
khtml.maplib.version = function() {
	return "khtmlib_hsr v0.02";
}

/**
 * API shotcut
 *
 * @class
*/
khtml.maplib.Map = function(arg1) {
	return new khtml.maplib.base.Map(arg1);
}
/**
 * API shotcut
 *
 * @class
*/
khtml.maplib.LatLng = function(arg1,arg2) {
	return new khtml.maplib.geometry.LatLng(arg1,arg2);
}

//path to standardmarker-images (IE6-7 do not support data-URI)
khtml.maplib.standardimagepath = "http://maplib.khtml.org/img/";