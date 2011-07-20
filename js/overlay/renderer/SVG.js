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

// Inspiration: http://michaux.ca/articles/transitioning-from-java-classes-to-javascript-prototypes
/**
 * SVG rendering backend for vector.
 *
 * @class
*/
khtml.maplib.overlay.renderer.SVG = {
	/**
	 * required for interface
	*/
	_renderSetStyles: function(a) {
		// do nothing
	},
	
	_renderInitPolyline: function(line) {
		var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.polyline = line; //backrefence

		if (line.className != null && line.className.baseVal) {
			if (navigator.userAgent.indexOf("Konqueror") == -1) {
				path.className.baseVal=line.className.baseVal;
			}else{
				path.className=line.className.baseVal;
			}
			path.polyline = line;
		}

		
		line.className=path.className; //make it the correct type
		
		if (line.id != null) {
			path.setAttribute("id", line.id);
		}
		for ( var ev in line.events) {
			khtml.maplib.base.helpers.eventAttach(path, ev, line.events[ev], this, false);
		}
		var ffStyleString = "";
		for ( var prop in line.style) {
			path.style[prop] = line.style[prop];
		}
		line.style=path.style;

		return path;
	},
	_calculatePath:function(coordinates,type,map){
		var d="";
		var lines=0;
		var points=0;
		var isline=false;
		for(var i=0;i<coordinates.length;i++){
			var p=coordinates[i];
			if(p instanceof khtml.maplib.geometry.LatLng){
				isline=true;
				points++;
				var xy = map.latlngToXY(coordinates[i]);
			
				if(i==0){
					d+="M"+xy.x+","+xy.y;	
				}else{
					d+=" L"+xy.x+","+xy.y;	
				}
			}else{
				var ret=this._calculatePath(coordinates[i],type,map);
				lines+=ret.lines;
				points+=ret.points;
				d+=" "+ret.d;
			}
		}
		//if(isline){
			lines++;
		//}
		if(type=="Polygon" || type=="MultiPolygon"){
			d+=" z";
		}
		return {d:d,points:points,lines:lines};
	}

/*	
	
	_renderShowPath: function(a) {
		if (this.lineArray[a].close) {
			this._d = this._d + " z";
		}

		if (this.lineArray[a].holes.length > 1000) {
			if (this.lastpath) {
				this._d = this.lastpath.getAttribute("d") + " " + this._d;
				this.lastpath.setAttribute("d", this._d);
				this.lastpath.setAttribute("fill-rule", "evenodd");
			} else {
				alert("cutout not possible");
			}
		} else {
			this._path.setAttribute("d", this._d);
			if (this.lineArray[a].holes.length > 0) {
				this._path.setAttribute("fill-rule", "evenodd");
			}
			this.renderElement.appendChild(this._path);
			this.lastpath = this._path;
		}
	}
*/
}
