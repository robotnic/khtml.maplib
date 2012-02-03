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

//this class expect 2 elements with specific classes in the map div
//zoombar and scrollhandle
/**

	@example code to generate zoombar and handle
 <pre><code>
 <div id="map">
 <div class="zoombar" style="position:absolute;left:-10px;width:30px;height:221px;overflow:hidde;">
 <div class="scrollbar" style="position:absolute;left:20px;top:20px;height:200px;width:12px;background-color:white; overflow:hidden;-moz-border-radius: 5px; -webkit-border-radius: 5px;border:2px solid lightgrey;cursor:pointer">
 <div style="position:absolute;top:0px;left:-10px;width:10;height:100%;background-color:green; -moz-box-shadow: 1px 1px 14px #efefef; -webkit-box-shadow: 1px 1px 7px #efefef; box-shadow: 1px 1px 7px #cfcfcf; "> T </div>
 </div>
 <div id="handle" class="scrollhandle" style="position:absolute;left:17px;top:-10px;width:20px;height:20px;background-color:lightgrey;opacity:0.8; border:1px solid grey;-moz-border-radius: 5px; -webkit-border-radius: 5px;text-align:center;cursor:pointer"> 0 </div>
 </div>
 </div>
 
 
 var zoominger=new khtml.maplib.ui.Zoombar();
 map.addOverlay(zoominger);
 map.addCallbackFunction(zoombar);
 zoombar();
 
 function zoombar() {
	document.getElementById("handle").firstChild.nodeValue=Math.round(map.zoom());
 }
 </code></pre>
 */

/**
 * Zoombar
 *
 * @class
*/
khtml.maplib.ui.Zoombar = function() {
	// -------------------------------
	// Private Methods.
	// Intended to be accessed internaly only
	// -------------------------------
	
	/**
	 * Cancels the event if it is cancelable, 
	 * without stopping further propagation of the event.
	*/
	this.moving=false;
	this._cancelEvent = function(evt) {
		evt.cancelBubble = true;
		if (evt.stopPropagation)
			evt.stopPropagation();
	}
	/**
	 * Prevents further propagation of the current event.
	*/
	this._stopEventPropagation = function(evt) {
		if (evt.preventDefault) {
			evt.preventDefault(); // The W3C DOM way
		} else {
			evt.returnValue = false; // The IE way
		}		
	}
	/**
	 * Calculate Z if Y is given. (also use in testcase)
	*/
	this._calcZFromY = function(y) {
		return 22 - y / 10;
	}
	/**
	 * Zoom
	*/
	this._zoom = function(evt) {
		if ((evt.type == "touchstart") || (evt.type == "touchmove"))
			var y = this.map.pageY(evt.touches[0]);
		else
			var y = this.map.pageY(evt) + this.dy;
		this.map.centerAndZoom(this.map.center(),this._calcZFromY(y));
	}
	
	/**
	 * Mousedown or Touchstart
	*/
	this.dy=0;
	this._down = function(evt) {
		if(evt.target){
			var target=evt.target;
		}else{
			var target=evt.srcElement;
		}
		this._cancelEvent(evt);
		this.moving = true;
		if(target==this.scrollhandle){
			this.dy=this.scrollhandle.offsetTop  - this.map.pageY(evt) +10;;
		}else{
			this.dy=0;
		}
		this._zoom(evt);
		this._stopEventPropagation(evt);
	}
	/**
	 * Called while scrolling and Touchmove
	*/
	this._move = function(evt) {
		this._cancelEvent(evt);
		
		if (this.moving) {
			this._zoom(evt);
			this.render();
			this._stopEventPropagation(evt);
		}
	}
	/**
	 * Mouseup or Touchend
	*/
	this._up = function(evt) {
		this._cancelEvent(evt);
		
		this.moving = false;
		
		this._stopEventPropagation(evt);
	}
	
	// -------------------------------
	// Public Methods.
	// Intended to be called from the outside.
	// -------------------------------
	
	/**
	 * called by maplib once
	 */
	this.init = function(map) {
		this.map = map;
		var els = map.mapParent.getElementsByTagName("*");
		for ( var i = 0; i < els.length; i++) {
			var el = els.item(i);
			if (el.className == "scrollhandle") {
				this.scrollhandle = el;
			}
			if (el.className == "zoombar") {
				this.zoombar = el;
			}
		}
		if (navigator.userAgent.indexOf("MSIE") != -1) {		// IE does not support window-Eventhandler
			var w = this.map.mapParent;
		} else {
			var w = window;
		}
		if(!this.zoombar)this.zoombar=this._createZoombar();
		if(!this.scrollhandle)this.scrollhandle=this._createScrollhandle();
		khtml.maplib.base.helpers.eventAttach(this.zoombar, "mousedown", this._down, this, false);
		khtml.maplib.base.helpers.eventAttach(w, "mousemove", this._move, this, false);
		khtml.maplib.base.helpers.eventAttach(w, "mouseup", this._up, this, false);
		
		khtml.maplib.base.helpers.eventAttach(this.zoombar, "touchstart", this._down, this, false);
		khtml.maplib.base.helpers.eventAttach(this.zoombar, "touchmove", this._move, this, false);
		khtml.maplib.base.helpers.eventAttach(this.zoombar, "touchend", this._up, this, false);
	}
	/**
	 * called by maplib on every map change
	 */
	this.render = function() {
		var top = (21 - this.map.zoom()) * 10;
		this.scrollhandle.style.top=top+"px"; //.marginTop = top + "px";
		var z=Math.round(this.map.zoom());
		this.scrollhandle.firstChild.nodeValue=z;
	}

	this._createZoombar=function(){
		var zoombar=document.createElement("div");
		zoombar.setAttribute("style","position:absolute;left:10px;width:30px;height:221px;");
		var scrollbar=document.createElement("div");
		scrollbar.setAttribute("style","position:absolute;left:7px;top:20px;height:200px;width:11px;background-color:white; overflow:hidden;-moz-border-radius: 5px; -webkit-border-radius: 5px;border:1px solid grey;cursor:pointer;box-shadow:inset 2px 2px 3px #e8e8e8;");
		zoombar.appendChild(scrollbar);
		this.map.overlayDiv.appendChild(zoombar);
		return zoombar;
	}
	this._createScrollhandle=function(){
		var scrollhandle=document.createElement("div");
		scrollhandle.setAttribute("style","position:absolute;left:3px;top:-10px;width:20px;height:20px;background-color:lightgrey;opacity:0.8; border:1px solid grey;-moz-border-radius: 5px; -webkit-border-radius: 5px;text-align:center;cursor:pointer;box-shadow:1px 1px 4px grey;");
		scrollhandle.appendChild(document.createTextNode("T"));
		this.zoombar.appendChild(scrollhandle);
		return scrollhandle;
	}


	this.clear=function(){
		this.map.overlayDiv.removeChild(this.zoombar);
	}

}
