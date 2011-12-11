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
 * Puts the supplied element at the specified positions.
 * Has the possibility to add arbitrary html as marker.
 *
 * DEPRECATED: please use one {khtml.maplib.displayable.Marker}
 * {khtml.maplib.displayable.Marker} has the advantage to support {khtml.maplib.overlay.Layer}. (You can put those marker inside layers)
 *
 * This is intended to ease transition from the previous khtml api to the new, as you can first only
 * rename all uses of khtml.maplib.Marker to khtml.maplib.overlay.Marker and then refactor the code to use the
 * new {khtml.maplib.displayable.Marker} class.
 *
 * @deprecated
 * @param {khtml.maplib.LatLng} point
 * @param {DOMElement} el
 * @param {Object} options
 * @class
*/
khtml.maplib.overlay.SimpleMarker = function(point, el, options) {
	this.nodeType="SimpleMarker";
	this.nodeName="SimpleMarker";
	this.geometry=new Object();
	this.geometry.coordinates=point;
	this.geometry.type="Point";
	this.type="SimpleMarker";
	var div = document.createElement("div");
	div.appendChild(el);
	div.style.position = "absolute";

	if (options) {
		if (options.dy) {
			if(typeof(options.dy)=="number"){
				div.style.top = options.dy+"px";
			}else{		
				div.style.top = options.dy;
			}
		} 
		if (options.dx) {
			if(typeof(options.dx)=="number"){
				div.style.left = options.dx+"px";
			}else{		
				div.style.left = options.dx;
			}
		}
		/*
		if (options.dx) {
			div.style.left = options.dx;
		} else {
			div.style.left = "0px";
		}
		*/
	} else {
		div.style.top = "0px";
		div.style.left = "0px";
	}
	var div2 = document.createElement("div");
	div2.style.position = "absolute";
	div2.appendChild(div);
	this.marker = div2;
	this.point = point;
	this.options = options;
	this.el = el

	this.init = function(owner) {
		this.style=this.marker.style;
		this.owner=owner;
		this.marker.owner=this;
		if(owner instanceof khtml.maplib.base.Map){
                        this.mapObj=owner;
		}else{
			this.mapObj=owner.map;
		}
		owner.overlayDiv.appendChild(this.marker);
		//this.render();
	}
	this.render = function() {
		if (!this.mapObj)
			return;
		if (!this.marker)
			return;
		if (!this.point)
			return;
		if (isNaN(this.point.lat()))
			return;
		if (isNaN(this.point.lng()))
			return;
		var xy = this.mapObj.latlngToXY(this.point);
		if (xy["x"] < 0 || xy["y"] < 0) { // <---- flag  ; workaround for overflow:hidden bug
			this.marker.style.display = "none";
		} else {
			this.marker.style.display = "";
			this.marker.style.left = xy["x"] + "px";
			this.marker.style.top = (xy["y"]) + "px";
		}
		if (!this.marker.parentNode) {
			this.owner.overlayDiv.appendChild(this.marker);
		}
	}
	this.position = function(pos) {
		if (pos) {
			this.point = pos;
			this.render();
		}
		return this.point;
	}

	this.clear = function() {
		if (this.marker) {
			if (this.marker.parentNode) {
				this.marker.parentNode.removeChild(this.marker);
			}
		}
	}
	/**
         * Destroy the marker. Will not be rendered any more.
        */
        this.destroy=function(){
		this.clear();
		//console.log(this.point);
             //   this.mapObj.removeOverlay(this);
        }


	/*
	 this.moveTo = function (point) {
	 this.point = point;
	 this.render();
	 }
	 */

	/** Moveable extension */

	this.moveable = function(enabled) {
		this.enabled=enabled;
		if(this.enabled){
			this.downevent=khtml.maplib.base.helpers.eventAttach(this.marker, "mousedown", this.down, this, true);
			this.moveevent=khtml.maplib.base.helpers.eventAttach(window, "mousemove", this.move, this, true);
			this.upevent=khtml.maplib.base.helpers.eventAttach(window, "mouseup", this.up, this, true);
		}else{
			khtml.maplib.base.helpers.eventRemove(this.downevent);
			khtml.maplib.base.helpers.eventRemove(this.moveevent);
			khtml.maplib.base.helpers.eventRemove(this.upevent);
		}
	}
	this.moving = false;
	this.dx = 0;
	this.dy = 0;
	this.down = function(evt) {
		this.moving = true;
		this.dx = this.marker.offsetLeft - this.mapObj.pageX(evt)
		this.dy = this.marker.offsetTop - this.mapObj.pageY(evt)
	}
	this.move = function(evt) {
		if (this.moving) {
			var x = this.mapObj.pageX(evt) + this.dx;
			var y = this.mapObj.pageY(evt) + this.dy;
			//this.marker.style.left=x+"px";
			//this.marker.style.top=y+"px";
			//var p=this.mapObj.XYTolatlng(x, y);
			var p=this.mapObj.mouseToLatLng(evt);
			this.point.lat(p.lat());
			this.point.lng(p.lng());
			this.render();
			evt.stopPropagation();
		}
	}
	this.up = function() {
		this.moving = false;
	}
}
