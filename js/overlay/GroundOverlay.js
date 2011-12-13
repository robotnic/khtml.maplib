// --------------------------------------------------------------------------------------------
// khtml javascript library
// --------------------------------------------------------------------------------------------
// (C) Copyright 2011 by Florian Hengartner, Stefan Kemper
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
 *
 * Marker Object - work in progress
 * There should be a possibility to add arbitrary html as marker.
 *
 * @param {khtml.maplib.LatLng} point
 * @param {DOMElement} el
 * @param {Object} options
 * @class
 * @borrows khtml.maplib.overlay.RenderableMixin#_parseOptions as #_parseOptions
 * @borrows khtml.maplib.overlay.RenderableMixin#parent as #parent
 * @borrows khtml.maplib.overlay.RenderableMixin#map as #map
*/
khtml.maplib.overlay.GroundOverlay = function(bounds, el, options) {	
	this.geometry=new Object;
	this.geometry.type="GroundOverlay";
	this.options=options;
	this.type="Feature";
	// ---------------------------------------------------------------
	// Private - should not be used from the outside
	// ---------------------------------------------------------------

	this._createRenderElement = function() {
		var innerDiv = document.createElement("div");

		// Chain elements
		innerDiv.appendChild(this.el);
		
		// style innerDiv - set defaults
		innerDiv.style.position = "absolute";
		innerDiv.style.top = "0px";
		innerDiv.style.left = "0px";
		
		// style innerDiv - use options
		if (this.options) {
			if (this.options.dy) {
				innerDiv.style.top = this.options.dy;
			}
			if (this.options.dx) {
				innerDiv.style.left = this.options.dx;
			}
		}
		
		return innerDiv;
	}
	
	/**
	 * calculates element size and set it
	*/
	this._calcImageSize = function() {
		var sw = this.map.latlngToXY(this.bbox.sw());
		var ne = this.map.latlngToXY(this.bbox.ne());
		var nw = this.map.latlngToXY(this.bbox.nw());
		
		// calculates width and height
		dx = ne["x"] - sw["x"];
		dy = sw["y"] - ne["y"];
		
		this.renderElement.style.width = dx;
		this.renderElement.style.height = dy;

		// Set top-left position
		this.renderElement.style.left = (nw["x"]) + "px";
		this.renderElement.style.top = (nw["y"]) + "px";
		
		var img = this.renderElement.getElementsByTagName("img")[0]
		
		// the image in the div needs to be scaled too
		if(img && img.tagName == "IMG") {
			img.width = dx;
			img.height = dy;
		}
	}
		
	// ---------------------------------------------------------------
	// Public
	// ---------------------------------------------------------------

	/**
	 * Initialize.
	 * Applies rotation to "renderElement".
	 *
	 * @params {Object} options Use options.map and options.parent to assign map/parent. Example: <pre>init({map:myMap, parent: myParent});</pre>
	*/
	this.init = function(owner) {
		this.owner=owner;
		if(owner instanceof khtml.maplib.base.Map){
			this.map=owner;
		}else{
			this.map=owner.map;
		}
		
		//this.owner.overlayDiv.appendChild(this.renderElement);
//		this._parseOptions(options);
		
		// debug bounds
		// khtml.maplib.base.helpers.showOnMap(this.bounds, this._map);
		
		// rotate Element
		khtml.maplib.base.helpers.rotate(this.renderElement,this.rotation*-1);
	}
	
	/**
	 * Render this GroundOverlay.
	 *
	 * 1. ensure that this Layer has been initialized. (this.init()).
	 * 2. execute all pending dom manipulations (this._updateDom()).
	 * 3. execute render() on contained layers and features.
	*/
	this.render = function() {
		if (!this.renderElement)
			return;
		if (!this.point)
			return;
		if (isNaN(this.point.lat()))
			return;
		if (isNaN(this.point.lng()))
			return;
		if(!this.map)
			return;
			
		if(null == this.renderElement.parentNode) {
			this.owner.overlayDiv.appendChild(this.renderElement);
		}
		
		// TODO: Bei "this.map().getBounds().intersects(this.bounds)" werden die Koordinaten des nicht
		// 		 rotierten Images verwendet. 
		//		 Lösung: eine Methode this.boundsRotated() erzeugen, damit mit dieser Fläche verglichen werden kann.
		//		 Achtung: Funktioniert die Methode intersects() mit rotierten Rechtecken?

			this._calcImageSize();
		/*kapier ich nicht
		if(this.map.bounds().intersects(this.bbox)) {
			this._calcImageSize();
		} else {
			// remove this image
			this.clear();
		}
		*/
	}
	
	/**
	 * Set/get bounds of groundoverlay
	 */
	this.bounds = function(bounds) {
		if (bounds) {
			//this.bbox = bounds;  //so geht das natuerlich nicht
			//console.log("bounding box is read only");
		}

		if (this.rotation) {
			// should return the bounds after rotation
			// TODO: calculate rotated Boundingbox; unsure if calculation is correct allready
			khtml.maplib.base.Log.log("lng: "+this.bbox.sw().lng()+"; lat:"+this.bbox.sw().lat());
			var newSW = this._transformPoint(this.bbox.sw());
			khtml.maplib.base.Log.log("lng: "+newSW.lng()+"; lat:"+newSW.lat());
			var newSE = this._transformPoint(this.bbox.se());
			var newNE = this._transformPoint(this.bbox.ne());
			var newNW = this._transformPoint(this.bbox.nw());
			
			var min_x = Math.min(newSW.lng(), newSE.lng(), newNE.lng(), newNW.lng());			
			var min_y = Math.min(newSW.lat(), newSE.lat(), newNE.lat(), newNW.lat());
			
			var max_x = Math.max(newSW.lng(), newSE.lng(), newNE.lng(), newNW.lng());
			var max_y = Math.max(newSW.lat(), newSE.lat(), newNE.lat(), newNW.lat());
			
			khtml.maplib.base.Log.log("in bounds");
						
			return new khtml.maplib.geometry.Bounds(new khtml.maplib.LatLng(min_y, min_x), new khtml.maplib.geometry.Point(max_y, max_x));
			
//			return this.bbox;
		} else {
			return this.bbox;
		}
	}
	this._transformPoint = function(point) {
		var rotCenter = this.bbox.getCenter();
		var x0 = rotCenter.lng();
		var y0 = rotCenter.lat();
		
		var theta = this.rotation * Math.PI/180;
		
		khtml.maplib.base.Log.log("theta: "+theta);
		khtml.maplib.base.Log.log("rotation: "+this.rotation);
		
		var x = point.lng();
		var y = point.lat();
		
		
		// source: http://stackoverflow.com/questions/622140/calculate-bounding-box-coordinates-from-a-rotated-rectangle-picture-inside
		// transforms the corners of the unrotated boundingbox
		var x2 = x0+(x-x0)*Math.cos(theta)+(y-y0)*Math.sin(theta);
		var y2 = y0-(x-x0)*Math.sin(theta)+(y-y0)*Math.cos(theta);
		
		var point= new khtml.maplib.LatLng(y2, x2);
		//console.log(y2,x2);
		var marker=new khtml.maplib.overlay.SimpleMarker(point,"http://www.din-5008-richtlinien.de/bilder/punkt.gif",{dx:-1,dy:-1});	
		map.addOverlay(marker);
		return point;
	} 
	
	/**
	 * Set/get position
	*/
	this.position = function(pos) {
		if (pos) {
			this.point = pos;
		}
		return this.point;
	}
	/**
	 * Remove element from DOM.
	*/
	this.clear = function() {
//		this._removeChildRenderElementFromParent(this);
		this.renderElement.parentNode.removeChild(this.renderElement);
	}
	/** Moveable extension */

	this.makeMoveable = function() {
		khtml.maplib.base.helpers.eventAttach(this.renderElement, "mousedown", this.down, this, false);
		khtml.maplib.base.helpers.eventAttach(window, "mousemove", this.move, this, true);
		khtml.maplib.base.helpers.eventAttach(window, "mouseup", this.up, this, true);
	}
	this.moving = false;
	this.dx = 0;
	this.dy = 0;
	this.down = function(evt) {
		this.moving = true;
		this.dx = this.renderElement.offsetLeft - this._map.pageX(evt)
		this.dy = this.renderElement.offsetTop - this._map.pageY(evt)
	}
	this.move = function(evt) {
		if (this.moving) {
			var x = this._map.pageX(evt) + this.dx;
			var y = this._map.pageY(evt) + this.dy;
			//this.renderElement.style.left=x+"px";
			//this.renderElement.style.top=y+"px";
			this.point = this._map.XYTolatlng(x, y);
			this.render();
			evt.stopPropagation();
		}
	}
	this.up = function() {
		this.moving = false;
	}
/*	
	// ------------------------------------------------------------
	// Constructor (TODO: move all constructor stuff here!)
	// ------------------------------------------------------------
		
	// Mixins
	khtml.maplib.base.helpers.mixin(
		khtml.maplib.displayable.GroundOverlay.prototype, 
		khtml.maplib.overlay.RenderableMixin,
		new Array("_removeChildRenderElementFromParent","_parseOptions", "parent", "map")
	);
*/
	
	// Elements
	//this.parent(null);
	//this.map(null);
	//this.renderElement = null;
	
	// Arguments
	this.options = options;
	this.el = el;
	this.bbox = bounds;
	
	// element is allways placed with the top left corner at the point given to the marker layer (means NW position)
	this.point = this.bbox.nw();
	
	if(options != undefined) {
		if(options.rotation != undefined) {
			this.rotation = options.rotation;
		}
	}

	this.renderElement = this._createRenderElement();
}
