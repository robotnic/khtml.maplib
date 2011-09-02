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

/**
 * This object takes an XML DOM Object or an XML String
 * The second parameter is an optional className for styling
 *
 * @param {String/Object} gpx XML String or parsed XML Object representing GPX data.
 * @param {String} classname apply this css-class to the gpx track
 *
 * @class
 *
 * @see Example <a href="../../../examples/parser/gpx/index.html">gpx</a>, 
 @see <a href="../../../examples/parser/gpx/osm.php">osm with php</a>,
 * @see <a href="../../../examples/parser/gpx/ajax.html">gpx per ajax</a>
 * 
*/
khtml.maplib.parser.Gpx=function(gpx) {
	// Methods
	/**
	 * Parse GPX!
	 *
	 * @returns {khtml.maplib.overlay.Vector}
	*/
	this.parse = function() {
		var multiPointArray=new Array();
		var trksegs=this.dom.getElementsByTagName("trkseg");
		for(var i=0; i < trksegs.length;i++){
			var pointArray=new Array();
			var trkseg=trksegs.item(i);
			var trkpts=trkseg.getElementsByTagName("trkpt");
			for(var j=0; j < trkpts.length;j++){
				var trkpt=trkpts.item(j);
				var lat=parseFloat(trkpt.getAttribute("lat"));
				var lng=parseFloat(trkpt.getAttribute("lon"));
				pointArray.push([lng,lat]);
			}
			multiPointArray.push(pointArray);
		}
			var line=new khtml.maplib.geometry.Feature({type:"MultiLineString",coordinates: multiPointArray});
		return line;
	}
	this.setDom = function(xml) {
		if(typeof(xml)=="string"){
			this.dom=khtml.maplib.base.helpers.parseXml(xml);
		}else{
			this.dom=xml;
		}
	}
	this.setDom(gpx);
	return this.parse();
}
