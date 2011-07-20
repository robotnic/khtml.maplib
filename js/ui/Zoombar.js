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
/*
 <div id="map">
 <div class="zoombar" style="position:absolute;width:30px;height:221px;overflow:hidden">
 <div class="scrollhandle" style="position:absolute;left:0px;top:0px;width:30px;height:300px;background-color:yellow"> </div>
 <img class="scrollbar " src="scrollbar.png" style="position:absolute;left:0px;top:00px;" />
 </div>
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
		var y = this.themap.pageY(evt);
		this.themap.zoom(this._calcZFromY(y));
	}
	
	// -------------------------------
	// Public Methods.
	// Intended to be called from the outside.
	// -------------------------------
	
	/**
	 * called by maplib once
	 */
	this.init = function(themap) {
		this.themap = themap;
		var els = themap.mapParent.getElementsByTagName("*");
		for ( var i = 0; i < els.length; i++) {
			var el = els.item(i);
			if (el.className == "scrollhandle") {
				this.scrollhandle = el;
			}
			if (el.className == "zoombar") {
				this.zoombar = el;
			}
		}
		khtml.maplib.base.helpers.eventAttach(this.zoombar, "mousedown", this.down, this, false);
		khtml.maplib.base.helpers.eventAttach(this.zoombar, "mousemove", this.move, this, false);
		khtml.maplib.base.helpers.eventAttach(this.zoombar, "mouseup", this.up, this, false);
	}
	/**
	 * called by maplib on every map change
	 */
	this.render = function() {
		var top = (22 - this.themap.zoom()) * 10;
		this.scrollhandle.style.marginTop = top + "px";
	}

	/**
	 * Mouse DOWN
	*/
	this.down = function(evt) {
		this._cancelEvent(evt);
		
		this.moving = true;
		
		this._zoom(evt);
		
		this._stopEventPropagation(evt);
	}
	/**
	 * Called while scrolling.
	*/
	this.move = function(evt) {
		this._cancelEvent(evt);
		
		if (this.moving) {
			this._zoom(evt);
			
			this._stopEventPropagation(evt);
		}
	}
	/**
	 * Mouse UP
	*/
	this.up = function(evt) {
		this._cancelEvent(evt);
		
		this.moving = false;
		
		this._stopEventPropagation(evt);
	}
}