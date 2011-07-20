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
*/
khtml.maplib.parser.Gpx=function(gpx,classname) {
	// Methods
	/**
	 * Parse GPX!
	 *
	 * @returns {khtml.maplib.overlay.Vector}
	*/
	this.parse = function() {
		var myLayer = new khtml.maplib.overlay.Vector();
		
		var trksegs=this.dom.getElementsByTagName("trkseg");
		for(var i=0; i < trksegs.length;i++){
			var pointArray=new Array();

			var trkseg=trksegs.item(i);
			var trkpts=trkseg.getElementsByTagName("trkpt");
			for(var j=0; j < trkpts.length;j++){
				var trkpt=trkpts.item(j);
				var lat=parseFloat(trkpt.getAttribute("lat"));
				var lng=parseFloat(trkpt.getAttribute("lon"));
				pointArray.push(new khtml.maplib.LatLng(lat,lng));
			}
			// Create polyline (the line is automatically attachted to the vector overlay)
			var line=myLayer.createPolyline(pointArray);
			if(this.classname){
				line.className=classname;
			}else{
				line.style.fill="none";
				line.style.stroke="blue";
				line.style.strokeWidth="2";
			}
		}
		
		return myLayer;
	}
	this.setDom = function(xml) {
		if(typeof(xml)=="string"){
			this.dom=khtml.maplib.base.helpers.parseXml(xml);
		}else{
			this.dom=xml;
		}
	}
	this.setClassname = function(value) {
		this.classname = value;
	}
	// Constructor
	if(classname){
		this.classname=classname;
	} else {
		this.classname="";
	}
	
	this.setDom(gpx);
}