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
 * WMS Overlay.
 *
 * Overlay the map with a layer from a wms server.
 * Only WGS84 (EPSG:4326) is supported.
 * WMS URL's are required to include '&SRS=EPGSG:4326'.
 *
 * WMS Specification: http://www.opengeospatial.org/standards/wms
 *
 * Example:
	<pre>
	var wms = new khtml.maplib.overlay.WMS(
		{
			opacity: 0.6, 
			url: 'http://wms.geo.admin.ch/',
			parameters: {'FORMAT':'image/png', 'STYLES': 'default'},
			layers: ['xyz','abc']
		}
	);
	map.addOverlay(wms);
	</pre>
 *
 * @param {Object} options Properties: 'url' => url to wms server, use as <img src="url">. The following parameters are appended to the url: '&BBOX=...&WIDTH=...&HEIGHT=...&xyz=...'. 'opacity' => transparency of image where 0 is fully transparent and 1 is not transparent. 'class' => class is used for the image tag.
 * @class
* Examples:
<a href="../../../examples/overlay/wms/wms1.html">wms1</a>,
<a href="../../../examples/overlay/wms/wms2.html">wms2</a>,
<a href="../../../examples/overlay/wms/wms3.html">wms3</a>,
<a href="../../../examples/overlay/wms/wms4.html">wms4</a>,
<a href="../../../examples/overlay/wms/wms5.html">wms5</a>,
<a href="../../../examples/overlay/wms/wms6.html">wms6</a>,
<a href="../../../examples/overlay/wms/wms7.html">wms7</a>,
*/
khtml.maplib.overlay.WMS = function(options) {	
	this.type="Feature";
	this.geometry=new Object;
	this.geometry.type="WMS";
	this.options=options;
	this.delayTimeout=null;
	this.init=function(owner){
		this.owner=owner;
		if(this.owner.map instanceof khtml.maplib.Map){
			this.map=this.owner.map;
		}else{
			this.map=owner;
		}
		this.img=document.createElement("img");
		this.div=document.createElement("div");
		this.div.style.opacity=0.6;
		var p=this.map.bounds().getCenter();
		var delta={dx:-this.map.size.width/2,dy:-this.map.size.height/2};
		var dx=-this.map.size.width/2;
		var dy=-this.map.size.height/2;
		this.div.appendChild(this.img);
		this.img.style.position="absolute";
		this.img.style.top=dy+"px";
		this.img.style.left=dx+"px";
		this.marker=new khtml.maplib.overlay.Marker(p,this.div);
		this.map.featureCollection.appendChild(this.marker);
	}
	this.oldZoom=0;
	this.clear=function(){
		that.marker.style.display="none";
		that.map.featureCollection.removeChild(that.marker);
	}
	this.render=function(){
		if(!map.finalDraw){
			if(this.oldZoom!=this.map.zoom()){
				this.marker.style.display="none";
			}
			this.oldZoom=this.map.zoom()	
			return;
		}
		var p=this.map.bounds().getCenter();
		this.marker.geometry.coordinates=p;
		var s=this.map.bounds().sw().lat();
		var n=this.map.bounds().ne().lat();
		var w=this.map.bounds().sw().lng();
		var e=this.map.bounds().ne().lng();
		var width=this.map.size.width;
		var height=this.map.size.height;
		//var url="http://geometa.hsr.ch/geoserver/wms?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.0&FORMAT=image/png&SRS=EPSG%3A4326&TILED=false&LAYERS=osm&BBOX=8.690761835853209,47.18459204613506,8.862423212806334,47.25454651402847&WIDTH=500&HEIGHT=300";
		//var url="http://geometa.hsr.ch/geoserver/wms?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.0&FORMAT=image/png&SRS=EPSG%3A4326&TILED=false&LAYERS=osm&BBOX="+w+","+s+","+e+","+n+"&WIDTH="+width+"&HEIGHT="+height;
		var layers="";
		for(var l in this.options.layers){
			var layer=this.options.layers[l];
			layers+=layer+",";
		}
		layers=layers.substring(0,layers.length -1);
		if(this.options.parameters.FORMAT){
			var format=this.options.parameters.FORMAT;
		}else{
			var format="image/png";
		}
		var url=this.options.url+"?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.0&FORMAT="+format+"&SRS=EPSG%3A4326&TILED=false&LAYERS="+layers+"&BBOX="+w+","+s+","+e+","+n+"&WIDTH="+width+"&HEIGHT="+height;
		this.img.setAttribute("src",url);	
		this.img.style.display="none";
		khtml.maplib.base.helpers.eventAttach(this.img, "load", this._imgLoaded, this.marker, false);		
	}
	var that=this;
	this._imgLoaded=function(){
		this.render();
		this.marker.style.display="";
		that.img.style.display="";
	}
}
