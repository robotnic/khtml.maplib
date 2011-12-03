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
 * Point (2D).
 * Implements a copy constructor, use like <pre>new khtml.maplib.LatLng(oldPoint);</pre>
 *
 * @param {float/khtml.maplib.LatLng/object} lat Latitude - position on y axis (vertical)
 * @param {float} lng Longitude - position on x axis (horizontal)
 * @class
*/
khtml.maplib.geometry.LatLng = function(lat, lng) {
        this.callbackFunctions = new Array();
	/**
	Register a callback function or method. "this" will be set to this object in user defined callback function.
	*/
        this.addCallbackFunction = function(func) {
                if (typeof (func) == "function") {
                        this.callbackFunctions.push(func);
                }
        }
	/**
	remove callback function
	*/
	this.removeCallbackFunction=function(func){
		for(var i=0;i<this.callbackFunctions.length;i++){
			if(this.callbackFunctions[i]==func){
				this.callbackFunctions.splice(i,1);
			}
		}
	}
	/**
	Internal used to do the callback
	*/
        this._executeCallbackFunctions = function() {
		var that=this;
                for ( var i = 0; i < this.callbackFunctions.length; i++) {
                        this.callbackFunctions[i].call(that);
                }
        }


	// Methods
	/**
	set or get latitude
	*/
	this.lat = function(lat) {
		if (typeof(lat) == "number") {
			this.latitude = lat;
			this._executeCallbackFunctions();
		}
		if (typeof(lat) == "string") {
			this.latitude = parseFloat(lat);
			this._executeCallbackFunctions();
		}
		return this.latitude;
	}
	/**
	set or get longitude
	*/
	this.lng = function(lng) {
		if (typeof(lng) == "number") {
			this.longitude = lng;
			this._executeCallbackFunctions();
		}
		if (typeof(lng) == "string") {
			this.longitude = parseFloat(lng);
			this._executeCallbackFunctions();
		}
		return this.longitude;
	}
	
	/**
	 * Position comparison.
	*/
	this.equals = function(other) {   //only same coordinates, not same point
		if(null==other) return false;
		
		if(!(other instanceof khtml.maplib.LatLng)) {
			khtml.maplib.base.Log.warn('Point.equals(): Error - illegal argument!', other);
			return false;
		}
		
		return (other.lat() === this.lat() && other.lng() === this.lng());
	}

	/**
	// Constructor
	*/
	if(lat instanceof khtml.maplib.geometry.LatLng) {	// ewi: changed khtml.maplib.LatLng to khtml.maplib.geometry.LatLng
		// Copy constructor
		this.lat(lat.lat());
		this.lng(lat.lng());
	} else if (typeof(lat) == "object") {
		// Input as object with named values {lat: 40.1, lng: 5.676}
		if(lat.lat) {
			this.lat(lat.lat);
		}
		if(lat.lng) {
			this.lng(lat.lng);
		}
	} else {
		// Default
		this.lat(lat);
		this.lng(lng);
	}


}
