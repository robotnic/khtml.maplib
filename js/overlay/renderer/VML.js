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
                for(var i=0;i<coordinates.length;i++){
                        var p=coordinates[i];
                        if(p instanceof khtml.maplib.LatLng){
                                isline=true;
                                points++;
                                var xy = map.latlngToXY(coordinates[i]);

                                if(i==0){
					var startpoint=xy;
                                        d+="m"+xy.x+","+xy.y;
                                }else{
                                        d+=" l"+xy.x+","+xy.y;
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
			console.log("dasa",coordinates[0].x);
                        d+=" l"+startpoint.x+","+startpoint.y;
                }
                return {d:d,points:points,lines:lines};
        }

/*	
	_renderCalculatePolylinePath: function(l,p,i) {
		var x = Math.round(p["x"]);
		var y = Math.round(p["y"]);
		if (i == 0) {
			//var d=" "+x+"px,"+y+"px ";
			this._d = " " + x + "," + y + " ";
		} else {
			var dropped = this.dropped;
			if (this._isPointVisible(p) || i == l.length - 1) {
				if (dropped && i != l.length - 1) {
					//this._d+=" "+parseInt(dropped["x"])+"px,"+parseInt(dropped["y"])+"px ";
					this._d += " " + Math.round(dropped["x"]) + ","
							+ Math.round(dropped["y"]) + " ";
				}
				this._d += " " + x + "," + y + " ";
				//d+=" "+x+"px,"+y+"px ";
			}
		}
	},
	
	_renderClosePolyline: function() {
	},
	
	_renderShowPath: function(a) {
		//this._path.setAttribute("filled", style.close);
		//if(style.cutout){
		//}else{
		this.renderElement.appendChild(this._path);
		//					alert(this.renderElement.childNodes.length);
		//path.style.position="absolute";
		//alert(d);	
		if (!this._path.points) {
			this._path.setAttribute("points", this._d);
		} else {
			this._path.points.value = this._d;
		}
		this.lastpath = this._path;
		//alert(this._d+" ---- "+this._path.points.value);
		//}
	}
*/
}
