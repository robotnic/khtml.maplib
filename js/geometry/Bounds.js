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
 * An area defined by 2 Points: southwest (bottom-left) and northeast (top-right)
 *
 * Boundaries:
 * Latitude: +90° (North), -90° (South)
 * Longitude: -180° (West), +180° (East)
 *
 * @param {khtml.maplib.LatLng} southwest
 * @param {khtml.maplib.LatLng} northeast
 * @class
*/
khtml.maplib.geometry.Bounds = function(p1, p2) {
	/**
	 * If given point is outside the boundaries, enlarge boundaries to enclose the given point.
	 *
	 * @param {khtml.maplib.LatLng} point
	*/
	this.enlarge = function(point) {
		// LONGITUDE (WEST-EAST)
		if(point.lng() > this.southwest.lng() && point.lng() > this.northeast.lng()) {
			// Enlarge to the east side! (Bigger wins)
			this.northeast.lng(point.lng());
		} else {
			// Point is inside this.southwest.lng and this.northeast.lng or west of this.southwest.lng
		}
		
		if(point.lng() < this.southwest.lng() && point.lng() < this.northeast.lng()) {
			// Enlarge to the west side! (Smaller wins)
			this.southwest.lng(point.lng());
		} else {
			// Point is inside this.southwest.lng and this.northeast.lng or east of this.northeast.lng
		}

		// LATITUDE (NORTH-SOUTH)
		if(point.lat() > this.southwest.lat() && point.lat() > this.northeast.lat()) {
			// Enlarge to the north side! (Bigger wins)
			this.northeast.lat(point.lat());
		} else {
			// Point is below northest point of boundaries
		}
		
		if(point.lat() < this.southwest.lat() && point.lat() < this.northeast.lat()) {
			// Enlarge to the south side! (Smallest wins)
			this.southwest.lat(point.lat());
		} else {
			// Point is above southest point of boundaries
		}
	}
	
	/**
	 * Southwest / Bottom-Left
	 *
	 * @returns {khtml.maplib.LatLng}
	*/
	this.sw = function() {
		return this.southwest;
	}
	
	/**
	 * Southeast / Bottom-Right
	 *
	 * @returns {khtml.maplib.LatLng}
	*/
	this.se = function() {
		return new khtml.maplib.LatLng(
			this.southwest.lat(), //-this.northeast.lng(),
			this.northeast.lng() //-this.southwest.lat()
		);
		// South: 
		//return new khtml.maplib.LatLng(this.sou.lat(), this.bounds.sw().lng());;
		//return this.southwest;
	}
	
	/**
	 * Northeast / Top-Right
	 *
	 * @returns {khtml.maplib.LatLng}
	*/
	this.ne = function() {
		return this.northeast;
	}
	
	/**
	 * Northeast / Top-Left
	 *
	 * @returns {khtml.maplib.LatLng}
	*/
	this.nw = function() {
		return new khtml.maplib.LatLng(
			this.northeast.lat(), //-this.northeast.lng(),
			this.southwest.lng() //-this.southwest.lat()
		);
		// South: 
		//return new khtml.maplib.LatLng(this.sou.lat(), this.bounds.sw().lng());;
		//return this.southwest;
	}
	
	/**
	 * @returns {khtml.maplib.LatLng}
	*/
	this.getCenter = function() {
		return this.center;
	}
	
	/**
	 * @param {khtml.maplib.base.Map} themap
	 * @returns {khtml.maplib.LatLng}
	*/
	this.getOpticalCenter = function(themap) {
		var swXY = themap.latlngToXY(this.southwest);
		var neXY = themap.latlngToXY(this.northeast);
		var centerX = Math.abs(swXY["x"] + neXY["x"]) / 2;
		var centerY = Math.abs(swXY["y"] + neXY["y"]) / 2;
		var centerLatLng = themap.XYTolatlng(centerX, centerY);
		return centerLatLng;
	}
	
	/**
	 * @param {khtml.maplib.base.Map} themap
	 * @returns {int}
	*/
	this.getZoomLevel = function(themap) {
		origZoom = themap.getZoom();
		var swXY = themap.latlngToXY(this.southwest);
		var neXY = themap.latlngToXY(this.northeast);
		var dx = Math.abs(swXY["x"] - neXY["x"]);
		var dy = Math.abs(swXY["y"] - neXY["y"]);
		var zoomX = themap.width / dx;
		var zoomY = themap.height / dy;
		if (zoomX > zoomY)
			var zoom = zoomY;
		if (zoomX <= zoomY)
			var zoom = zoomX;

		var dzoom = (Math.log(zoom)) / (Math.log(2));
		var newzoom = origZoom + dzoom;
		return (newzoom);
	}
	
	/**
	 * Diagonal distance of bounds, from southwest-point to northeast-point
	*/
	this.getDistance = function() {
		return this.distance(this.southwest.lat(), this.southwest.lng(),
				this.northeast.lat(), this.northeast.lng());
	}
	
	/**
	 * Radius for max. possible circle inside this box.
	 *
	 * @returns {int}
	*/
	this.getInnerRadius = function() {
		var w = this.distance(this.center.lat(), this.southwest.lng(), this.center
				.lat(), this.northeast.lng());
		var h = this.distance(this.southwest.lat(), this.center.lng(),
				this.northeast.lat(), this.center.lng());
		if (w > h) {
			return h / 2;
		} else {
			return w / 2;
		}
	}

	/**
	 * Distance for two WGS84 points in meter.
	*/
	this.distance = function(latdeg1, lngdeg1, latdeg2, lngdeg2) {
		//Umrechnung von Grad auf Radian
		var lat1 = latdeg1 * Math.PI / 180;
		var lng1 = lngdeg1 * Math.PI / 180;
		var lat2 = latdeg2 * Math.PI / 180;
		var lng2 = lngdeg2 * Math.PI / 180;

		//Eigentliche Berechnung
		var w = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1)
				* Math.cos(lat2) * Math.cos(lng2 - lng1))
				* 180 / Math.PI;
		var d = w / 360 * 40000 * 1000;

		return d; //in meter
	}
	
	/**
	 * Check if another bound intersects this bounds.
	 * Algorithm: check if any of the bounds edges is within this bounds area.
	 * TODO: could you do it simpler? http://tekpool.wordpress.com/2006/10/11/rectangle-intersection-determine-if-two-given-rectangles-intersect-each-other-or-not/
	 * TODO: probably won't work for rotated rectangles, make it work! Ticket: #357
	 *
	 * @param {khtml.maplib.geometry.Bounds} anotherBounds
	*/
	this.intersects = function(anotherBounds) {
		if(! (anotherBounds instanceof khtml.maplib.geometry.Bounds)) {
			khtml.maplib.base.Log.warn('Bounds.intersects(): Illegal argument. Has to be "khtml.maplib.geometry.Bounds"!');
			return false;
		}
		
		// TODO: Is min/max necessary? (Note the values can be negative or positive!)
		
		// Latitude - Y Coordinates of Rectangle
		var minLat = Math.min(this.sw().lat(), this.ne().lat());
		var maxLat = Math.max(this.sw().lat(), this.ne().lat());
		// Longitude - X Coordinates of Rectangle
		var minLng = Math.min(this.sw().lng(), this.ne().lng());
		var maxLng = Math.max(this.sw().lng(), this.ne().lng());

		var edges = new Array();
		edges.push(anotherBounds.ne());
		edges.push(anotherBounds.se());
		edges.push(anotherBounds.sw());
		edges.push(anotherBounds.nw());
		
		// Check every edge
		for(var i = 0; i < edges.length; i++) {
			var edge = edges[i];
			var isInsideLat = (edge.lat() >= minLat && edge.lat() <= maxLat);
			var isInsideLng = (edge.lng() >= minLng && edge.lng() <= maxLng);
			
			//khtml.maplib.base.Log.log(edge.lat() +">="+ minLat+" && "+edge.lat()+" <= "+ maxLat + " == " + isInsideLat);
			//khtml.maplib.base.Log.log(edge.lng() +">="+ minLng+" && "+edge.lng()+" <= "+ maxLng + " == " + isInsideLng);
			
			// inside area?
			if(isInsideLat && isInsideLng) return true;
		}
		
		return false;
	}
	this.createBoundsFrom2Points=function(p1, p2) {
		var sw = new khtml.maplib.LatLng(
			Math.min(p1.lat(), p2.lat())/*lat-south*/, Math.min(p1.lng(),p2.lng()) /*lng-west*/);
		var ne = new khtml.maplib.LatLng(
			Math.max(p1.lat(), p2.lat())/*lat-north*/, Math.max(p1.lng(),p2.lng()) /*lng-east*/)

		return {sw:sw,ne:ne}
	}

	
	// ---------------------
	// Constructor
	// ---------------------
	var b=this.createBoundsFrom2Points(p1,p2);
	this.southwest = b.sw;
	this.northeast = b.ne;
	this.center = new khtml.maplib.LatLng(
			(this.southwest.lat() + this.northeast.lat()) / 2,
			(this.southwest.lng() + this.northeast.lng()) / 2);
}

/*
khtml.maplib.geometry.bounds.merge = function(bounds1, bounds2) {
	khtml.maplib.base.Log.log('arg1:',bounds1);
	khtml.maplib.base.Log.log('arg2:',bounds2);
	var myB = new khtml.maplib.geometry.Bounds(bounds1.sw(),bounds1.ne());
	
	myB.enlarge(bounds2.sw());
	myB.enlarge(bounds2.ne());

	khtml.maplib.base.Log.log('result:',myB);
	return myB;
}
*/
