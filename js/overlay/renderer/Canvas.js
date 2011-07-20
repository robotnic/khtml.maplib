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
 * Canvas rendering backend for vector.
 *
 * Features:
 * - find style information in css and apply it to the canvas
 * - ...
 *
 * @class
*/

var lastStrokeStyle=null;
var lastFillStyle=null;
var lastGlobalCompositeOperation="source-over";
khtml.maplib.overlay.renderer.Canvas = {
	_renderPath:function(coordinates,line,ctx,map,item,depth){
		if(!this.styler){
			this.styler=new khtml.maplib.overlay.renderer.Styler();
		}
		var canvasStyle=this.styler.makeCanvasStyle(line);
		var type=line.geometry.type;


		var style=line.style;
                var lines=0;
                var points=0;
                var isline=false;
		//if(((type=="Polygon" &&(depth >1)))|| (type=="MultiPolygon" && (depth>3000)) && item >0){	
		if(((type=="Polygon" &&(depth >1))) && item >0){	
			canvasStyle.globalCompositeOperation="destination-out";
		}else{
			canvasStyle.globalCompositeOperation="source-over";
		}
		//if color changes, fill, stroke, beginpath must be done
		if(canvasStyle.globalCompositeOperation=="source-over" && lastGlobalCompositeOperation=="source-over" && canvasStyle.strokeStyle==lastStrokeStyle && canvasStyle.fillStyle==lastFillStyle) {
			//farben bleigen gleich
			//no stroke,fill because of performance 
		}else{
			ctx.fill();	
			ctx.stroke();
			ctx.beginPath();

		}
		//console.log(type,depth,item,lastGlobalCompositeOperation);
		lastStrokeStyle=canvasStyle.strokeStyle;
		lastFillStyle=canvasStyle.fillStyle;
		lastGlobalCompositeOperation=canvasStyle.globalCompositeOperation;

		//set new colors
		ctx.strokeStyle = canvasStyle.strokeStyle;
		ctx.fillStyle = canvasStyle.fillStyle;
		ctx.lineWidth = canvasStyle.lineWidth;
		ctx.globalCompositeOperation = canvasStyle.globalCompositeOperation;
		//ctx.beginPath();
                for(var i=0;i<coordinates.length;i++){
                        var p=coordinates[i];
                        if(p instanceof khtml.maplib.LatLng){
                                isline=true;
                                points++;
                                var xy = map.latlngToXY(coordinates[i]);

                                if(i==0){
                                        ctx.moveTo(xy.x,xy.y);
                                }else{
					ctx.lineTo(xy.x,xy.y);
                                }
                        }else{
				if(!depth){
					depth=1;
				}else{
					depth++;	
				}
                                var ret=this._renderPath(coordinates[i],line,ctx,map,i,depth);
                                lines+=ret.lines;
                                points+=ret.points;
                        }
                }
		if(type=="Polygon" || type=="MultiPolygon"){
			ctx.closePath();
		
                }

		if(isline)lines++
		return {points:points,lines:lines};
			
	}
}
