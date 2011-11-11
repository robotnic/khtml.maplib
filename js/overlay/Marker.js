// --------------------------------------------------------------------------------------------
// khtml javascript library
// --------------------------------------------------------------------------------------------
// (C) Copyright 2010-2011 by Bernhard Zwischenbrugger, Florian Hengartner, Stefan Kemper, Ewald Wieser
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
 * Generates a MarkerImage-object.<br/>
 * Used for custom-markers and shadow
 * @param {string or Object} [url] url to an image or DOM-object
 * @param {Object} [size] size of the marker, contains two numbers: width and height in pixels
 * @param {Object} [origin] origin in an ImageSprite, contains two numbers: x and y in pixels
 * @param {Object} [anchor] anchorPoint of the marker, contains two numbers: x and y in pixels
 * @param {Object} [scaledSize] not used yet, only for compatibility to Google Markers
 * @class
 
 * @example
 <pre><code>
 var image = new khtml.maplib.overlay.MarkerImage(
	  'img/image.png',		// url
	  {width: 20, height: 20},	// size
	  {x: 0, y: 0},			// origin
	  {x: 10, y: 20}		// anchorPoint
 );
 </pre></code>
*/

khtml.maplib.overlay.MarkerImage = function( url, size, origin, anchor, scaledSize) {
	if (url) this.url = url;
	if (size) this.size = size;
	if (origin) this.origin = origin;
	if (anchor) this.anchor = anchor;
}

/**
 * Generates a MarkerOptions-object.<br/>
 * Options for a marker
 * @param {number} [animation] not used yet, only for compatibility to Google Markers
 * @param {bool} [clickable] not used yet, only for compatibility to Google Markers
 * @param {string} [cursor] not used yet, only for compatibility to Google Markers
 * @param {bool} [draggable] if marker is draggable or not
 * @param {bool} [flat] not used yet, only for compatibility to Google Markers
 * @param {khtml.maplib.overlay.MarkerImage/String/DOM-Element} [icon] custom MarkerImage
 * @param {khtml.maplib.Map} map map to place marker onto
 * @param [optimized] not used yet, only for compatibility to Google Markers
 * @param {khtml.maplib.LatLng} position LatLng where to place marker
 * @param {bool} [raiseOnDrag] lift marker and shadow from the map and show dragcross
 * @param {khtml.maplib.overlay.MarkerImage/String/DOM-Element} [shadow] MarkerImage for custom shadow
 * @param {Object} [shape] shape for custom marker
 * <pre> var marker_shape = {
 *		  type: 'circle', 'rect' or 'poly'
 *		  coord: [x, y, radius] for circle
 *			 [x1, y1, x2, y2] for rect
 *			 [x1, y1, x2, y2, x3, y3, ... xn, yn] for poly
 *		}; </pre>
 * @param {string} [title] title for mouseover
 * @param {bool} [visible] not used yet, only for compatibility to Google Markers
 * @param {number} [zIndex] not used yet, only for compatibility to Google Markers
 * @class
 
 * @example
 <pre><code>
 // define position
 var point = new khtml.maplib.LatLng(50.875311, 0.351563);
 
 // define icon
 var image = new khtml.maplib.overlay.MarkerImage(
	  'img/image.png',		// url
	  {width: 20,height: 20},	// size
	  {x: 0,y:0},			// origin
	  {x:10,y:20}			// anchorPoint
 );
 
 // define shadow
 var shadow = new khtml.maplib.overlay.MarkerImage(
	  'img/shadow.png',		// url
	  {width:34,height:20},		// size
	  {x:0,y:0},			// origin
	  {x:10,y:20}			// anchorPoint
 );
 
 // define shape
 var shape = {
	  coord: [14,0,15,1,16,2,17,3,18,4,19,5,19,6,19,7,19,8,19,9,19,10,19,11,19,12,19,13,19,14,18,15,17,16,16,17,15,18,13,19,5,19,4,18,2,17,2,16,1,15,0,14,0,13,0,12,0,11,0,10,0,9,0,8,0,7,0,6,0,5,1,4,2,3,2,2,4,1,5,0,14,0],
	  type: 'poly'
 };
 
 // define markeroptions
 var markeroptions = new khtml.maplib.overlay.MarkerOptions(
 	  null, 		//animation
	  null, 		//clickable
	  null, 		//cursor
 	  true, 		//draggable
	  null, 		//flat
	  image, 		//icon
	  map, 			//map
	  null, 		//optimized
	  point, 		//position
	  true, 		//raiseOnDrag
	  shadow, 		//shadow
	  shape, 		//shape
	  "moveable marker", 	//title
	  null, 		//visible
	  null 			//zIndex
 );
 
 // make marker
 var marker = new kthml.maplib.overlay.Marker(markeroptions);
 
 
 the last to sections can be combined:
 
 // make marker with markeroptions
 var marker = new mr.overlay.Marker({
	  draggable: true,
	  raiseOnDrag: true,
	  icon: image,
	  shadow: shadow,
	  shape: shape,
	  map: map,
	  position: point,
	  title: "moveable marker"
 });
 </pre></code>
*/

khtml.maplib.overlay.MarkerOptions = function (animation, clickable, cursor, draggable, flat, icon, map, optimized, position, raiseOnDrag, shadow, shape, title, visible, zIndex){
	
	if (draggable) this.draggable = draggable;
	if (icon) this.icon = icon;
	if (map) this.map = map;
	if (position) this.position = position;
	if (raiseOnDrag) this.raiseOnDrag = raiseOnDrag;
	if (shadow) this.shadow = shadow;
	if (shape) this.shape = shape;
	if (title) this.title = title;
}


/**
 * Puts a marker at the specified position on the map.<br/>
 * Has the possibility to add arbitrary html as marker.
 *
 
  @example Minimum code for a static marker:
  <pre><code>
  var marker = new khtml.maplib.overlay.Marker({
  	position: new khtml.maplib.LatLng( latitude, longitude), 
  	map: map,
  	title:"static marker on a position"
  });
  </code></pre>
 * @see Example with other markers: <a href="../../../examples/marker/marker.html">Markers</a>
 * @class 
 * @param {khtml.maplib.overlay.MarkerOptions} MarkerOptions markerOptions for Marker
*/
khtml.maplib.overlay.Marker = function(MarkerOptions) {
	
	
	/**
	 * Set a new position for the marker.
	 * @param {khtml.maplib.LatLng} pos The new position for the marker.
	 * @return {khtml.maplib.LatLng} The current position of the marker.
	*/
    this.setPosition=function(pos){	// not tested yet
		if(pos){
			this.position.lat(pos.lat());
			this.position.lng(pos.lng());
			this.render();
		}
        return this.position;
    }
	
	/**
	 * Get the current position of the marker.
	 * @return {khtml.maplib.LatLng} The current position of the marker.
	*/
	this.getPosition = function(){
		return this.position;
	}
	
	/**
	 * Get the pixelOffset of the markers anchorpoint to the anchorpoint of the infowindow.
	 * @return {point{x,y}} Object with two integers.
	*/
	this.pixelOffset=function(){
		var point = new Array();
		if(!isNaN(parseInt(this.marker.style.width)) && !isNaN(parseInt(this.marker.style.height))){
			point["x"] = parseInt(this.marker.style.width)/2;
			point["y"] = parseInt(this.marker.style.height);
		}
		else
			point = {x:0,y:0};
        return (point);
	}


	/**
	 * Remove the marker from the map. Marker still exists, will still be rendered.
	*/
    this.clear=function(){
        if(this.marker){
			if(this.marker.parentNode){
				try{
					this.owner.overlayDiv.markerDiv.removeChild(this.marker);
					if (this.shadow)
					this.owner.overlayDiv.shadowDiv.removeChild(this.shadow);
				}catch(e){}
			}
        }
    }
	
	
	/**
	 * Destroy the marker. Will not be rendered any more.
	*/
	this.destroy=function(){
		this.mapObj.removeOverlay(this);
	}
	
/*
    this._mousemoveTo = function (point) {
        this.position = point;
        this.render();
    }
*/

	this.callbackFunctions = new Array();
	/**
	 * Add a callback function.
	 * @param {function} func The function to call.
	*/
	this.addCallbackFunction = function(func) {
			if (typeof (func) == "function") {
					this.callbackFunctions.push(func);
			}
	}
	/**
	 * Execute the callback functions.
	*/
	this._executeCallbackFunctions = function() {
	var that=this;
			for ( var i = 0; i < this.callbackFunctions.length; i++) {
					this.callbackFunctions[i].call(that);
			}
	}
	
	/**
	 * Set the cursor to show when mouse is over marker.
	 * @param {String} string Accepts vendor specific cursors but no URLs. 
	*/
	this._setCursor = function(string){
		if(this.MarkerOptions.shape  &&
		(navigator.userAgent.indexOf("MSIE") == -1) && 		// IE does not shape area perfectly, so we don't use it with IE
		(navigator.userAgent.indexOf("iPhone")  == -1) &&		// also don't use shape area on iOS devices for better touchable markers
		(navigator.userAgent.indexOf("iPad")  == -1)){			// android and windows mobile ???{
			khtml.maplib.base.helpers.setCursor(this.marker, "");
			khtml.maplib.base.helpers.setCursor(this.area, string);
		}else{
			khtml.maplib.base.helpers.setCursor(this.marker, string);
		}
	}


/* Moveable extension */
    this.moving=false;
	
	// Mouse functions
	/**
	 * mousedown function
	*/
    this._mousedown=function(evt){
		this.moving=true;
		// calculate mousecursor-offset on marker div
        this.clickx=this.marker.offsetLeft - this.mapObj.pageX(evt) + this.dx;
        this.clicky=this.marker.offsetTop - this.mapObj.pageY(evt) + this.dy;
		
		// suppress image dragging
		if (evt.preventDefault) {
			evt.preventDefault(); // The W3C DOM way
		} else {
			window.event.returnValue = false; // The IE way
		}
		// stop event from being passed to map
		// to avoid moving the map when dragging a marker
		if (evt.stopPropagation) { 
			evt.stopPropagation(); // The W3C DOM way
		} else {
			window.event.cancelBubble = true; // The IE way
		}
		
		if (navigator.userAgent.indexOf("MSIE") != -1) {		// IE does not support window-Eventhandler
			var w = this.mapObj.mapParent;
		} else {
			var w = window;
		}
		khtml.maplib.base.helpers.eventAttach(w,"mousemove",this._mousemove,this,false);
        khtml.maplib.base.helpers.eventAttach(w,"mouseup",this._mouseup,this,false);
		
		// fist-cursor
		khtml.maplib.base.helpers.setCursor(this.mapObj.mapParent, "grabbing");
		this._setCursor("grabbing");
    }
	/**
	 * mousemove function
	*/ 
    this._mousemove=function(evt){
        if(this.moving){
			this.x = this.mapObj.pageX(evt) + this.clickx;
			this.y = this.mapObj.pageY(evt) + this.clicky;
			this.position.lat(this.mapObj.XYTolatlng(this.x,this.y).lat());
			this.position.lng(this.mapObj.XYTolatlng(this.x,this.y).lng());
			this.render();
			
			// stop event from being passed to map
			if (evt.stopPropagation) { 
				evt.stopPropagation(); // The W3C DOM way
			} else {
				window.event.cancelBubble = true; // The IE way
			}
			
			// clicked marker comes to foreground, seen at Google Maps
			this.marker.style.zIndex=1000000;
			if (this.shadow)
				this.shadow.style.zIndex=1000000;
			
			// raise marker when drag started
			if((this.MarkerOptions.raiseOnDrag == null) || (this.MarkerOptions.raiseOnDrag == true)) {
				if (!this.raised){
					// attach dragcross
					this.dragcross = document.createElement("div");
					this.dragcross.style.position = "absolute";
					this.dragcross.dx = 8;
					this.dragcross.dy = 8;
					if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
					&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
						var el = document.createElement('div');
						el.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + dragcross_image + "')";
						el.style.width = "100%";
						el.style.height = "100%";
					}
					else{
						var el = document.createElement('img');
						el.setAttribute('src', dragcross_image);				// data-URI
					}
					this.dragcross.style.width = "16px";
					this.dragcross.style.height = "16px";
					this.dragcross.appendChild(el);
					//var xy = this.mapObj.latlngToXY(this.position);
					this.dragcross.style.left = (this.x - this.dragcross.dx) + "px";
            		this.dragcross.style.top = (this.y - this.dragcross.dy) + "px";
					this.owner.overlayDiv.markerDiv.appendChild(this.dragcross);
					// next steps because of scopeproblem with setInterval
					var that = this;
					var tempFunction = function () {
						that._raiseMarker();
					};
					window.clearInterval(this.markerDropInterval);
					this.markerRaiseInterval=window.setInterval(tempFunction,5);
					this.raised = true;
				}
			}
			
			// todo: suppress mouseclick, when moving marker to stop unwanted opens of infobox
			// todo: render according infobox, when marker is moved
			
			// move map when dragging marker to the edge
			this._mousemoveMap();
        }
    }
	/**
	 * mouseup function
	*/ 
    this._mouseup=function(){
		if (this.moving)
		{
			this.position.lat(this.mapObj.XYTolatlng(this.x,this.y).lat());
			this.position.lng(this.mapObj.XYTolatlng(this.x,this.y).lng());
        	this.moving=false;
			// stop moving map
			mapMoveSpeed = 1;
			mapMoveSpeedX = 1;
			mapMoveSpeedY = 1;
			window.clearInterval(this.mapmoveInterval);
		}
		// set z-index according to position, the lower, the more in the front
		var xy = this.mapObj.latlngToXY(this.position);
		this.marker.style.zIndex = this.mapObj.size.height + xy["y"];
		if(this.shadow)
			this.shadow.style.zIndex = xy["y"];
			
		// drop marker when raised before
		if((this.MarkerOptions.raiseOnDrag == null) || (this.MarkerOptions.raiseOnDrag == true)) {
			if (this.raised){
				// remove dragcross
				this.owner.overlayDiv.markerDiv.removeChild(this.dragcross);
				// next steps because of scopeproblem with setInterval
				var that = this;
				var tempFunction = function () {
					that._dropMarker();
				};
				window.clearInterval(this.markerRaiseInterval);
				this.markerDropInterval=window.setInterval(tempFunction,5);
				this.raised = false;
			}
		}
		
		// hand-cursor
		khtml.maplib.base.helpers.setCursor(this.mapObj.mapParent, "grab");
		// finger-cursor
		this._setCursor("pointer");

		this.render();
		this._executeCallbackFunctions();
    }
	
	// Touch functions
	/**
	 * touchstart function
	*/ 
	this._touchstart=function(evt){
		//alert("start");
		if (evt.touches.length == 1) {		// marker only movable, when 1 finger applied, 2 fingers used for zooming
			this.moving=true;
			this.touchx=this.marker.offsetLeft - this.mapObj.pageX(evt.touches[0]);
			this.touchy=this.marker.offsetTop - this.mapObj.pageY(evt.touches[0]);
			
			khtml.maplib.base.helpers.eventAttach(window,"touchmove",this._touchmove,this,true);	// capturing necessary for not moving map!
			khtml.maplib.base.helpers.eventAttach(window,"touchend",this._touchend,this,true);
		}
		// prevent moving a marker with 2 fingers applied for zooming
		else
			this.moving = false;
    }
	/**
	 * touchmove function
	*/ 
    this._touchmove=function(evt){
        if((evt.touches.length == 1) && this.moving){		// marker only movable, when 1 finger applied, 2 fingers used for zooming
			this.x = this.mapObj.pageX(evt.touches[0]) + this.touchx + this.dx;
			this.y = this.mapObj.pageY(evt.touches[0]) + this.touchy + this.dy;
			this.position.lat(this.mapObj.XYTolatlng(this.x,this.y).lat());
			this.position.lng(this.mapObj.XYTolatlng(this.x,this.y).lng());
			this.render();
			
			if(!this.clicked){	//only suppress, when no click-handler added
				// stop event from being passed to map
				// to avoid moving the map when dragging a marker
				if (evt.stopPropagation) { 
					evt.stopPropagation(); // The W3C DOM way
				} else {
					window.event.cancelBubble = true; // The IE way
				}
			}
			
			// touched marker comes to foreground, seen at Google Maps
			this.marker.style.zIndex=1000000;
			if (this.shadow)
				this.shadow.style.zIndex=1000000;
			
			// raise marker when drag started
			if((this.MarkerOptions.raiseOnDrag == null) || (this.MarkerOptions.raiseOnDrag == true)) {
				if (!this.raised){
					// attach dragcross
					this.dragcross = document.createElement("div");
					this.dragcross.style.position = "absolute";
					this.dragcross.dx = 8;
					this.dragcross.dy = 8;
					if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
					&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
						var el = document.createElement('div');
						el.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + dragcross_image + "')";
						el.style.width = "100%";
						el.style.height = "100%";
					}
					else{
						var el = document.createElement('img');
						el.setAttribute('src', dragcross_image);				// data-URI
					}
					this.dragcross.style.width = "16px";
					this.dragcross.style.height = "16px";
					this.dragcross.appendChild(el);
					//var xy = this.mapObj.latlngToXY(this.position);
					this.dragcross.style.left = (this.x - this.dragcross.dx) + "px";
            		this.dragcross.style.top = (this.y - this.dragcross.dy) + "px";
					this.owner.overlayDiv.markerDiv.appendChild(this.dragcross);
					// next steps because of scopeproblem with setInterval
					var that = this;
					var tempFunction = function () {
						that._raiseMarker();
					};
					window.clearInterval(this.markerDropInterval);
					this.markerRaiseInterval=window.setInterval(tempFunction,20);
					this.raised = true;
				}
			}
			
			// move map when dragging marker to the edge
			this._mousemoveMap();
        }
    }
	/**
	 * touchend function
	*/ 
    this._touchend=function(){
        if (this.moving){
			this.position.lat(this.mapObj.XYTolatlng(this.x,this.y).lat());
			this.position.lng(this.mapObj.XYTolatlng(this.x,this.y).lng());
        	this.moving=false;
			// stop moving map
			mapMoveSpeed = 1;
			mapMoveSpeedX = 1;
			mapMoveSpeedY = 1;
			window.clearInterval(this.mapmoveInterval);
		}
		// set z-index according to position, the lower, the more in the front
		var xy = this.mapObj.latlngToXY(this.position);
		this.marker.style.zIndex = xy["y"];
		if(this.shadow)
			this.shadow.style.zIndex = xy["y"];
			
		// drop marker when raised before
		if((this.MarkerOptions.raiseOnDrag == null) || (this.MarkerOptions.raiseOnDrag == true)) {
			if (this.raised){
				// remove dragcross
				this.owner.overlayDiv.markerDiv.removeChild(this.dragcross);
				// next steps because of scopeproblem with setInterval
				var that = this;
				var tempFunction = function () {
					that._dropMarker();
				};
				window.clearInterval(this.markerRaiseInterval);
				this.markerDropInterval=window.setInterval(tempFunction,20);
				this.raised = false;
			}
		}
		
		// stop moving map
		window.clearInterval(this.mapmoveInterval);
		
		this.render();
    }
	
	
	/**
	 * raise the marker when starting to drag
	*/ 
	this._raiseMarker=function(){
		// raise the marker 20 pixels
		this.dy += 20/4;
		// raise and shift shadow 15 pixels
		if (this.shadow){
			this.shadow.dx -= 15/4;
			this.shadow.dy += 15/4;
		}
		this.render();
		if(isNaN(this.i))
			this.i = 0;
		this.i+=5;
		// repeat 20 times
		if (this.i > 20)
			window.clearInterval(this.markerRaiseInterval);
	}
	/**
	 * drop the marker when stop dragging
	*/ 
	this._dropMarker=function(){
		// bugfix for markers not raised are constantly dropping
		if(isNaN(this.i))
			this.i = 0;
		else if (this.i>=5){
			this.i-=5;
			// lower the marker 20 pixels
			this.dy -= 20/4;
			// lower and shift shadow 15 pixels
			if(this.shadow){
				this.shadow.dx += 15/4;
				this.shadow.dy -= 15/4;
			}
			this.render();
		}
		// repeat 20 times
		//if (this.i <= 0)
		else
			window.clearInterval(this.markerDropInterval);
	}
	
	
	var mapMoveSpeedX = 1;
	var mapMoveSpeedY = 1;
	var mapMoveMaxSpeed = 10;
	/**
	 * move map when dragging marker to the edge
	 * speed depending on distance to edge, the nearer, the faster
	*/ 
	this._mousemoveMap=function(){
		var that = this;
		// move left
		if (this.mapObj.latlngToXY(this.position)["x"] < this.mapObj.size.width/10){
			mapMoveSpeedX = (1 - (this.mapObj.latlngToXY(this.position)["x"]/(this.mapObj.size.width/10)))*mapMoveMaxSpeed;
			// move left up
			if (this.mapObj.latlngToXY(this.position)["y"] < this.mapObj.size.height/10){
				window.clearInterval(this.mapmoveInterval);
				mapMoveSpeedY = (1 - (this.mapObj.latlngToXY(this.position)["y"]/(this.mapObj.size.height/10)))*mapMoveMaxSpeed;
				this.mapmoveInterval = window.setInterval( function(){
					that.mapObj.moveXY(mapMoveSpeedX,mapMoveSpeedY);  
				} , 10);
			}
			// move left down
			else if (this.mapObj.latlngToXY(this.position)["y"] > (this.mapObj.size.height-this.mapObj.size.height/10)){
				window.clearInterval(this.mapmoveInterval);
				mapMoveSpeedY = (1 - (this.mapObj.size.height - this.mapObj.latlngToXY(this.position)["y"])/(this.mapObj.size.height/10))*mapMoveMaxSpeed;
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(mapMoveSpeedX,-mapMoveSpeedY); 
				} , 10);
			}
			// move left
			else{
				window.clearInterval(this.mapmoveInterval);
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(mapMoveSpeedX,0);  
				} , 10);
			}
		}
		// move right
		else if (this.mapObj.latlngToXY(this.position)["x"] > (this.mapObj.size.width-this.mapObj.size.width/10)){
			mapMoveSpeedX = (1 - (this.mapObj.size.width - this.mapObj.latlngToXY(this.position)["x"])/(this.mapObj.size.width/10))*mapMoveMaxSpeed;
			// move right up
			if (this.mapObj.latlngToXY(this.position)["y"] < this.mapObj.size.height/10){
				window.clearInterval(this.mapmoveInterval);
				mapMoveSpeedY = (1 - (this.mapObj.latlngToXY(this.position)["y"]/(this.mapObj.size.height/10)))*mapMoveMaxSpeed;
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(-mapMoveSpeedX,mapMoveSpeedY);
				} , 10);
			}
			// move right down
			else if (this.mapObj.latlngToXY(this.position)["y"] > (this.mapObj.size.height-this.mapObj.size.height/10)){
				window.clearInterval(this.mapmoveInterval);
				mapMoveSpeedY = (1 - (this.mapObj.size.height - this.mapObj.latlngToXY(this.position)["y"])/(this.mapObj.size.height/10))*mapMoveMaxSpeed;
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(-mapMoveSpeedX,-mapMoveSpeedY);
				} , 10);
			}
			// move right
			else{
				window.clearInterval(this.mapmoveInterval);
				
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(-mapMoveSpeedX,0); 
				} , 10);
			}
		}
		else{
			// move up
			if (this.mapObj.latlngToXY(this.position)["y"] < this.mapObj.size.height/10){
				window.clearInterval(this.mapmoveInterval);
				mapMoveSpeedY = (1 - (this.mapObj.latlngToXY(this.position)["y"]/(this.mapObj.size.height/10)))*mapMoveMaxSpeed;
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(0,mapMoveSpeedY); 
				} , 10);
			}
			// move down
			else if (this.mapObj.latlngToXY(this.position)["y"] > (this.mapObj.size.height-this.mapObj.size.height/10)){
				window.clearInterval(this.mapmoveInterval);
				mapMoveSpeedY = (1 - (this.mapObj.size.height - this.mapObj.latlngToXY(this.position)["y"])/(this.mapObj.size.height/10))*mapMoveMaxSpeed;
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(0,-mapMoveSpeedY); 
				} , 10);
			}
			// stop moving
			else{
				window.clearInterval(this.mapmoveInterval);
				mapMoveSpeedX = 1;
				mapMoveSpeedY = 1;
			}
		}
	}
	
	
	/**
	 * Make the marker moveable by function.
	*/ 
	this.makeMoveable=function(){
		// attach handlers to shape area
		if (this.MarkerOptions.shape) {
			khtml.maplib.base.helpers.eventAttach(this.area,"mousedown",this._mousedown,this,false);        		
		 	khtml.maplib.base.helpers.eventAttach(this.area,"touchstart",this._touchstart,this,false);
		}
		// attach handlers to div
		else{
        	khtml.maplib.base.helpers.eventAttach(this.marker,"mousedown",this._mousedown,this,false);        		
			khtml.maplib.base.helpers.eventAttach(this.marker,"touchstart",this._touchstart,this,false);
		}
		this.MarkerOptions.draggable = true;
    }
	
	
	this.clickDetectX = -1;
	this.clickDetectY = -1;
	/**
	 * workaround for detecting a click on touch devices
	 * original click event is suppressed by touchmove-handler of the map
	*/  
	this._touchclickdetectstart = function(evt){
		if (evt.touches.length == 1) {
            this.clickDetectX = -1;
            this.clickDetectY = -1;	
			this.clicked = true;	
		}
	}
	this._touchclickdetectmove = function(evt){
		if (evt.touches.length == 1) {
            this.clickDetectX = evt.touches[0].pageX;
            this.clickDetectY = evt.touches[0].pageY;
			
			if (this.MarkerOptions.draggable){	// only prevent moving map, when marker moveable
				// stop event from being passed to map
				// to avoid moving the map when dragging a marker
				if (evt.stopPropagation) { 
					evt.stopPropagation(); // The W3C DOM way
				} else {
					window.event.cancelBubble = true; // The IE way
				}
			}
		}
		//alert("move");
	}
	this._touchclickdetectstop = function(evt){
		//alert(this.clickDetectX + " " + this.clickDetectY);
		if (evt.touches.length == 0) {
			if ((this.clickDetectX == -1) && (this.clickDetectY == -1)){
				this.originalClickFunction();
				this.clicked = false;
			}	
		}
	}
	

	/**
	 * workaround for detecting a mouseclick on a marker eg. to open infowindow
	 * to not open infowindow accidentially when marker is moved
	*/  
	this._mouseclickdetectstart = function(evt){
		//ewi: which mousebutton?
		this.leftclick = false;
		if (!evt) var evt = window.event;
		if (evt.which) this.leftclick = (evt.which == 1);
		else if (evt.button) this.leftclick = (evt.button == 0) || (evt.button == 1);
	}
	this._mouseclickdetectmove = function(evt){
		this.leftclick = false;
	}
	this._mouseclickdetectstop = function(evt){
		if (this.leftclick)
			this.originalClickFunction();
	}
	
	
	/**
	 * Attaching Eventhandlers to the marker.
	 * e.g. for showing infobox on a click on the marker
	 * @param t
	 * @param f
	 * @param fc
	 * @param c
	*/  
	this.attachEvent = function( t, f, fc, c) {
		
		if (!fc) fc = this;
		if (!c) c = false;
		// workaround for detecting a click on touch devices
		// original click event is suppressed by touchmove-handler of the map
		if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))){
			if (t == "click"){
				this.originalClickFunction = f;
				// attach handler to shape area
				if (this.MarkerOptions.shape) {
					khtml.maplib.base.helpers.eventAttach(this.area, "touchstart", this._touchclickdetectstart, fc, c);
					khtml.maplib.base.helpers.eventAttach(this.area, "touchmove", this._touchclickdetectmove, fc, c);
					khtml.maplib.base.helpers.eventAttach(this.area, "touchend", this._touchclickdetectstop, fc, c);
				}
				// attach handler to div
				else{
					khtml.maplib.base.helpers.eventAttach(this.marker, "touchstart", this._touchclickdetectstart, fc, c);
					khtml.maplib.base.helpers.eventAttach(this.marker, "touchmove", this._touchclickdetectmove, fc, c);
					khtml.maplib.base.helpers.eventAttach(this.marker, "touchend", this._touchclickdetectstop, fc, c);
				}	
			}
		}
		// normal devices
		else {
			if (t == "click"){
				this.originalClickFunction = f;
				// attach handler to shape area
				if (this.MarkerOptions.shape) {
					khtml.maplib.base.helpers.eventAttach(this.area, "mousedown", this._mouseclickdetectstart, fc, c);
					khtml.maplib.base.helpers.eventAttach(this.area, "mousemove", this._mouseclickdetectmove, fc, c);
					khtml.maplib.base.helpers.eventAttach(this.area, "mouseup", this._mouseclickdetectstop, fc, c);
				}
				// attach handler to div
				else{
					khtml.maplib.base.helpers.eventAttach(this.marker, "mousedown", this._mouseclickdetectstart, fc, c);
					khtml.maplib.base.helpers.eventAttach(this.marker, "mousemove", this._mouseclickdetectmove, fc, c);
					khtml.maplib.base.helpers.eventAttach(this.marker, "mouseup", this._mouseclickdetectstop, fc, c);
				}	
			}
		}
	}
	
	
	/**
	 * Initialize the marker on the map. Automatically called when adding the marker to the map.
	 * @param {khtml.maplib.map} owner
	*/ 
	this.init = function (owner) {
        this.owner=owner;
		if(owner instanceof khtml.maplib.base.Map){
            this.mapObj=owner;
		}else{
			this.mapObj=owner.map;
		}
		this.x = this.mapObj.latlngToXY(this.position)["x"];
		this.y = this.mapObj.latlngToXY(this.position)["y"];
		// create a seperate div for the markers
		if(!this.owner.overlayDiv.markerDiv){
			this.owner.overlayDiv.markerDiv = document.createElement("div")
			this.owner.overlayDiv.appendChild(this.owner.overlayDiv.markerDiv);
			this.owner.overlayDiv.markerDiv.setAttribute("id", "markerDiv");
		}
		// create a seperate div for the marker-shadows
		if(this.shadow && !this.owner.overlayDiv.shadowDiv){
			this.owner.overlayDiv.shadowDiv = document.createElement("div")
			this.owner.overlayDiv.insertBefore(this.owner.overlayDiv.shadowDiv, this.owner.overlayDiv.markerDiv);
			this.owner.overlayDiv.shadowDiv.setAttribute("id", "shadowDiv");
		}
		// append marker
        this.owner.overlayDiv.markerDiv.appendChild(this.marker);
		// append shadow
        if (this.shadow)
			this.owner.overlayDiv.shadowDiv.appendChild(this.shadow);
			
		// making marker moveable by MarkerOptions
		if (this.MarkerOptions.draggable == true){
			this.makeMoveable();
		}
		// eventhandlers for changing mousepointer for not moveable markers
		else {
			khtml.maplib.base.helpers.eventAttach(this.marker,"mousedown",function() { 
				if (!this.MarkerOptions.draggable) {
					this.clicked = true;
				}
			},this,false);
			khtml.maplib.base.helpers.eventAttach(this.marker,"mousemove",function() { 
				if (!this.MarkerOptions.draggable) {
					// hand when clicked, otherwise finger
					if (this.clicked == true)
						this._setCursor("grabbing");
					else
						this._setCursor("pointer");
				}
			},this,false);
			
			if (navigator.userAgent.indexOf("MSIE") != -1) {		// IE does not support window-Eventhandler
				var w = this.mapObj.mapParent;
			} else {
				var w = window;
			}
			khtml.maplib.base.helpers.eventAttach(w,"mouseup",function() { 
				if (!this.MarkerOptions.draggable) {
					this.clicked = false;
					// finger-cursor
					this._setCursor("pointer");
				}
			},this,false);
		}
    }
	


	/**
	 * Render marker, shadow and dragcross. Automatically called by map.
	*/  
    this.render = function () {
        if(!this.marker)return;
        if(!this.position)return;
        if(isNaN(this.position.lat()))return;
        if(isNaN(this.position.lng()))return;
		
		if(this.moving){
			var x = this.x;
			var y = this.y;
		}
		else{
        	var xy = this.mapObj.latlngToXY(this.position);
			var x = xy["x"];
			var y = xy["y"];
			this.x = x;
			this.y = y;
		}
		// marker out of map: hide
        if ((x < -this.width || y < -this.height || x > (this.mapObj.size.width + this.width) || y > (this.mapObj.size.height + this.height))  // <---- flag  ; workaround for overflow:hidden bug
			&& !this.moving){
            this.marker.style.display = "none";
			if (this.shadow)
				this.shadow.style.display = "none";
        } // marker in map 
		else {
			//
			this.marker.style.display = "";
			this.marker.style.left = (x - this.dx) + "px";
			this.marker.style.top = (y - this.dy) + "px";
			if (this.shadow){
				this.shadow.style.display = "";
				this.shadow.style.left = (x - this.shadow.dx) + "px";
				this.shadow.style.top = (y - this.shadow.dy) + "px";
			}
			// dragcross attached with raiseOnDrag
			if (this.dragcross){
				this.dragcross.style.left = (x - this.dragcross.dx) + "px";
				this.dragcross.style.top = (y - this.dragcross.dy) + "px";	
			}
				
			// if not moving, set z-index according to position, the lower, the more in the front
			if (!this.moving){
				this.marker.style.zIndex = this.mapObj.size.height + parseInt(y);
				if(this.shadow)
					this.shadow.style.zIndex = parseInt(y);
			}
        }
		// create a seperate div for the markers, if not existing yet
		if(!this.owner.overlayDiv.markerDiv){
			this.owner.overlayDiv.markerDiv = document.createElement("div")
			this.owner.overlayDiv.appendChild(this.owner.overlayDiv.markerDiv);
			this.owner.overlayDiv.markerDiv.setAttribute("id", "markerDiv");
		}
		// create a seperate div for the marker-shadows, if not existing yet
		if(this.shadow && !this.owner.overlayDiv.shadowDiv){
			this.owner.overlayDiv.shadowDiv = document.createElement("div")
			this.owner.overlayDiv.insertBefore(this.owner.overlayDiv.shadowDiv, this.owner.overlayDiv.markerDiv);
			this.owner.overlayDiv.shadowDiv.setAttribute("id", "shadowDiv");
		}
		// attach marker to markerdiv, if not attached yet
        if(!this.marker.parentNode){
            this.owner.overlayDiv.markerDiv.appendChild(this.marker);
        }
		// attach shadow to shadowdiv, if not attached yet
        if(this.shadow && !this.shadow.parentNode){
            this.owner.overlayDiv.shadowDiv.appendChild(this.shadow);
        }
    }
	
	
	// ---------------------
	// Constructor
	// ---------------------
	// create the marker
	
	this.nodeType="Marker";
	this.nodeName="Marker";
	this.geometry=new Object();
	this.geometry.type="Point";
	this.type="Marker";
	
	// increase marker counter
	this.constructor.number++;
	
	// create div to contain marker
	var div = document.createElement("div");
	div.style.position = "absolute";
	this.marker = div;
	
	if(MarkerOptions)
	{
		this.MarkerOptions = MarkerOptions;
		
		if (MarkerOptions.position){
			this.position = MarkerOptions.position;
			this.geometry.coordinates=MarkerOptions.position;
		}
		
		// custom marker defined
		if (MarkerOptions.icon)	{
			
			if (((typeof(MarkerOptions.icon) == "string") ||
				(typeof(MarkerOptions.icon) == "object")) && !MarkerOptions.icon.url)
				MarkerOptions.icon.url = MarkerOptions.icon;
			
			// object is a DOM-element
			if (typeof(MarkerOptions.icon.url) == "object"){
				div.appendChild(MarkerOptions.icon.url);
				if (MarkerOptions.title)
					div.setAttribute("title", MarkerOptions.title);
				this._setCursor("pointer");
			} 
			// object is a URL
			if (typeof(MarkerOptions.icon.url) == "string") {
				var el = document.createElement('img');
				el.setAttribute('src', MarkerOptions.icon.url);
				if (MarkerOptions.icon.origin) {
					if (MarkerOptions.icon.origin.x)	el.style.left = MarkerOptions.icon.origin.x;
					if (MarkerOptions.icon.origin.y)	el.style.top = MarkerOptions.icon.origin.y;
				}
				el.style.border = 0;
				el.style.margin = 0;
				el.style.padding = 0;
				khtml.maplib.base.helpers.imageNotSelectable(el);
				div.appendChild(el);
				
				if((MarkerOptions.shape) &&
				(navigator.userAgent.indexOf("MSIE") == -1) && 		// IE does not shape area perfectly, so we don't use it with IE
				(navigator.userAgent.indexOf("iPhone")  == -1) &&		// also don't use shape area on iOS devices for better touchable markers
				(navigator.userAgent.indexOf("iPad")  == -1)){			// android and windows mobile ???
					el.setAttribute('usemap', '#shapemap' + this.constructor.number);
					
					var elmap = document.createElement('map');
					elmap.setAttribute('id', 'shapemap' + this.constructor.number);
					elmap.setAttribute('name', 'shapemap' + this.constructor.number);
					
					elmaparea = document.createElement('area');
					elmaparea.setAttribute('shape', MarkerOptions.shape.type);
					elmaparea.setAttribute('coords', MarkerOptions.shape.coord);
					if (MarkerOptions.title)
						elmaparea.setAttribute('title', MarkerOptions.title);
					elmaparea.style.cursor = 'pointer';
					elmaparea.style.display = 'block';	// block for problems with webkit-browsers (http://www.sitepoint.com/forums/css-53/map-hover-overs-display-profile-hovered-area-723109.html)
					elmap.appendChild(elmaparea);
					div.appendChild(elmap);
					this.area = elmaparea;
				}
				else{
					this.MarkerOptions.shape = null;
					this.area = null;
					if(MarkerOptions.title)
						el.setAttribute('title', MarkerOptions.title);
					// finger-cursor when over div
					this._setCursor("pointer");
				}
			}
				
			if (MarkerOptions.icon.anchor){
				if(MarkerOptions.icon.anchor.y){
					this.dy = Math.abs(parseInt(MarkerOptions.icon.anchor.y));
				}else{	
					this.dy = 0;
				}
				if(MarkerOptions.icon.anchor.x){
					this.dx = Math.abs(parseInt(MarkerOptions.icon.anchor.x));
				}else{	
					this.dx = 0;
				}
			}
			else {this.dx = 0; this.dy = 0;}
			
			if (MarkerOptions.icon.size){
				if(MarkerOptions.icon.size.width){
					this.width = Math.abs(parseInt(MarkerOptions.icon.size.width)) ;
					div.style.width = this.width + "px";
					div.style.overflow = "hidden";
				} else
					div.style.width = "auto";
				if(MarkerOptions.icon.size.height){
					this.height = Math.abs(parseInt(MarkerOptions.icon.size.height)) ;
					div.style.height = this.height + "px";
					div.style.overflow = "hidden";
				} else
					div.style.height = "auto";
			}
			else {div.style.width = "auto"; div.style.height = "auto";}
			
			// custom shadow	
			if (MarkerOptions.shadow)
			{
				var shadowdiv = document.createElement("div");
				shadowdiv.style.position = "absolute";
				this.shadow = shadowdiv;
				
				if (((typeof(MarkerOptions.shadow) == "string") ||
				(typeof(MarkerOptions.shadow) == "object")) && !MarkerOptions.shadow.url)
					MarkerOptions.shadow.url = MarkerOptions.shadow;
				
				// custom shadow definded
				if (MarkerOptions.shadow.url){
					
					if(MarkerOptions.shadow.anchor.y){
						this.shadow.dy = Math.abs(parseInt(MarkerOptions.shadow.anchor.y));
					}else{	
						this.shadow.dy = 0;
					}
					if(MarkerOptions.shadow.anchor.x){
						this.shadow.dx = Math.abs(parseInt(MarkerOptions.shadow.anchor.x));
					}else{	
						this.shadow.dx = 0;
					}
					if(MarkerOptions.shadow.size.width){
						shadowdiv.style.width = Math.abs(parseInt(MarkerOptions.shadow.size.width)) + "px";
						shadowdiv.style.overflow = "hidden";
					}
					if(MarkerOptions.shadow.size.height){
						shadowdiv.style.height = Math.abs(parseInt(MarkerOptions.shadow.size.height)) + "px";
						shadowdiv.style.overflow = "hidden";
					}
					
					// DOM-Element
					if(typeof(MarkerOptions.shadow.url) == "object") {
						shadowdiv.appendChild(MarkerOptions.shadow.url);
					}
					// image-URL
					else if(typeof(MarkerOptions.shadow.url) == "string") {
						var el = document.createElement('img');
						el.setAttribute('src', MarkerOptions.shadow.url);
						el.style.position = 'absolute';
						if (MarkerOptions.shadow.origin.x)
							el.style.left = MarkerOptions.shadow.origin.x + 'px';
						else
							el.style.left = 0;
						if (MarkerOptions.shadow.origin.y)
							el.style.top = MarkerOptions.shadow.origin.y + 'px';
						else	
							el.style.top = 0;//-this.shadow.dy + 'px';
						khtml.maplib.base.helpers.imageNotSelectable(el);
						shadowdiv.appendChild(el);	
					}
					this.shadow.dx = this.dx;
					this.shadow.dy = this.dy;
				}
			}
		}
		// no custom icon defined -> STANDARDMARKER
		else {
			// standardmarkershadow image
			var shadowdiv = document.createElement("div");
			shadowdiv.style.position = "absolute";
			this.shadow = shadowdiv;
			
			if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
			&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
				var el = document.createElement('div');
				el.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src='" + standardmarker_shadow + "')";
				el.style.width = "100%";
				el.style.height = "100%";
			}
			else{
				var el = document.createElement('img');
				el.setAttribute('src', standardmarker_shadow);						// data-URI
			}
			el.style.position = 'absolute';
			el.style.left = '0px';
			el.style.top = '0px';
			khtml.maplib.base.helpers.imageNotSelectable(el);
			
			shadowdiv.style.width = "42px";
			shadowdiv.style.height = "36px";
			shadowdiv.appendChild(el);
			this.shadow.dx = 2;
			this.shadow.dy = 36;
			
			// standardmarker image	
			if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
			&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
				var el = document.createElement('div');
				el.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src='" + standardmarker_image + "')";
				el.style.width = "100%";
				el.style.height = "100%";
			}
			else{
				var el = document.createElement('img');
				el.setAttribute('src', standardmarker_image);					// data-URI
			}
			el.style.border = 0;
			el.style.margin = 0;
			el.style.padding = 0;
			khtml.maplib.base.helpers.imageNotSelectable(el);
					
			if (navigator.userAgent.indexOf("MSIE") == -1) {		// IE does not shape area perfectly, so we don't use it with IE
				el.setAttribute('usemap', '#shapemap' + this.constructor.number);
			}
			else if (MarkerOptions){
				if (MarkerOptions.title)
					el.setAttribute('title', MarkerOptions.title);
			}
			div.style.width = "20px";
			div.style.height = "36px";
			div.appendChild(el);
			
			// standardmarker shape
			if ((navigator.userAgent.indexOf("MSIE") == -1) && 		// IE does not shape area perfectly, so we don't use it with IE
				(navigator.userAgent.indexOf("iPhone")  == -1) &&		// also don't use shape area on iOS devices for better touchable markers
				(navigator.userAgent.indexOf("iPad")  == -1)){			// android and windows mobile ???
				var elmap = document.createElement('map');
				elmap.setAttribute('id', 'shapemap' + this.constructor.number);
				elmap.setAttribute('name', 'shapemap' + this.constructor.number);
				var elmaparea = document.createElement('area');
				elmaparea.setAttribute('href', 'javascript:void(0)');
				elmaparea.setAttribute('shape', standardmarker_shape.type);
				elmaparea.setAttribute('coords', standardmarker_shape.coord);
				if (MarkerOptions){
					if (MarkerOptions.title)
						elmaparea.setAttribute('title', MarkerOptions.title);
				}
				elmaparea.style.cursor = 'pointer';
				elmaparea.style.display = 'block';	// block for problems with webkit-browsers (http://www.sitepoint.com/forums/css-53/map-hover-overs-display-profile-hovered-area-723109.html)
				elmap.appendChild(elmaparea);
				div.appendChild(elmap);
				this.area = elmaparea;
				this.MarkerOptions.shape = {};
			}
			else {
				this.MarkerOptions.shape = null;
				this.area = null;
				// finger-cursor when over div
				this._setCursor("pointer");
			}
			this.dx = 2;
			this.dy = 36;
			div.style.width = "20px";
			div.style.height = "36px";
		}
		
		if (MarkerOptions.map)
			MarkerOptions.map.addOverlay(this);
	}
	// standard values, if no MarkerOptions defined	
	else {
		this.MarkerOptions = {};
		this.MarkerOptions.draggable = false;
		this.dx = 0;
		this.dy = 0;
		this._setCursor("pointer");
	}
	
	//suppress doubleclick zoom in on marker
	//khtml.maplib.base.helpers.eventAttach(this.marker, "dblclick", khtml.maplib.base.helpers.cancelEvent, this, false);
}


// static property
// number of markers
// only increased, never decreased
// for unique identification (eg. shape-area)
khtml.maplib.overlay.Marker.number = 0;



if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support data-URI
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
	/*if (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 6){
		dragcross_image = khtml.maplib.standardimagepath + './dragcross_red.png';		// special images with reduced colors for transparency in IE6
		standardmarker_image = khtml.maplib.standardimagepath + './standardmarker_red.png';
		standardmarker_shadow = khtml.maplib.standardimagepath + './standardmarkershadow_red.png';
	}
	else*/
	{
		dragcross_image = khtml.maplib.standardimagepath + './dragcross_nor.png';		// normal images
		standardmarker_image = khtml.maplib.standardimagepath + './standardmarker_nor.png';
		standardmarker_shadow = khtml.maplib.standardimagepath + './standardmarkershadow_nor.png';
	}
}else{ // others do support data-URI

// embedded images for standardmarker (non IE)

// Shadow and Shape created with Google Map Custom Marker Maker
// http://www.powerhut.co.uk/googlemaps/custom_markers.php

// base64 created with: http://www.scalora.org/projects/uriencoder/

dragcross_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMTAxQzYzNzA4MjI2ODExOERCQkMxRjgyMEJGMzlFNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNjVGMDcwMEMxMDAxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNjVGMDZGRkMxMDAxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjExMDFDNjM3MDgyMjY4MTE4REJCQzFGODIwQkYzOUU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjExMDFDNjM3MDgyMjY4MTE4REJCQzFGODIwQkYzOUU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/o5aeQAAAThJREFUeNpi8fX1ZaAEMEFpUSCWJkGfChDzwwzgBOItQHwMiHWJ0GwPxCeBeCkQM8MM+A7EclBDnPBoTgDiXUAsBNIM0gsy4B0QuwHxMiDmAeLtUIXooB2I5wMxGxB3ALEnEH+BhcEvII6GSrBBFTZC5UAuXA3EFVB1iUBcCTOVBc0WkMR9IJ4GxHVArAnFOlCXBgHxQWQNLFicOguIHwHxOiAOhYrdA2J3IL6DKxrRAQ+a3A+o8xmIMaAC6md2KH0FiLVwRTOyAbDAa0cKjzAgtoH6WxpqiAc2AySAeC80+r5D/d4BlfsIjeYFUK9tRI5mkAGK0JRlAw08ByBeg+ZSWPR1oLsUZMBTaOieAmJzKI0LVEIN+gtNueBoBJnuDxX8TkReAHnlJhCfRU4HX0jMxcdhDIAAAwCWaUA1qBZjTAAAAABJRU5ErkJggg==';

standardmarker_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAkCAYAAACJ8xqgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA69pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6RkNCNEU4MzM0OTA4REYxMUE2MURCMjI3RURERjU5RjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTY1RjA3MDRDMTAwMTFFMDhDNzNDM0Y5QTQ5QjQ1OTgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTY1RjA3MDNDMTAwMTFFMDhDNzNDM0Y5QTQ5QjQ1OTgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0RTM3MEU5QkUxMjM2ODExOERCQkMxRjgyMEJGMzlFNSIg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';

standardmarker_shadow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAkCAYAAAD/yagrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGREJEQjUxMTUyMjQ2ODExOERCQkMxRjgyMEJGMzlFNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNjVGMDcwOEMxMDAxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNjVGMDcwN0MxMDAxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkZEQkRCNTExNTIyNDY4MTE4REJCQzFGODIwQkYzOUU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkZEQkRCNTExNTIyNDY4MTE4REJCQzFGODIwQkYzOUU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+aE6NVAAAAhZJREFUeNrslutugkAQhVlQvGvTS9offf93a9PGajUIsrudjWeSyQYRAds0WZKTVSHycebMLMpaG/2HQwXQABpAA2gADaABNIAG0DagSqne/rNiVeK7PGyFTic8A/sEZZiEFGMdQAkkgQ1Jk0pSQTrisz1x9g+qBFhKGpHG0AhKARzjegtQB3cg7UjfWB208Um7gjKgg5mR5qQF1gl+HwpXlQfqHM1JW9IH6Z20cQ/ggw46upgCcEW6xzqDm6mIgZ9bmc8jHqYUrpYyr21BOYdjgD2QHkl3cHFYkce6RpL5teJc1BU0BqQDfCY9kZb4Lanp8KrDoPSc0Qxudh5PCrlzZX4lvQBy5JW47uB8lgDbIJtvpDXAjd/1gxZlH6JZVlgvQVoPUKOz96QvNNEnHC1wTdS19KpmgNuaQc4O5nBxB8g1Oj5DU5lzN74W1IqSOQemohkYiOF4mB/hFM9L1l4A6qoG6tpMRtx0DmcNYErcVO44Oa7PsB7ELnQR8NpmUiKfEzE3F4DcA5zdkdtj6YEZf1+vLF2LLVSJ7XGOLl+gGgUiwDnTZ140bBO4tqC+i0sxL9nFDZzMa8rY6j2yKagSe7h0MRZ7s9+tvb7YNgGNUVbOIruo4d62gYs3B41R6ikgOYu5yCJ3rb0V5CVQJZxcAlaJUZShefQtAZuCsptjnOc5WHgdHf01aCJecrXQrwGeA/0RYACGHUt80iKakgAAAABJRU5ErkJggg==';
}

standardmarker_shape = {
  coord: [13,0,15,1,16,2,17,3,18,4,18,5,19,6,19,7,19,8,19,9,19,10,19,11,19,12,19,13,18,14,18,15,17,16,16,17,15,18,13,19,8,20,8,21,8,22,7,23,7,24,7,25,7,26,6,27,6,28,6,29,5,30,5,31,5,32,4,33,4,34,3,35,1,35,1,34,1,33,1,32,1,31,1,30,2,29,2,28,2,27,3,26,3,25,3,24,4,23,4,22,4,21,4,20,5,19,4,18,3,17,2,16,1,15,1,14,0,13,0,6,1,4,2,3,3,2,4,1,6,0,13,0],
  type: 'poly'
};
