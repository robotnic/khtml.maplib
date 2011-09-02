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
 * VML rendering backend for vector.
 *
 * @class
*/
khtml.maplib.overlay.renderer.VML = {	
	_renderSetStyles: function(a) {
		// do nothing
	},
	
	_renderInitPolyline: function(a) {
		this._path = document.createElement("v:polyline");
		this._path.setAttribute("fillcolor", this._fill);
		this._path.setAttribute("strokecolor", this._stroke);
		this._path.setAttribute("strokeweight", this._strokeWidth + "px");
	},

	
        _calculatePath:function(coordinates,type,map){
                var d="";
                var lines=0;
                var points=0;
                var isline=false;
		var startpoint=null;
                for(var i=0;i<coordinates.length;i++){
                        var p=coordinates[i];
                        if(p instanceof khtml.maplib.geometry.LatLng){
                                isline=true;
                                points++;
                                var xy = map.latlngToXY(coordinates[i]);
				var x=parseInt(xy.x);
				var y=parseInt(xy.y);
                                if(i==0){
					startpoint=xy;
                                        d+="M"+x+" "+y;
                                }else{
					if(i==1){
						d+=" L";
					}
                                        d+=" "+x+","+y;
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
		if(!startpoint && ret &&ret.startpoint){
			var startpoint=ret.startpoint;
		}
		if(startpoint){
			if(type=="Polygon" || type=="MultiPolygon" || type=="LinearRing"){
				d+=" "+parseInt(startpoint.x)+","+parseInt(startpoint.y);
			}
			return {d:d,points:points,lines:lines,startpoint:startpoint};
		}else{
			return false;
		}
        }

}
