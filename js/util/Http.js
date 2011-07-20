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
 * HTTP Ajax Helper.
 *
 * @requires jQuery
 * @class
*/
khtml.maplib.util.Http = function() {
	/**
	 * Load data from the server using a HTTP GET request.
	 *
	 * @see http://api.jquery.com/jQuery.get/
	 * @param {String}	url	A string containing the URL to which the request is sent.
	 * @param {Object/String} data	An object or string that is sent to the server with the request.
	 * @param {function} successHandler successHandler(data, textStatus, jqXHR) - A callback function that is executed if the request succeeds.
	 * @param {String} dataType	The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
	*/
	this._get = function(url, data, successHandler, dataType) {
		try {
			return jQuery.get(url,data,successHandler,dataType);
		} catch(e) {
			khtml.maplib.base.Log.warn("Exception occured! Did you include the jQuery library?");
			khtml.maplib.base.Log.exception(e);
		}
	};
	
	/**
	 * Decorates {khtml.maplib.util.Http._get} with a method that writes a log entry if the request failes.
	 *
	 * @see _get
	 * @see http://api.jquery.com/jQuery.get/
	 * @param {String}	url	A string containing the URL to which the request is sent.
	 * @param {Object/String} data	An object or string that is sent to the server with the request.
	 * @param {function} successHandler successHandler(data, textStatus, jqXHR) - A callback function that is executed if the request succeeds.
	 * @param {String} dataType	The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
	*/
	this.get = function(url, data, successHandler, dataType) {
		var jqxhr = this._get(url, data, successHandler, dataType)
	  		.error(function(data) { khtml.maplib.base.Log.error("khtml.maplib.util.Http.get(): request failed!", data) });
	
		return jqxhr;
	};	
};