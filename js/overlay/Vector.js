/*
Outdated - File will be deleted


*/



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
 * Vector, internaly used
 * This Object represents one FeatureCollection with man Vectors. Markers are not handles with this Class
 * 
 * What can it do for you?
 * o It does the rendering on SVG, Canvas, VML Vector Backend
 * o Does the CSS based Styling. For SVG this is done by browser. For other Backends the properties like
 *   fill, stroke, stroke-width, opacity, fill-opacity, stroke-opacity, display, or translated to native
 *   styling syntax. Also CSS hierarchy is done here.
 *   CSS converting needs lots of CPU Power. More in Memory-caching could leed to better performance
 * o Speedy and lag-free userinterface is important. This Object should not freece the browser.
 *
 * @class
*/
khtml.maplib.overlay.Vector = function(backend) {
	this.minVectorPointsPerIteration=500;
	this.vectorPointsPerIteration=this.minVectorPointsPerIteration;
	this.lineArray = new Array();
	this.stopit = false;
	if(backend){
		this.backend = backend;
	}else{
		this.backend = "svg";
	}
	if (navigator.userAgent.indexOf("Android") != -1) {
		this.backend = "canvas";
	}
	this.svgStyleInterface = false;
	if (navigator.userAgent.indexOf("MSIE") != -1) {
		if (getInternetExplorerVersion() < 9) {
			this.backend = "vml";
		}
		//ie9 with compatibility or quirx mode
		if(document.documentMode <9){
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
	this.renderbackend = function(backend) {
		if(backend){
			//style to normal object
			this.remove();
			
			this.backend = backend;
			this.owner.init(this.themap);
		}
		return this.backend;
	}

	/**
	It's faster to draw everything to one canvas, svg-document.
	The "g" in SVG is basicly for css styling.
	*/

	this.createVirtualVectorElement=function(ownerVectorElement){
		switch(this.backend){
			case "canvas":
			case "vml":
				//not acceleration yes
				return ownerVectorElement;
				break;
			case "svg":
				var g=document.createElementNS("http://www.w3.org/2000/svg","g");
				if(this.owner.className && this.owner.className.baseVal){
					g.className.baseVal=this.owner.className.baseVal;
				}
				this.owner.className=g.className;
				return g;
				break;
			default:
				alert("unknown backend: "+this.backend);
		}
	}

	/**
	 * Create a vector element, depending on the active backend (svg, canvas or vml)
	 *
	 * @param {khtml.maplib.base.Map} themap reference to mapobject
	*/
	this.createVectorElement = function(themap) {
		switch (this.backend) {
		case "canvas":
			var vectorEl = document.createElement("canvas");
			this.ctx = vectorEl.getContext("2d");
			break;
		case "svg":
			var vectorEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
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
				stl.addRule("v\\:shape", "behavior: url(#default#VML);display:inline-block");
				stl.addRule("v\\:path", "behavior: url(#default#VML);");
			}
			}
			var vectorEl=document.createElement("v:group");
			//vectorEl.style.height=600;  
			//vectorEl.style.width=1000;
			//vectorEl = document.createElement("div");
			vectorEl.setAttribute("debug","soso");
			//document.body.appendChild(vectorEl);
			//vectorEl.style.display="none";
			break;
		default:
			alert("error: unknown vector backend");

		}
		vectorEl.style.width = themap.size.width + "px";
		vectorEl.style.height = themap.size.height + "px";
		vectorEl.setAttribute("height", themap.size.height + "px");
		vectorEl.setAttribute("width", themap.size.width + "px");
		vectorEl.style.position = "absolute";
		vectorEl.style.top = "0";
		vectorEl.style.left = "0";
		return vectorEl;
	}
	/**
	Initialize the vector, create svg-element, canvas,...
	For speed, vectors are draw to the same vector element even if they are in differend FeatureCollection.
	For SVG every FeatureCollection has a "g" Element. This is used mainly for styling.
	
	*/
	this.init = function(owner,fcWithVectorElement) {
		this.owner=owner;
		if(owner instanceof khtml.maplib.base.Map){
                        this.themap=owner;
                }else{
                        this.themap=owner.map;
                }
		if(fcWithVectorElement){
			var vectorEl =this.createVirtualVectorElement(fcWithVectorElement.vectorEl);
			if(this.backend=="svg"){
				fcWithVectorElement.vectorEl.appendChild(vectorEl);
			}
			if(this.backend=="vml"){
				vectorEl=fcWithVectorElement.vectorEl;
			}
			if(this.backend=="canvas"){
				this.ctx=fcWithVectorElement.vectorLayer.ctx;
			}

		}else{
			var vectorEl = this.createVectorElement(this.themap);
			this.owner.overlayDiv.appendChild(vectorEl);
		}
		return vectorEl;
	}

	/**
	This method is called to create a lineString, Polygon,...
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
		polyline.repairBBox=function(force){
			if(force || polyline.geometry.coordinates.length != polyline.length){
				polyline.bbox=that.makeBounds(polyline.geometry.coordinates);
				polyline.length=polyline.geometry.coordinates.length;
			}
		}
		polyline.repairBBox(true);
		//render a single vector element
		polyline.render=function(){
			if(polyline && polyline.owner){  //workaround for removeChild bug
				that.render(polyline);
			}
		}
		polyline.bbox=this.makeBounds(polyline.geometry.coordinates);  //do I need that?
		polyline.clear=function(){
			//VML missing
			if(that.backend=="svg"){
				if(polyline.path && polyline.path.parentNode){
					polyline.path.parentNode.removeChild(polyline.path);
				}
			}
			//that.clear();
		}
		/* remove completely */
		polyline.destroy=function(){
			polyline.clear();
		}
		//find the "real" layer and push to array
		var fc=polyline.owner;
		while(fc && !fc.realLayer){
			fc=fc.owner;
		}
		if(fc){
			fc.vectorLayer.lineArray.unshift(polyline);
		}
		return polyline;
	}
	/**
	If the user interacts with the map (move,zoom), the rendering process for overlays will be stopped.
	*/
	this.cancel = function() {
		this.stopit = true;
	}
	/**
	For benchmark
	*/
	this.renderCount=0;

	/**
	Render the Path.
	This Method is call recursive to allow stop of rendering.
	This stop is needed for repsonsive ui - otherwise the browser may freece.
	The render method is called for all overlays by the main map object

	@parameters: a (optional, polyline, number)
	Parameters are a mess ;-)
	*/

	this.render = function(a) {
		var intZoom = Math.floor(this.themap.zoom());
		if(!this.owner.vectorEl && this.backend!="canvas")return;
		if(this.owner.vectorEl && this.owner.vectorEl.localName=="svg"){
			this.owner.vectorEl.setAttribute("class", "z" + intZoom);
		}
		//Useraction cancels rendering process.
		if (this.stopit) {
			//stop rendering vectors
			this.stopit = false;
			if (a != null) {
				if (this.oldVectorEl && this.oldVectorEl.parentNode) {
					//draw not finished - go back to old version (move)
					try { //ie workaround
						this.oldVectorEl.parentNode.removeChild(this.oldVectorEl);
						this.owner.vectorEl = this.createVectorElement(this.themap);
						this.themap.overlayDiv.appendChild(this.owner.vectorEl);
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
			/**
			This part should speedup moving the map. 
			*/
			if (this.oldZoom == this.themap.zoom() && (this.themap.moveX != this.lastMoveX || this.themap.moveY != this.lastMoveY)) {
				//move all the vectors is much faster than build the vectors completely new
				//moving it together with all markers would be faster
				var dx = Math.round((this.themap.moveX - this.lastMoveX)
						* this.themap.faktor * this.themap.sc);
				var dy = Math.round((this.themap.moveY - this.lastMoveY)
						* this.themap.faktor * this.themap.sc);

				if(this.themap.featureCollection.vectorEl.style) {
					try {
						this.themap.featureCollection.style.top = dy + "px";
						this.themap.featureCollection.style.left = dx + "px";
						//this.themap.featureCollection.style.webkitTransform="translate3d("+dx+"px,"+dy+"px,0)";
						
					} catch (e) {
						console.log("move not passible");		
					}
				}
				if (!this.themap.finalDraw) {
					return;
				}else{
						for(var i=0;i< this.lineArray.length;i++){
							if(!this.lineArray[i].origDisplay){
								this.lineArray[i].origDisplay= this.lineArray[i].element.style.display;
							}
							//console.log(this.lineArray[i].origDisplay);
							this.lineArray[i].element.style.display="none";
						}
						//this.themap.featureCollection.style.display="none";
						//this.themap.featureCollection.style.webkitTransform="translate3d(0,0,0)";
						this.themap.featureCollection.style.top = 0 + "px";
						this.themap.featureCollection.style.left = 0 + "px";
				}
				/* This should prevent flicker after move
				//the oldVectorEl will be visible until the new vectorEl is completely redered. 
				this.oldVectorEl = this.owner.vectorEl;
				//this.owner.vectorEl = this.createVectorElement(this.themap);
				this.owner.vectorEl=this.oldVectorEl.cloneNode();
				console.log(this.owner.owner.vectorLayer,this.owner.owner.overlayDiv);
				if(this.owner.owner.vectorLayer,this.owner.owner.vectorLayer){
					this.owner.owner.vectorLayer.vectorEl.appendChild(this.owner.vectorEl);
				}else{
					this.owner.owner.overlayDiv.appendChild(this.owner.vectorEl);
				}
				console.log(this.owner.vectorEl);
				*/
			}else{
				//console.log(a);
				//this.clear();
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

		/** rendering finished. cleanup */

		if (a < 0) {
			if(this.backend=="canvas"){
				this.ctx.fill();
				this.ctx.stroke();
			}
	
			//values for benchmark test
			this.timestamp=new Date().getTime();
			this.renderIterationTime=this.timestamp - this.starttimestamp;
			this.totalPoints=this.totalPointsCounter;
			this.totalLines=this.totalLinesCounter;

			//rendering is finished
			if (this.oldVectorEl && this.oldVectorEl.parentNode) {
				//use action was move without zoom	
				this.oldVectorEl.parentNode.replaceChild(this.owner.vectorEl, this.oldVectorEl);
				this.owner.vectorEl.style.display = "";
				return;
			}
			this.themap.featureCollection.style.display="";  //after move
			return;
		}
		if(typeof(a)=="number"){
			var line=this.lineArray[a];
		}else{
			var line=a;  //a single vector. mainly used for editing a vector. Rendering only one line is faster than rendering everything (on SVG).
		}
		line.repairBBox(); //here maybe optimization is possible. 


		/*==========================
		rendering starts here
		===========================*/

		//console.log(line,line.bounds.sw().lat(),line.bounds.sw().lng(),line.bounds.ne().lat(),line.bounds.ne().lng());
		//check if line bounds are inside map bounds
//		console.log(this.themap.bounds().sw().lat(),this.themap.bounds().sw().lng(),this.themap.bounds().ne().lat(),this.themap.bounds().ne().lng());
		if(khtml.maplib.base.helpers.overlaps(this.themap.bounds(),line.bbox)){
//		console.log(line.bbox.sw().lat(),line.bbox.sw().lng(),line.bbox.ne().lat(),line.bbox.ne().lng());
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
					if(line.geometry.type=="Polygon" || line.geometry.type=="MultiPolygon" ||   (line.geometry.type=="Polyline" && line.close)){
						line.close="true";

					}else{
						line.style.fill="none";
					}
					line.close="false";
					line.path=path;
					line.element=path;     //dom like - part of API
					line.firstChild=path;  //dom like - part of API
					path.owner=line;
					path.parentNode=line;  //dom like - part of API
					if(line.events){
						for(var e=0;e<line.events.length;e++){
							var ev=line.events[e];
							khtml.maplib.base.helpers.eventAttach(path,ev.eventType,ev.method,ev.context,ev.bubble);
						}
					}
					line.svgtext=this.addText(line);
				}else{
					var path=line.path;
				}
				break;
			case "vml":
				//implementation not finished
				var shape = document.createElement("v:shape");
				shape.style.top = "0px";
				shape.style.left = "0px";
				//shape.style.width = 2000; //this.themap.size.width+"px";
				//shape.style.height = 1000; //this.themap.size.height+"px";
				shape.style.position="relative";
				break;

			}

			//calculate polyline path
			switch(this.backend){
				case "svg":
					var ret=khtml.maplib.overlay.renderer.SVG._calculatePath(line.geometry.coordinates,line.geometry.type,this.themap);
					if(ret.d!=""){
						path.setAttribute("d",ret.d);
						path.style.display="";//line.origDisplay;
					}
					for(var p in line.properties){
						var property=line.properties[p];
						path.setAttribute("mapcss_"+p,property);
					}
					path.style.fillRule="evenodd";
					if(!path.parentNode){
						line.owner.vectorEl.appendChild(path);
					}
					//line.svgtext=this.addText(line);
					break;	
				case "canvas":
					var ret=khtml.maplib.overlay.renderer.Canvas._renderPath(line.geometry.coordinates,line,this.ctx,this.themap);
					break;
				case "vml":
					var ret=khtml.maplib.overlay.renderer.VML._calculatePath(line.geometry.coordinates,line.geometry.type,this.themap);
					if(!this.themap.styler){
						this.themap.styler=new khtml.maplib.overlay.renderer.Styler();
					}
					var style=this.themap.styler.makeCanvasStyle(line);

					if(ret.d!=undefined){
						shape.setAttribute("path",ret.d +" x e");
						shape.setAttribute("fillcolor",style.fillRGB);
						shape.setAttribute("strokecolor",style.strokeRGB);
						//shape.fill.opacity=style.fillOpacity;
						//shape.stroke.opacity=style.strokeOpacity;
						shape.setAttribute("strokeweight", style.lineWidth);
						
						if(line.geometry.type=="Polygon" || line.geometry.type=="MultiPolygon" || line.geometry.type=="LinearRing"){
							shape.setAttribute("filled",true);
						}else{
							shape.setAttribute("filled",false);
						}
						var div=document.createElement("div");
						div.style.position="absolute";
						var top=line.bbox.ne().lat(); //line.bbox[3];		
						var left=line.bbox.sw().lng(); //line.bbox[1];		
						var right=line.bbox.ne().lng(); //line.bbox[1];		
						var bottom=line.bbox.sw().lat(); //line.bbox[1];		
						var xy=this.themap.latlngToXY(new khtml.maplib.LatLng(top,left));
						var xy2=this.themap.latlngToXY(new khtml.maplib.LatLng(bottom,right));
						
						//div.style.top=xy.y -4 -(style.lineWidth*2)+"px";
						//div.style.left=xy.x -5+  -(style.lineWidth*2)+"px";
						//var width=xy2.x - xy.x;
						//var height=xy2.y - xy.y;
						shape.style.height=1680+"px";
						shape.style.width=1250+"px";
						shape.coordsize="1000 1000";
						this.owner.vectorEl.appendChild(shape);
						div.style.border="1px solid red";
			
						//workaround	
						if (this.themap.finalDraw) {
							this.themap.overlayDiv.appendChild(this.owner.vectorEl);
						}
					}
					break;
				default:
					console.log("error: unknow backend");
			}


			this.renderCount+=ret.points;
			this.totalPointsCounter+=ret.points;
			this.totalLinesCounter+=ret.lines;

		}else{ //end inside map bounds
				line.clear();
		}


		//cancel able after some lines
//		this.canvasRenderTimeout=null;
		if(typeof(a)!="number"){
			/* only a single path is called for rendering.
			It is delayed a bit to allow speedier rendering of canvas */
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

		/**
		Here is the point where the function is recalled recursive.
		*/
			this.timestamp=new Date().getTime();
			this.iterationTime=this.timestamp - this.oldtimestamp;
		if (this.renderCount > this.vectorPointsPerIteration) {
			this.vectorPointsPerIteration=Math.ceil(this.vectorPointsPerIteration*100/this.iterationTime);
			if(this.vectorPointsPerIteration < this.minVectorPointsPerIteration)  this.vectorPointsPerIteration=this.minVectorPointsPerIteration;

			this.oldtimestamp=this.timestamp;
			this.renderCount=0;
			var that = this;
			var tempFunction = function() {
				that.render(a - 1);
			}
			setTimeout(tempFunction, 0);
			/*
			if(this.backend=="canvas"){
				this.ctx.fill();
				this.ctx.stroke();
				this.ctx.beginPath();
			}
			*/
		} else {
			//not cancleable recursion
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
			if(coordinates[i] instanceof khtml.maplib.geometry.LatLng){
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
	Add Text to the path. At the moment only supported for SVG Backend
	*/

	this.addText=function(line){
                if(line.textEl){
                        line.textEl.parentNode.removeChild(line.textEl);
                }

		if(!line.text)return;
		if(!line.text.value)return;
		//if(line.path.hasAttribute("id"))return;
		var text=line.text.value;
		var textEl=document.createElementNS("http://www.w3.org/2000/svg","text");
		var textPath=document.createElementNS("http://www.w3.org/2000/svg","textPath");
		textPath.setAttribute("startOffset","50%");
		textEl.appendChild(textPath);
		textPath.appendChild(document.createTextNode(text));
		for(var s in line.text.style){
			textEl.style[s]=line.text.style[s];
		}
		line.text.style=textEl.style;
		textEl.className.baseVal=line.text.className.baseVal;
		line.text.className.baseVal=textEl.className.baseVal;
		if(line.text.style.fontSize){
			var dy=parseFloat(line.text.style.fontSize)/2 ;
		}else{
			dy=0;
		}
		textEl.setAttribute("dy",dy *0.7);
		var id="maplib_khtml_textpath_"+Math.random();
		line.path.setAttribute("id",id);
		textPath.setAttributeNS("http://www.w3.org/1999/xlink","href","#"+id);
		this.owner.vectorEl.appendChild(textEl);
		return textEl;
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
			this.ctx.clearRect(0, 0, this.themap.size.width,
					this.themap.size.height);
		}
		if(this.backend=="svg" ){
			//g will not be deleted
			for(var n=0; n < this.owner.vectorEl.childNodes.length;n++){
				var node=this.owner.vectorEl.childNodes[n];
				if(node){
					if(node.tagName!="g"){
						this.owner.vectorEl.removeChild(node);
					}
				}
			}

		}
		if(this.backend=="vml"){
			while (this.owner.vectorEl.firstChild) {
				this.owner.vectorEl.removeChild(this.owner.vectorEl.firstChild);
			}
		}

	}

	this.remove=function(){
		this.clear();
/*
		if(this.backend=="svg" && this.owner.style){  //the old backend
			var style=new Object;
			var copystyles=["fill","stroke","strokeWidth","opacity","fillOpacity","strokeOpacity"];
			for(var p=0;p< copystyles.length;p++){
				var property=copystyles[p]
				if(this.owner.style[property]!='undefined'){
					style[property]=this.owner.style[property];

				}
			}
		}
*/

		removeLoop(this.owner);
		this.lineArray = new Array();
	}

	function removeLoop(fc){
		if(fc.features){
		for(var i=0;i < fc.features.length;i++){
			//if(fc.features[i].geometry.type=="FeatureCollection"){
				removeLoop(fc.features[i]);
			//}
		}
		}

		var style=new Object;
		var copystyles=["fill","stroke","strokeWidth","opacity","fillOpacity","strokeOpacity"];
		for(var p=0;p< copystyles.length;p++){
			var property=copystyles[p]
			if(fc.style[property]!='undefined'){
				style[property]=fc.style[property];

			}
		}
		fc.style=style;


		if(fc.vectorEl && fc.vectorEl.parentNode){
			fc.vectorEl.parentNode.removeChild(fc.vectorEl);
		}
		delete fc.vectorEl;
		delete fc.vectorLayer;
		delete fc.map;
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
