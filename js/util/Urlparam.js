// --------------------------------------------------------------------------------------------
// khtml javascript library
// --------------------------------------------------------------------------------------------
// (C) Copyright 2011 by Ewald Wieser
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
 * URL Parameter Helper.
 *
 * understands following GET-parameters:<br/>
 * lat: Latitude for map-center<br/>
 * lon: Longitude for map-center<br/>
 * zoom: Zoom-level<br/>
 * mlat: Latitude to place marker<br/>
 * mlon: Longitude to place marker<br/>
 
 * @example
 <pre><code>map with center and zoomlevel via urlparam:
 .../map.html?lat=48&lon=14&zoom=9
 
map with center/zoomlevel and marker via urlparam:
 .../map.html?lat=48&lon=14&zoom=9&mlat=48&mlon=14
 </code></pre>
 * @see Example with Lat/Lng and Zoom via Urlparam: <a href="../../../examples/util/urlparam.html?lat=48&lon=14&zoom=9">urlparam.html?lat=48&lon=14&zoom=9</a>
 * @see Example with Marker: <a href="../../../examples/util/urlparam.html?lat=48&lon=14&zoom=9&mlat=48&mlon=14">urlparam.html?lat=48&lon=14&zoom=9&mlat=48&mlon=14</a>
 *
 * @class
 * @param {khtml.maplib.map} map to apply parameters on
*/

khtml.maplib.util.Urlparam = function(map) {


	// Funktion von http://www.tutorials.de/javascript-ajax/285141-get-parameter-per-javascript-abfragen.html
	HTTP_GET_VARS=new Array();
	strGET=document.location.search.substr(1,document.location.search.length);
	if(strGET!='')
	{
		gArr=strGET.split('&');
		for(i=0;i<gArr.length;++i)
			{
			v='';vArr=gArr[i].split('=');
			if(vArr.length>1){v=vArr[1];}
			HTTP_GET_VARS[unescape(vArr[0])]=unescape(v);
			}
	}
	
	/**
	 * get a GET-parameter
	*/ 
	this.GET = function(v)
	{
		if(!HTTP_GET_VARS[v]){return 'undefined';}
		return HTTP_GET_VARS[v];
	}
	
	
	if((this.GET('lat') != 'undefined') &&
		(this.GET('lon') != 'undefined'))
		map.center(new khtml.maplib.LatLng(parseFloat(this.GET('lat')), parseFloat(this.GET('lon'))));
	
	if(this.GET('zoom') != 'undefined')
		map.zoom(parseFloat(this.GET('zoom')));
	
	if((this.GET('mlat') != 'undefined') &&
		(this.GET('mlon') != 'undefined'))
		var marker = new khtml.maplib.overlay.Marker({
			position: new khtml.maplib.LatLng(parseFloat(this.GET('mlat')), parseFloat(this.GET('mlon'))),
			map: map
		});
}