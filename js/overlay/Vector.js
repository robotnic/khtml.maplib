/* --------------------------------------------------------------------------------------------
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
 * Vector
 *
 * DEPRECATED: please use one of {khtml.maplib.geometry.LineString},{khtml.maplib.geometry.LinearRing},{khtml.maplib.geometry.Polygon} instead.
 *
 * This is intended to ease transition from the previous khtml api to the new, as you can first only
 * rename all uses of khtml.maplib.Vector to khtml.maplib.overlay.Vector and then refactor the code to use the
 * new vector classes from the geometry package.
 *
 * @class
*/
khtml.maplib.overlay.Vector = function() {
	this.vectorPointsPerIteration=2000;
	this.lineArray = new Array();
	this.stopit = false;
	this.backend = "svg";
	if (navigator.userAgent.indexOf("Android") != -1) {
		this.backend = "canvas";
	}
	this.svgStyleInterface = false;
	if (navigator.userAgent.indexOf("MSIE") != -1) {
		if (getInternetExplorerVersion() < 9) {
			this.backend = "vml";
		}
	}
	this.canvasClassStyles = new Array();

	this.boundsSouth = 90;
	this.boundsNorth = -90;
	this.boundsWest = 180;
	this.boundsEast = -180;

	/**
	 * Switch render backend.
	 * Previous rendered content (the old overlay) is discarded!
	 *
	 * @param {String}	render	svg, canvas or vml
	*/
	this.renderbackend = function(render) {
		if(render){
			this.backend = render;
			if(this.vectorEl && this.vectorEl.parentNode){
				var parent=this.vectorEl.parentNode;
				parent.removeChild(this.vectorEl);
			}
			var vectorEl = this.createVectorElement(this.themap);
			parent.appendChild(this.vectorEl);
			this.render();
		}
		return this.backend;
	}

	/**
	 * Create a vector element, depending on the active backend (svg, canvas or vml)
	 *
	 * @param {khtml.maplib.base.Map} themap reference to mapobject
	*/
	this.createVectorElement = function(themap) {
		switch (this.backend) {
		case "canvas":
			vectorEl = document.createElement("canvas");
			this.ctx = vectorEl.getContext("2d");
			break;
		case "svg":
			vectorEl = document.createElementNS("http://www.w3.org/2000/svg",
					"svg");
			break;
		case "vml":
			if(document.namespaces){
			if (document.namespaces['v'] == null) {
				document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
				var stl = document.createStyleSheet();
				stl.addRule("v\\:group", "behavior: url(#default#VML);");
				stl.addRule("v\\:polyline", "behavior: url(#default#VML);");
				stl.addRule("v\\:stroke", "behavior: url(#default#VML);");
				stl.addRule("v\\:fill", "behavior: url(#default#VML);");
			}
			}
			//vectorEl=document.createElement("v:group");
			vectorEl = document.createElement("div");
			//document.body.appendChild(vectorEl);
			//vectorEl.style.display="none";
			break;
		default:
			alert("error: unknown vector backend");

		}
		vectorEl.style.width = themap.mapsize.width + "px";
		vectorEl.style.height = themap.mapsize.height + "px";
		vectorEl.setAttribute("height", themap.mapsize.height + "px");
		vectorEl.setAttribute("width", themap.mapsize.width + "px");
		vectorEl.style.position = "absolute";
		vectorEl.style.top = "0";
		vectorEl.style.left = "0";
		return vectorEl;
	}
	this.init = function(owner) {
		this.owner=owner;
		if(owner instanceof khtml.maplib.base.Map){
                        this.themap=owner;
			this.vectorEl = this.createVectorElement(this.themap);
                        this.themap.overlayDiv.appendChild(this.vectorEl);
                }else{
                        this.themap=owner.map;
			this.vectorEl = this.createVectorElement(this.themap);
                        this.owner.overlayDiv.appendChild(this.vectorEl);
                }
	}

/*
	this.parseLine = function(pointArray) {
		if (pointArray) {
			if (typeof (pointArray) == "string") {
				points = new Array();
				var pa = pointArray.split(" ");
				for ( var i = 0; i < pa.length; i++) {
					var point = pa[i].split(",");
					if (point.length != 2)
						continue;
					point[0] = parseFloat(point[0]);
					point[1] = parseFloat(point[1]);
					points.push(new khtml.maplib.LatLng(point[0], point[1]));
				}
			}
			if (typeof (pointArray) == "object") {
				points = pointArray;
			}
		} else {
			points = new Array();
		}
		return points;
	}
*/

	this.createPolyline = function(polyline) {
		polyline.tags = new Array;
		if(!polyline.close){
			polyline.close = false;
		}
		polyline.id = null;
		if(!polyline.geometry.coordinates){
				polyline.geometry.coordinates=new Array();
		}	
		
		/*
		polyline.cutout = function(points) {
			var holePoints = this.parseLine(points);
			polyline.holes.push(holePoints);
			return polyline.holes[polyline.holes.length - 1];
		}
		*/
		polyline.calculateCenter = function() {
			var sumLat=0.0; // float!
			var sumLng=0.0; // float!
			for(var i = 0; i < polyline.points.length; i++) {
				sumLat += polyline.points[i].lat();
				sumLng += polyline.points[i].lng();
			}
			return new khtml.maplib.LatLng(sumLat/polyline.points.length/*lat*/, sumLng/polyline.points.length/*lng*/);
		}
		var that=this;
		//render a single vector element
		polyline.render=function(){
			that.render(polyline);
		}
		this.lineArray.unshift(polyline);
		polyline.bbox=this.makeBounds(polyline.geometry.coordinates);
		return polyline;
	}
	this.cancel = function() {
		this.stopit = true;
	}
	this.renderCount=0;
	this.render = function(a) {
		var intZoom = Math.floor(this.themap.zoom());
		if(!this.vectorEl)return;
		this.vectorEl.setAttribute("class", "z" + intZoom);
		if (this.stopit) {
			//stop rendering vectors
			this.stopit = false;
			if (a != null) {
				if (this.oldVectorEl && this.oldVectorEl.parentNode) {
					//draw not finished - go back to old version (move)
					try { //ie workaround
						this.oldVectorEl.parentNode.removeChild(this.oldVectorEl);
						this.vectorEl = this.createVectorElement(this.themap);
						this.themap.overlayDiv.appendChild(this.vectorEl);
					} catch (e) {
						alert(this.oldVectorEl.tagName);
						alert(this.oldVectorEl.parentNode.tagName);

					}
				}
				return;
			}
		}
		//render process started
		if (a == null) {
				//this.clear();
			if(this.backend=="canvas"){
				this.ctx.beginPath();
			}
			if (this.oldZoom == this.themap.zoom() && (this.themap.moveX != this.lastMoveX || this.themap.moveY != this.lastMoveY)) {
				//move all the vectors is much faster than build the vectors completely new
				//moving it together with all markers would be faster
				var dx = Math.round((this.themap.moveX - this.lastMoveX)
						* this.themap.faktor * this.themap.sc);
				var dy = Math.round((this.themap.moveY - this.lastMoveY)
						* this.themap.faktor * this.themap.sc);

				if(this.vectorEl.style) {
					try {
						this.vectorEl.style.top = dy + "px";
						this.vectorEl.style.left = dx + "px";
					} catch (e) {
						console.log("move not passible");		
					}
				}

				if (!this.themap.finalDraw) {
					return;
				}
				//the oldVectorEl will be visible until the new vectorEl is completely redered. 
				this.oldVectorEl = this.vectorEl;
				this.vectorEl = this.createVectorElement(this.themap);
			}else{
				this.clear();
				//these values are nessessary for vector rendering optimization
				this.oldtimestamp=new Date().getTime();
				this.starttimestamp=new Date().getTime();
				this.totalPointsCounter=0;
				this.totalLinesCounter=0;
				this.renderCount=0;
			}
			this.oldZoom = this.themap.zoom();
			//this.clear();
			var a = this.lineArray.length -1;

			this.lastMoveX = this.themap.moveX;
			this.lastMoveY = this.themap.moveY;
		}

		if (a < 0) {
			if(this.backend=="canvas"){
				this.ctx.stroke();
				this.ctx.fill();
			}
			this.timestamp=new Date().getTime();
			this.renderIterationTime=this.timestamp - this.starttimestamp;
			this.totalPoints=this.totalPointsCounter;
			this.totalLines=this.totalLinesCounter;
			//rendering is finished
			if (this.oldVectorEl && this.oldVectorEl.parentNode) {
				//use action was move without zoom	
				this.oldVectorEl.parentNode.replaceChild(this.vectorEl, this.oldVectorEl);
				this.vectorEl.style.display = "";
				return;
			}
			return;
		}
		if(typeof(a)=="number"){
			var line=this.lineArray[a];
		}else{
			var line=a;
		}
		//console.log(line,line.bounds.sw().lat(),line.bounds.sw().lng(),line.bounds.ne().lat(),line.bounds.ne().lng());
		//check if line bounds are inside map bounds
		if(khtml.maplib.base.helpers.overlaps(this.themap.bounds(),line.bbox)){
			stroke="black";
			strokeWidth=4;
			fill="red";


			//initialize the polyline 
			switch (this.backend) {
			case "canvas":
				//this.ctx.beginPath();
				/*
				this.ctx.strokeStyle = stroke;
				this.ctx.fillStyle = fill;
				this.ctx.lineWidth = strokeWidth;
				*/
				break;
			case "svg":
				if(!line.path){
					var path=khtml.maplib.overlay.renderer.SVG._renderInitPolyline(line);
					if(line.geometry.type=="Polygon" || line.geometry.type=="MultiPolygon" || (line.geometry.type=="Polyline" && line.close)){
						line.close="true";

					}else{
						line.style.fill="none";
					}
					line.close="false";
					line.path=path;
					path.owner=line;
				}else{
					var path=line.path;
				}
				break;
			case "vml":
				var path = document.createElement("v:polyline");
				var fillEl = document.createElement("v:fill");
				path.appendChild(fillEl);
				var strokeEl = document.createElement("v:stroke");
				path.appendChild(strokeEl);
			
				path.setAttribute("fillcolor", fill);
				path.setAttribute("strokecolor", stroke);
				path.setAttribute("strokeweight", strokeWidth + "px");
				break;

			}

			//calculate polyline path
			switch(this.backend){
				case "svg":
					var ret=khtml.maplib.overlay.renderer.SVG._calculatePath(line.geometry.coordinates,line.geometry.type,this.themap);
					path.setAttribute("d",ret.d);
					for(var p in line.properties){
						var property=line.properties[p];
						path.setAttribute("mapcss_"+p,property);
					}

					path.style.fillRule="evenodd";
					this.vectorEl.appendChild(path);
					break;	
				case "canvas":
					var ret=khtml.maplib.overlay.renderer.Canvas._renderPath(line.geometry.coordinates,line,this.ctx,this.themap);
					break;
				case "vml":
					var ret=khtml.maplib.overlay.renderer.VML._calculatePath(line.geometry.coordinates,line.geometry.type,this.themap);
					if(!this.styler){
						this.styler=new khtml.maplib.overlay.renderer.Styler();
					}else{
						///console.log("schon da",this.styler);
					}
					var style=new Object();

					style.fillRGB="rgb(0,0,0)";
					style.opacity=0;
					if(line.className){
						style=this.styler.makeCanvasStyle(line);
					        //  return {strokeStyle:stroke,fillStyle:fill,lineWidth:strokeWidth};

					}
					//style.fill="blue";
					path.setAttribute("fillcolor", style.fillRGB);
					path.setAttribute("strokecolor", style.strokeRGB);
					fillEl.setAttribute("opacity", style.fillOpacity);
					strokeEl.setAttribute("opacity", style.strokeOpacity);
					path.setAttribute("strokeweight", style.lineWidth + "px");
					path.setAttribute("points",ret.d);
					if(line.geometry.type=="Polygon" || line.geometry.type=="MultiPolygon"){
						path.setAttribute("filled",true);
					}else{
						path.setAttribute("filled",false);
					}

					this.vectorEl.appendChild(path);
					
					break;
				default:
					console.log("error: unknow backend");
			}

			this.renderCount+=ret.points;
			this.totalPointsCounter+=ret.points;
			this.totalLinesCounter+=ret.lines;

		} //end inside map bounds

		//cancel able after some lines
//		this.canvasRenderTimeout=null;
		if(typeof(a)!="number"){
			if(this.backend=="canvas"){
				if(this.canvasRenderTimeout){
					clearTimeout(this.canvasRenderTimeout);
				}
				var that=this;
				var tempFunction=function(){
					that.ctx.stroke();
					that.ctx.fill();
				}
				this.canvasRenderTimeout=setTimeout(tempFunction,1);
			}
			return;
		}
		//if (a / 1000 == Math.floor(a / 1000)) {
		if (this.renderCount > this.vectorPointsPerIteration) {
			this.timestamp=new Date().getTime();
			this.iterationTime=this.timestamp - this.oldtimestamp;
			this.vectorPointsPerIteration=Math.ceil(this.vectorPointsPerIteration*100/this.iterationTime);
			if(this.vectorPointsPerIteration < 2000)  this.vectorPointsPerIteration=2000;

			this.oldtimestamp=this.timestamp;
			this.renderCount=0;
			var that = this;
			var tempFunction = function() {
				that.render(a - 1);
			}
			setTimeout(tempFunction, 0);
			if(this.backend=="canvas"){
				this.ctx.stroke();
				this.ctx.fill();
				this.ctx.beginPath();
			}
		} else {
			this.render(a - 1);
		}
	}


	/**
	 * calculate the extend of the polyline
	 */
	this.makeBounds=function(coordinates){
		var boundsSouth = 90;
		var boundsNorth = -90;
		var boundsWest = 180;
		var boundsEast = -180;

		for(var i=0; i < coordinates.length;i++){
			if(coordinates[i] instanceof khtml.maplib.LatLng){
				var lng = coordinates[i].lng();
                                var lat = coordinates[i].lat();
                                if (lat > boundsNorth) {
                                        boundsNorth = lat;
                                }
                                if (lat < boundsSouth) {
                                        boundsSouth = lat;
                                }
                                if (lng > boundsEast) {
                                        boundsEast = lng;
                                }
                                if (lng < boundsWest) {
                                        boundsWest = lng;
                                }

			}else{
				var bounds=this.makeBounds(coordinates[i]);
				if(bounds.sw().lat() < boundsSouth){
					boundsSouth=bounds.sw().lat();
				}
				if(bounds.sw().lng() < boundsWest){
					boundsWest=bounds.sw().lng();
				}
				if(bounds.ne().lat() > boundsNorth){
					boundsNorth=bounds.ne().lat();
				}
				if(bounds.ne().lng() > boundsEast){
					boundsEast=bounds.ne().lng();
				}
			}
		}
                //return line bounds
                var sw = new khtml.maplib.LatLng(boundsSouth, boundsWest);
                var ne = new khtml.maplib.LatLng(boundsNorth, boundsEast);
                var b = new khtml.maplib.geometry.Bounds(sw, ne);
                return (b);

	}

	/**
	 * readonly return bounds
	*/
	this.bounds = function() {
		var sw = new khtml.maplib.LatLng(this.boundsSouth, this.boundsWest);
		var ne = new khtml.maplib.LatLng(this.boundsNorth, this.boundsEast);
		var b = new khtml.maplib.geometry.Bounds(sw, ne);
		return (b);
	}

	/**
	 * remove polyline
	*/
	this.clear = function() {	
		if (this.ctx) {
			this.ctx.clearRect(0, 0, this.themap.mapsize.width,
					this.themap.mapsize.height);
		}
		if(this.backend=="svg" || this.backend=="vml"){
			while (this.vectorEl.firstChild) {
				this.vectorEl.removeChild(this.vectorEl.firstChild);
			}
		}

	}
	
	function getInternetExplorerVersion() {
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
		}
		return rv;
	}

}
