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
 * generates a InfoWindowOptions-object<br/>
 * options for a infowindow
 * @param {string} [content] Content to show in infowindow. Any string, may also contain HTML-tags.
 * @param {bool} [disableAutoPan]  not used yet, only for compatibility to Google Markers
 * @param {number} [maxWidth] not used yet, only for compatibility to Google Markers
 * @param [pixelOffset]  not used yet, only for compatibility to Google Markers
 * @param {khtml.maplib.LatLng} [position] LatLng where to place InfoWindow when it's not attached to an anchor
 * @param {number} [zIndex]  not used yet, only for compatibility to Google Markers
 * @class
*/
khtml.maplib.overlay.InfoWindowOptions = function(content, disableAutoPan, maxWidth, pixelOffset, position, zIndex){
	if (content) this.content = content;
	if (position) this.position = position;
}

/**
 * Generates an InfoWindow-object with the specified InfoWindowOptions.<br/>
 * Can be opened on any anchorObject, that exposes position and pixelOffset function.
 * 
   @example Minimum code to open an infowindow on a marker:
   <pre><code>
  var infowindow = new mr.overlay.InfoWindow({
  	content: 'Text in the InfoWindow'
  });
  
  marker.attachEvent( 'click', function() {
  	// Opening the InfoWindow
  	infowindow.open(map, this);
  }); 
  </code></pre>
 * @see Example (click on the marker): <a href="../../../examples/infowindow/infowindow.html">Infowindow</a>}
 * @class 
 * @param {khtml.maplib.overlay.InfoWindowOptions} InfoWindowOptions Options for InfoWindow
*/
khtml.maplib.overlay.InfoWindow = function(InfoWindowOptions) {
	
	// ---------------------
	// Constructor
	// ---------------------
	// create the infowindow
	
	this.infobox = document.createElement("div");
	this.infobox.style.position = "absolute";
	this.infobox.style.left = "-1000px";
		
	// HTML5-infobox
	//this.infobox.style.border = "1px solid grey";
	//this.infobox.style.backgroundColor = "white";
	//this.infobox.style.MozBorderRadius = "10px";
	//this.infobox.style.WebkitBorderRadius = "10px";
	//this.infobox.style.padding = "15px";
	
	//this.infobox.style.minWidth = "210px";
	//this.infobox.style.minHeight = "80px";
	//this.infobox.style.overflow = "visible";
	this.infobox.style.whiteSpace = "nowrap";
	
	// non-HTML5 infobox
	upperleftdiv = document.createElement('div');
	upperleftdiv.style.position = 'absolute';
	upperleftdiv.style.width = '10px';
	upperleftdiv.style.height = '10px';
	upperleftdiv.style.top = 0;
	upperleftdiv.style.left = 0;
	upperleftdiv.style.overflow = 'hidden';
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
		upperleftimg = document.createElement('div');
		upperleftimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + corner_image + "')";
		upperleftimg.style.width = "100%";
		upperleftimg.style.height = "100%";
	}
	else{
		upperleftimg = document.createElement('img');
		upperleftimg.setAttribute('src', corner_image);
	}
	upperleftimg.style.position = 'absolute';
	upperleftimg.style.top = 0;
	upperleftimg.style.left = 0;
	khtml.maplib.base.helpers.imageNotSelectable(upperleftimg);
	upperleftdiv.appendChild(upperleftimg);
	this.infobox.appendChild(upperleftdiv);
	
	this.upperdiv = document.createElement('div');
	this.upperdiv.style.position = 'absolute';
	this.upperdiv.style.height = '10px';
	this.upperdiv.style.left = '10px';
	this.upperdiv.style.top = 0;
	this.upperdiv.style.borderTop = '1px solid gray';
	this.upperdiv.style.backgroundColor = 'white';
	this.infobox.appendChild(this.upperdiv);
	
	upperrightdiv = document.createElement('div');
	upperrightdiv.style.position = 'absolute';
	upperrightdiv.style.width = '10px';
	upperrightdiv.style.height = '10px';
	upperrightdiv.style.top = 0;
	upperrightdiv.style.right = 0;
	upperrightdiv.style.overflow = 'hidden';
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
		upperrightimg = document.createElement('div');
		upperrightimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + corner_image + "')";
		upperrightimg.style.width = "100%";
		upperrightimg.style.height = "100%";
	}
	else{
		upperrightimg = document.createElement('img');
		upperrightimg.setAttribute('src', corner_image);
	}
	upperrightimg.style.position = 'absolute';
	upperrightimg.style.top = 0;
	upperrightimg.style.right = 0;
	khtml.maplib.base.helpers.imageNotSelectable(upperrightimg);
	upperrightdiv.appendChild(upperrightimg);
	this.infobox.appendChild(upperrightdiv);
	
	this.leftdiv = document.createElement('div');
	this.leftdiv.style.position = 'absolute';
	this.leftdiv.style.width = '10px';
	this.leftdiv.style.top = '10px';
	this.leftdiv.style.left = 0;
	this.leftdiv.style.borderLeft = '1px solid gray';
	this.leftdiv.style.backgroundColor = 'white';
	this.infobox.appendChild(this.leftdiv);
	
	lowerleftdiv = document.createElement('div');
	lowerleftdiv.style.position = 'absolute';
	lowerleftdiv.style.width = '10px';
	lowerleftdiv.style.height = '10px';
	lowerleftdiv.style.bottom = 0;
	lowerleftdiv.style.left = 0;
	lowerleftdiv.style.overflow = 'hidden';
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
		lowerleftimg = document.createElement('div');
		lowerleftimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + corner_image + "')";
		lowerleftimg.style.width = "100%";
		lowerleftimg.style.height = "100%";
	}
	else{
		lowerleftimg = document.createElement('img');
		lowerleftimg.setAttribute('src', corner_image);
	}
	lowerleftimg.style.position = 'absolute';
	lowerleftimg.style.bottom = 0;
	lowerleftimg.style.left = 0;
	khtml.maplib.base.helpers.imageNotSelectable(lowerleftimg);
	lowerleftdiv.appendChild(lowerleftimg);
	this.infobox.appendChild(lowerleftdiv);
	
	this.rightdiv = document.createElement('div');
	this.rightdiv.style.position = 'absolute';
	this.rightdiv.style.width = '10px';
	this.rightdiv.style.top = '10px';
	this.rightdiv.style.right = 0;
	this.rightdiv.style.borderRight = '1px solid gray';
	this.rightdiv.style.backgroundColor = 'white';
	this.infobox.appendChild(this.rightdiv);
	
	lowerrightdiv = document.createElement('div');
	lowerrightdiv.style.position = 'absolute';
	lowerrightdiv.style.width = '10px';
	lowerrightdiv.style.height = '10px';
	lowerrightdiv.style.bottom = 0;
	lowerrightdiv.style.right = 0;
	lowerrightdiv.style.overflow = 'hidden';
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
		lowerrightimg = document.createElement('div');
		lowerrightimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + corner_image + "')";
		lowerrightimg.style.width = "100%";
		lowerrightimg.style.height = "100%";
	}
	else{
		lowerrightimg = document.createElement('img');
		lowerrightimg.setAttribute('src', corner_image);
	}
	lowerrightimg.style.position = 'absolute';
	lowerrightimg.style.bottom = 0;
	lowerrightimg.style.right = 0;
	khtml.maplib.base.helpers.imageNotSelectable(lowerrightimg);
	lowerrightdiv.appendChild(lowerrightimg);
	this.infobox.appendChild(lowerrightdiv);
	
	this.lowerdiv = document.createElement('div');
	this.lowerdiv.style.position = 'absolute';
	this.lowerdiv.style.height = '10px';
	this.lowerdiv.style.left = '10px';
	this.lowerdiv.style.bottom = 0;
	this.lowerdiv.style.borderBottom = '1px solid gray';
	this.lowerdiv.style.backgroundColor = 'white';
	this.infobox.appendChild(this.lowerdiv);
	
	khtml.maplib.base.helpers.setCursor(this.infobox, "default");
	
	// content-div
	this.infobox.content = document.createElement("div");
	this.infobox.content.style.position = "absolute";
	this.infobox.content.style.backgroundColor = "white";
	if (InfoWindowOptions.content)
		this.infobox.content.innerHTML = InfoWindowOptions.content;	
	
	this.infobox.appendChild(this.infobox.content);
	
	// pointer that points from the infowindow to the anchorObject or position
	// consists of 10 seperate divs because of mousecursor
	this.infobox.pointer = document.createElement("div");
	this.infobox.pointer.style.position = "absolute";
	this.infobox.pointer.style.bottom = "0";
	this.infobox.pointer.style.left = "0";
	
	var steps = 10;
	for (var i = 0; i < steps; i++){
		el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.overflow = 'hidden';
		el.style.cursor = 'default';
		el.style.height = pointerheight/steps + 1 + 'px';			// +1 for consistant view on ipad
		el.style.width = pointerwidth/2+4 - pointerwidth/steps/2*i +2 + 'px';
		el.style.bottom = (-(i+1)*pointerheight/steps ) + 'px';
		el.style.left = pointerwidth/2-steps/2*i-(steps-i)/2 + 'px';
		if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
		&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
			var img = document.createElement('div');
			img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + pointer_image + "')";
			img.style.width = "100%";
			img.style.height = "100%";
		}
		else{
			var img = document.createElement('img');
			img.setAttribute('src', pointer_image);				// embedded image for pointer
		}
		img.style.cursor = 'default'; 
		img.style.position = 'absolute';
		img.style.top = (-i*pointerheight/steps) + 'px';
		img.style.left = (-pointerwidth/2+steps/2*i+(steps-i)/2) + 'px';
		img.style.zIndex = 0;
		khtml.maplib.base.helpers.imageNotSelectable(img);
		el.appendChild(img);
		this.infobox.pointer.appendChild(el);
	}
	this.infobox.appendChild(this.infobox.pointer);
	
	// cross in the upper right corner of the infowindow to close it
	// must be the last elemen in infobox that click eventhandler works
	this.closebutton = document.createElement("div");
	this.closebutton.style.position = "absolute";
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))){
		this.closebutton.style.height = "28px";			// bigger size fo closebutton on touch-devices
		this.closebutton.style.width = "28px";
		this.closebutton.style.top = "0px";
		this.closebutton.style.right = "0px";
	}
	else{
		this.closebutton.style.height = "10px";
		this.closebutton.style.width = "10px";
		this.closebutton.style.top = "4px";
		this.closebutton.style.right = "4px";
	}
	this.closebutton.style.padding = "0";
	this.closebutton.style.zIndex = "10000";
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
		el = document.createElement('div');
		el.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + close_image + "')";
		el.style.width = "100%";
		el.style.height = "100%";
	}
	else{
		el = document.createElement('img');
		el.setAttribute('src', close_image);				// embedded image for close button
	}
	el.style.opacity = 0.6; 
	el.style.cursor = 'pointer'; 
	el.style.position = 'absolute';
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))){
		el.style.width = '20px';				// bigger size fo closebutton on touch-devices
		el.style.height = '20px';
		el.style.top = '4px';
		el.style.right = '4px';
	}else{
		el.style.width = '10px';
		el.style.height = '10px';
		el.style.top = 0;
		el.style.right = 0;
	}
	khtml.maplib.base.helpers.imageNotSelectable(el);
	el.setAttribute('onmouseover', "javascript:this.style.opacity=\'1\'");
	el.setAttribute('onmouseout', "javascript:this.style.opacity=\'0.6\'");		// mousecursor -> pointer, hover function
	this.closebutton.appendChild(el);
	this.infobox.appendChild(this.closebutton);
	
	// attach eventhandler for close function
	khtml.maplib.base.helpers.eventAttach(this.closebutton, "click", function() { this.close(); }, this, false);
	
	// create shadow consisting of 9 divs
	shadow = {};
	this.shadow = document.createElement('div');
	this.shadow.style.position = "absolute";
	this.shadow.style.left = "-1000px";
	
	this.shadow.upperleftdiv = document.createElement('div');
	this.shadow.upperleftdiv.style.position = 'absolute';
	this.shadow.upperleftdiv.style.width = '30px';
	this.shadow.upperleftdiv.style.height = '20px';
	this.shadow.upperleftdiv.style.top = 0;
	this.shadow.upperleftdiv.style.overflow = 'hidden';
	shadow.upperleftimg = document.createElement('img');
	shadow.upperleftimg.style.position = 'absolute';
	shadow.upperleftimg.style.top = 0;
	shadow.upperleftimg.style.left = "-309px";
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7))
		shadow.upperleftimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + shadow_image + "')";
	else
		shadow.upperleftimg.setAttribute('src', shadow_image);
	khtml.maplib.base.helpers.imageNotSelectable(shadow.upperleftimg);
	this.shadow.upperleftdiv.appendChild(shadow.upperleftimg);
	this.shadow.appendChild(this.shadow.upperleftdiv);
	
	this.shadow.upperrightdiv = document.createElement('div');
	this.shadow.upperrightdiv.style.position = 'absolute';
	this.shadow.upperrightdiv.style.width = '30px';
	this.shadow.upperrightdiv.style.height = '20px';
	this.shadow.upperrightdiv.style.top = 0;
	this.shadow.upperrightdiv.style.right = 0;
	this.shadow.upperrightdiv.style.overflow = 'hidden';
	shadow.upperrightimg = document.createElement('img');
	shadow.upperrightimg.style.position = 'absolute';
	shadow.upperrightimg.style.top = 0;
	shadow.upperrightimg.style.right = 0;
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7))
		shadow.upperrightimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + shadow_image + "')";
	else
		shadow.upperrightimg.setAttribute('src', shadow_image);
	khtml.maplib.base.helpers.imageNotSelectable(shadow.upperrightimg);
	this.shadow.upperrightdiv.appendChild(shadow.upperrightimg);
	this.shadow.appendChild(this.shadow.upperrightdiv);
	
	this.shadow.upperdiv = document.createElement('div');
	this.shadow.upperdiv.style.position = 'absolute';
	this.shadow.upperdiv.style.height = this.shadow.upperrightdiv.style.height;
	//this.shadow.upperdiv.style.right = this.shadow.upperrightdiv.style.width;
	this.shadow.upperdiv.style.top = this.shadow.upperleftdiv.style.top;
	this.shadow.upperdiv.style.overflow = "hidden";
	shadow.upperimg = document.createElement("img");
	shadow.upperimg.style.position = "absolute";
	shadow.upperimg.style.top = 0;
	shadow.upperimg.style.right = "-" + this.shadow.upperrightdiv.style.width;
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7))
		shadow.upperimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + shadow_image + "')";
	else
		shadow.upperimg.setAttribute("src", shadow_image);
	khtml.maplib.base.helpers.imageNotSelectable(shadow.upperimg);
	this.shadow.upperdiv.appendChild(shadow.upperimg);
	this.shadow.appendChild(this.shadow.upperdiv);
	
	this.shadow.lowerleftdiv = document.createElement('div');
	this.shadow.lowerleftdiv.style.position = 'absolute';
	this.shadow.lowerleftdiv.style.height = '54px';
	this.shadow.lowerleftdiv.style.bottom = 0;
	this.shadow.lowerleftdiv.style.left = 0;
	this.shadow.lowerleftdiv.style.overflow = 'hidden';
	shadow.lowerleftimg = document.createElement('img');
	shadow.lowerleftimg.style.position = 'absolute';
	shadow.lowerleftimg.style.bottom = 0;
	shadow.lowerleftimg.style.left = 0;
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7))
		shadow.lowerleftimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + shadow_image + "')";
	else
		shadow.lowerleftimg.setAttribute('src', shadow_image);
	khtml.maplib.base.helpers.imageNotSelectable(shadow.lowerleftimg);
	this.shadow.lowerleftdiv.appendChild(shadow.lowerleftimg);
	this.shadow.appendChild(this.shadow.lowerleftdiv);
	
	this.shadow.lowerrightdiv = document.createElement('div');
	this.shadow.lowerrightdiv.style.position = 'absolute';
	this.shadow.lowerrightdiv.style.height = '54px';
	this.shadow.lowerrightdiv.style.bottom = 0;
	this.shadow.lowerrightdiv.style.overflow = 'hidden';
	shadow.lowerrightimg = document.createElement('img');
	shadow.lowerrightimg.style.position = 'absolute';
	shadow.lowerrightimg.style.bottom = 0;
	shadow.lowerrightimg.style.right = "-300px";
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7))
		shadow.lowerrightimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + shadow_image + "')";
	else
		shadow.lowerrightimg.setAttribute('src', shadow_image);
	khtml.maplib.base.helpers.imageNotSelectable(shadow.lowerrightimg);
	this.shadow.lowerrightdiv.appendChild(shadow.lowerrightimg);
	this.shadow.appendChild(this.shadow.lowerrightdiv);
	
	this.shadow.rightdiv = document.createElement("div");
	this.shadow.rightdiv.style.position = "absolute";
	this.shadow.rightdiv.style.top = this.shadow.upperrightdiv.style.height;
	//this.shadow.rightdiv.style.bottom = this.shadow.lowerrightdiv.style.height;
	this.shadow.rightdiv.style.right = 0;
	this.shadow.rightdiv.style.overflow = "hidden";
	shadow.rightimg = document.createElement("img");
	shadow.rightimg.style.position = "absolute";
	shadow.rightimg.style.top = "-" + this.shadow.upperrightdiv.style.height;
	shadow.rightimg.style.right = 0;
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7))
		shadow.rightimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + shadow_image + "')";
	else
		shadow.rightimg.setAttribute("src", shadow_image);
	khtml.maplib.base.helpers.imageNotSelectable(shadow.rightimg);
	this.shadow.rightdiv.appendChild(shadow.rightimg);
	this.shadow.appendChild(this.shadow.rightdiv);	
	
	this.shadow.leftdiv = document.createElement("div");
	this.shadow.leftdiv.style.position = "absolute";
	this.shadow.leftdiv.style.top = this.shadow.upperleftdiv.style.height;
	//this.shadow.leftdiv.style.bottom = this.shadow.lowerleftdiv.style.height;
	this.shadow.leftdiv.style.left = 0;
	this.shadow.leftdiv.style.overflow = "hidden";
	shadow.leftimg = document.createElement("img");
	shadow.leftimg.style.position = "absolute";
	shadow.leftimg.style.bottom = "-" + this.shadow.lowerleftdiv.style.height;
	shadow.leftimg.style.left = 0;
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7))
		shadow.leftimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + shadow_image + "')";
	else
		shadow.leftimg.setAttribute("src", shadow_image);
	khtml.maplib.base.helpers.imageNotSelectable(shadow.leftimg);
	this.shadow.leftdiv.appendChild(shadow.leftimg);
	this.shadow.appendChild(this.shadow.leftdiv);
	
	this.shadow.middlediv = document.createElement("div");
	this.shadow.middlediv.style.position = "absolute";
	this.shadow.middlediv.style.top = this.shadow.upperleftdiv.style.height;
	//this.shadow.middlediv.style.bottom = this.shadow.lowerrightdiv.style.height;
	this.shadow.middlediv.style.overflow = "hidden";
	shadow.middleimg = document.createElement("img");
	shadow.middleimg.style.position = "absolute";
	shadow.middleimg.style.top = "-" + this.shadow.upperleftdiv.style.height;
	shadow.middleimg.style.left = parseInt(shadow.upperleftimg.style.left) - parseInt(this.shadow.upperleftdiv.style.height) + "px";
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7))
		shadow.middleimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + shadow_image + "')";
	else
		shadow.middleimg.setAttribute("src", shadow_image);
	khtml.maplib.base.helpers.imageNotSelectable(shadow.middleimg);
	this.shadow.middlediv.appendChild(shadow.middleimg);
	this.shadow.appendChild(this.shadow.middlediv);
	
	this.shadow.pointer = document.createElement("div");
	this.shadow.pointer.style.position = "absolute";
	this.shadow.pointer.style.overflow = "hidden";
	this.shadow.pointer.style.width = "140px";
	this.shadow.pointer.style.height = "54px";
	this.shadow.pointer.style.bottom = 0;
	shadow.pointerimg = document.createElement('img');
	shadow.pointerimg.style.position = 'absolute';
	shadow.pointerimg.style.bottom = 0;
	shadow.pointerimg.style.left = "-255px";
	if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support transparent PNGs
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7))
		shadow.pointerimg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + shadow_image + "')";
	else
		shadow.pointerimg.setAttribute('src', shadow_image);
	khtml.maplib.base.helpers.imageNotSelectable(shadow.pointerimg);
	this.shadow.pointer.appendChild(shadow.pointerimg);
	this.shadow.appendChild(this.shadow.pointer);
	
	
	
	/**
	 * Render infowindow, pointer and shadow. Automatically called by the map.
	*/
	this.render = function() {
		// attach infobox to anchorObject
		// must provide position property (lat/lng)
		// can provide pixelOffset from position (x,y)
		if(typeof(this.anchorObject) == "object"){
			this.xy = this.mapObj.latlngToXY(this.anchorObject.getPosition());		// position of the AnchorObject
			if (this.anchorObject.pixelOffset)
				this.offset = this.anchorObject.pixelOffset();						// pixelOffset from the position to the pointer of the infobox
			else
				this.offset = { x:0, y:0};
		}
		// no anchorObject
		else {
			if (InfoWindowOptions){
				// position provided
				if (InfoWindowOptions.position)
					this.xy = this.mapObj.latlngToXY(InfoWindowOptions.position);		// point to position
				// no position
				else{
					this.xy = this.mapObj.latlngToXY(this.mapObj.getCenter());	// point to center of map
				}
				
				// pixelOffset provided	
				if (InfoWindowOptions.pixelOffset){
					if (InfoWindowOptions.pixelOffset.x)
						this.offset["x"] = InfoWindowOptions.pixelOffset.x;		// x-Offset
					else
						this.offset["x"] = 0;
					if (InfoWindowOptions.pixelOffset.y)
						this.offset["y"] = InfoWindowOptions.pixelOffset.y;		// y-Offset
					else
						this.offset["y"] = 0;
				}
				// no pixelOffset
				else
					this.offset = { x:0, y:0};	// offset = 0
			}
			// no InfoWindowOptions provided
			else
				this.xy = this.mapObj.latlngToXY(this.mapObj.getCenter());	// point to center of map
		}
		
		this.infobox.style.left = (this.xy["x"] + this.offset["x"] - ((parseInt(this.infobox.style.width) - pointerwidth)/2))  + "px";
		this.infobox.style.bottom =  (-this.xy["y"] + this.offset["y"] + pointerheight -1)  + "px";
		this.infobox.style.zIndex = parseInt(this.xy["y"]) + this.mapObj.size.height;
		
		this.shadow.style.left = parseInt(this.infobox.style.left) + pointerheight/2 + "px";
		this.shadow.style.bottom = parseInt(this.infobox.style.bottom) - pointerheight + "px";
		this.shadow.style.zIndex = parseInt(this.xy["y"]);
		
		// move map when opening infobox thats outside
		if (this.opened)
			this._moveMap();
	}
	
	
	
	/**
	 * Open the infowindow on the map at an anchorObject. The infowindow is moved with the anchorObject.
	 The anchorObject is not necessarily needed. The infowindow can also be positioned via the position property in the InfoWindowOptions.
	 * @param {khtml.maplib.Map} mapObj The map to open the infowindow in.
	 * @param {Object} [anchorObject] A object of the map that provides a getPosition()-method.
	*/
	this.open = function(mapObj, anchorObject) {
		this.mapObj = mapObj;
		this.anchorObject = anchorObject;
		
		// create seperate div for shadows, if not existing
		if(!this.mapObj.overlayDiv.infoboxShadowDiv){
			this.mapObj.overlayDiv.infoboxShadowDiv = document.createElement("div")
			this.mapObj.overlayDiv.appendChild(this.mapObj.overlayDiv.infoboxShadowDiv);
			this.mapObj.overlayDiv.infoboxShadowDiv.setAttribute("id", "infoboxShadowDiv");
		}
		
		// remove shadow if already appended
		if(this.shadow.parentNode){
			this.shadow.parentNode.removeChild(this.shadow);
		}
			
		// append shadow
        this.mapObj.overlayDiv.infoboxShadowDiv.appendChild(this.shadow);
		
		// create seperate div for infoboxes, if not existing
		if(!this.mapObj.overlayDiv.infoboxDiv){
			this.mapObj.overlayDiv.infoboxDiv = document.createElement("div")
			this.mapObj.overlayDiv.appendChild(this.mapObj.overlayDiv.infoboxDiv);
			this.mapObj.overlayDiv.infoboxDiv.setAttribute("id", "infoboxDiv");
		}
		
		// remove infobox if already appended
		if(this.infobox.parentNode){
			this.infobox.parentNode.removeChild(this.infobox);
		}
			
		// append infobox
        this.mapObj.overlayDiv.infoboxDiv.appendChild(this.infobox);
		this.opened = true;
		this.mapObj.addOverlay(this);
		
		//alert(this.infobox.content.offsetWidth + " " + this.infobox.content.offsetHeight);
		
		// adjust infobox-width according to content
		if (parseInt(this.infobox.content.offsetWidth) > (270 - 20)){	// larger than minWidth
			this.infobox.style.width = parseInt(this.infobox.content.offsetWidth) + 20 + "px";
		}
		else
			this.infobox.style.width = "270px";
		if (parseInt(this.infobox.content.offsetWidth) > (parseInt(this.mapObj.size.width) - 40)){	// larger than map
			this.infobox.style.width = parseInt(this.mapObj.size.width) - 20 + "px";	// fixed distance of 10px left an right to mapedge
			this.infobox.style.whiteSpace = "normal";
		}
		if (parseInt(this.infobox.content.offsetWidth) > 640){	// maximum width of 640px
			this.infobox.style.width = 640 + 20 + "px";
			this.infobox.style.whiteSpace = "normal";
		}
		
		this.infobox.content.style.left = "10px";
		this.infobox.content.style.width = parseInt(this.infobox.style.width) - 20 + "px";
		
		// adjust infobox-height according to content
		if (parseInt(this.infobox.content.offsetHeight) > (80 - 20)){	// larger than minHeight
			this.infobox.style.height = parseInt(this.infobox.content.offsetHeight) + 20 + "px";
		}
		else
			this.infobox.style.height = "80px";
		if (parseInt(this.infobox.content.offsetHeight) > (parseInt(this.mapObj.size.height) - 40 - pointerheight - this.offset["y"])){	// larger than map
			this.infobox.style.height = this.mapObj.size.height - pointerheight - this.offset["y"] - 20 + "px";	// fixed distance of 10px top and bottom to mapedge
			this.infobox.content.style.overflowY = "scroll";
			// allow scrolling in infowindow-content in ios5
			this.infobox.content.style.overflow = "auto";
			this.infobox.content.style.WebkitOverflowScrolling = "touch";
		}
		
		// todo: infobox needs to be resized when images in content are fully loaded
		
		this.upperdiv.style.width = parseInt(this.infobox.style.width) - 20 + "px";
		this.leftdiv.style.height = parseInt(this.infobox.style.height) - 20 + "px";
		this.rightdiv.style.height = parseInt(this.infobox.style.height) - 20 + "px";
		this.lowerdiv.style.width = parseInt(this.infobox.style.width) - 20 + "px";
		
		this.infobox.content.style.top = "10px";
		this.infobox.content.style.height =  parseInt(this.infobox.style.height) - 20 + "px";
		this.infobox.pointer.style.left = ((parseInt(this.infobox.style.width) - pointerwidth)/2)  + "px";
		
		// calculate shadow size
		this.shadow.style.width = parseInt(this.infobox.style.width) + Math.floor(parseInt(this.infobox.style.height)/2) + "px";
		this.shadow.style.height = Math.ceil(parseInt(this.infobox.style.height)/2) + pointerheight/2 + "px";
		this.shadow.pointer.style.left = parseInt(this.infobox.pointer.style.left) - pointerheight/2 + "px";
		this.shadow.lowerleftdiv.style.width = this.shadow.pointer.style.left;
		this.shadow.upperleftdiv.style.left = Math.floor(parseInt(this.infobox.style.height)/2) - (parseInt(this.shadow.lowerrightdiv.style.height) - pointerheight/2) - 9 + "px";
		this.shadow.lowerrightdiv.style.left = parseInt(this.shadow.pointer.style.left) + parseInt(this.shadow.pointer.style.width) + "px";
		this.shadow.lowerrightdiv.style.width =  parseInt(this.shadow.style.width) - parseInt(this.shadow.pointer.style.left) - parseInt(this.shadow.pointer.style.width) - parseInt(this.shadow.upperleftdiv.style.left)  + 9 + "px";
		
		this.shadow.upperdiv.style.left = parseInt(this.shadow.upperleftdiv.style.left) + parseInt(this.shadow.upperleftdiv.style.width) + "px";
		this.shadow.upperdiv.style.width = parseInt(this.shadow.style.width) - parseInt(this.shadow.upperleftdiv.style.left) - parseInt(this.shadow.upperleftdiv.style.width) - parseInt(this.shadow.upperrightdiv.style.width) + "px";
		
		this.shadow.rightdiv.style.width = Math.floor(parseInt(this.infobox.style.height)/2)  + "px";
		this.shadow.rightdiv.style.height = parseInt(this.shadow.style.height) - 74 + "px";
		this.shadow.leftdiv.style.width = Math.floor(parseInt(this.infobox.style.height)/2) + "px";
		this.shadow.leftdiv.style.height = parseInt(this.shadow.style.height) - 74 + "px";
		this.shadow.middlediv.style.left = this.shadow.leftdiv.style.width;
		this.shadow.middlediv.style.width = parseInt(this.shadow.style.width) - parseInt(this.shadow.leftdiv.style.width) - parseInt(this.shadow.rightdiv.style.width) + "px";
		this.shadow.middlediv.style.height = parseInt(this.shadow.style.height) - parseInt(this.shadow.upperdiv.style.height) - parseInt(this.shadow.lowerleftdiv.style.height) + "px";
		
		//suppress zooming map when scrolling with mousewheel in content-area
		khtml.maplib.base.helpers.eventAttach(this.infobox, "DOMMouseScroll", khtml.maplib.base.helpers.cancelEvent, this, false);
		//suppress doubleclick zoom in on infobox
		khtml.maplib.base.helpers.eventAttach(this.infobox, "dblclick", khtml.maplib.base.helpers.cancelEvent, this, false);
		//suppress moving map when clicking and dragging in content-area
		khtml.maplib.base.helpers.eventAttach(this.infobox.content, "mousedown", khtml.maplib.base.helpers.cancelEvent, this, false);
		//suppress moving map when clicking and dragging in content-area to allow touch-scrolling
		khtml.maplib.base.helpers.eventAttach(this.infobox.content, "touchstart", khtml.maplib.base.helpers.cancelEvent, this, false);
		khtml.maplib.base.helpers.eventAttach(this.infobox.content, "touchmove", khtml.maplib.base.helpers.cancelEvent, this, false);

		//suppress moving map and dragging images when clicking and dragging on the rest of the infobox
		khtml.maplib.base.helpers.eventAttach(this.infobox, "mousedown", function(evt){ khtml.maplib.base.helpers.stopEventPropagation(evt); khtml.maplib.base.helpers.cancelEvent(evt);}, this, false);
		//suppress propagation to allow rightclick in contentarea
		khtml.maplib.base.helpers.eventAttach(this.infobox.content, "contextmenu", khtml.maplib.base.helpers.cancelEvent, this, false);
		
		// todo:scrolling in content on touch-device, suppress moving map on infobox
	
		// add callback to anchorpoint to move infowindow when moving anchorpoint
		if (this.anchorObject){
			var that = this;
			this.anchorObject.position.addCallbackFunction( function() {
				that.render();
			});
		}
	}
	
	
	/**
	 * Remove the infowindow from the map. Infowindow still exists, will still be rendered.
	*/
    this.clear=function(){
		if(this.infobox){
			if(this.infobox.parentNode){
				try{
					this.infobox.parentNode.removeChild(this.infobox);
				}catch(e){}
			}
        }
		if(this.shadow){
			if(this.shadow.parentNode){
				try{
					this.shadow.parentNode.removeChild(this.shadow);
				}catch(e){}
			}
        }
		this.opened = false;
	}
	
	
	/**
	 * Closes the infowindow. Will not be rendered any more.
	*/
	this.close = function() {
		this.mapObj.removeOverlay(this);	
	}

	
	/**
	 * Set the content for the infowindow.
	 * @param {String} content Any string, may also contain HTML-tags.
	*/
	this.setContent = function(content) {
		this.infobox.content.innerHTML = content;
	}
	
	
	var mapMoveSpeedX = 1;
	var mapMoveSpeedY = 1;
	var mapMoveMaxSpeed = 20;
	/**
	 * move map when opening infobox thats outside
	*/ 
	this._moveMap=function(){
		var that = this;
		// move left
		if ((this.infobox.offsetLeft + parseInt(this.infobox.style.width)) > (this.mapObj.size.width-10)){
			if ((this.infobox.offsetLeft + parseInt(this.infobox.style.width)) < this.mapObj.size.width) mapMoveSpeedX = 10 - (this.mapObj.size.width - (this.infobox.offsetLeft + parseInt(this.infobox.style.width)));
			else if (mapMoveSpeedX < mapMoveMaxSpeed) mapMoveSpeedX++;
			// move left down
			if (this.infobox.offsetTop < 10){
				if (this.infobox.offsetTop > 0) mapMoveSpeedY = 10 - this.infobox.offsetTop;
				else if (mapMoveSpeedY < mapMoveMaxSpeed) mapMoveSpeedY++;
				window.clearInterval(this.mapmoveInterval);
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(-mapMoveSpeedX,mapMoveSpeedY);   
				} , 10);
			}
			// move left up
			else if(this.xy["y"] > (this.mapObj.size.height-10)){
				if (this.xy["y"] < this.mapObj.size.height) mapMoveSpeedY = 10 - (this.mapObj.size.height - this.xy["y"]);
				else if (mapMoveSpeedY < mapMoveMaxSpeed) mapMoveSpeedY++;
				window.clearInterval(this.mapmoveInterval);
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(-mapMoveSpeedX,-mapMoveSpeedY);  
				 } , 10);
			}
			// move left
			else{
				window.clearInterval(this.mapmoveInterval);
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(-mapMoveSpeedX,0);  
				} , 10);
			}
		}
		// move right
		else if (this.infobox.offsetLeft < 10){
			if (this.infobox.offsetLeft > 0) mapMoveSpeedX = 10 - this.infobox.offsetLeft;
			else if (mapMoveSpeedX < mapMoveMaxSpeed) mapMoveSpeedX++;
			// move right down
			if (this.infobox.offsetTop < 10){
				if (this.infobox.offsetTop > 0) mapMoveSpeedY = 10 - this.infobox.offsetTop;
				else if (mapMoveSpeedY < mapMoveMaxSpeed) mapMoveSpeedY++;
				window.clearInterval(this.mapmoveInterval);
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(mapMoveSpeedX,mapMoveSpeedY);  
				} , 10);
			}
			// move right up
			else if(this.xy["y"] > (this.mapObj.size.height-10)){
				if (this.xy["y"] < this.mapObj.size.height) mapMoveSpeedY = 10 - (this.mapObj.size.height - this.xy["y"]);
				else if (mapMoveSpeedY < mapMoveMaxSpeed) mapMoveSpeedY++;
				window.clearInterval(this.mapmoveInterval);
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(mapMoveSpeedX,-mapMoveSpeedY);  
				} , 10);
			}
			// move right
			else{
				window.clearInterval(this.mapmoveInterval);
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(mapMoveSpeedX,0);   
				} , 10);
			}
		}
		else{
			// move down
			if (this.infobox.offsetTop < 10){
				if (this.infobox.offsetTop > 0) mapMoveSpeedY = 10 - this.infobox.offsetTop;
				else if (mapMoveSpeedY < mapMoveMaxSpeed) mapMoveSpeedY++;
				window.clearInterval(this.mapmoveInterval);
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(0,mapMoveSpeedY);  
					//if (mapMoveSpeed< mapMoveMaxSpeed) mapMoveSpeed++;
				} , 10);
			}
			// move up
			else if(this.xy["y"] > (this.mapObj.size.height-10)){
				if (this.xy["y"] < this.mapObj.size.height) mapMoveSpeedY = 10 - (this.mapObj.size.height - this.xy["y"]);
				else if (mapMoveSpeedY < mapMoveMaxSpeed) mapMoveSpeedY++;
				window.clearInterval(this.mapmoveInterval);
				this.mapmoveInterval = window.setInterval(function(){
					that.mapObj.moveXY(0,-mapMoveSpeedY);  
				} , 10);
			}
			// stop moving
			else{
				window.clearInterval(this.mapmoveInterval);
				mapMoveSpeed = 1;
				this.opened = false;
			}
		}
	}
	
	
	
	/**
	 * workaround for detecting a click on touch devices
	 * original click event is suppressed by touchmove-handler of the map
	*/ 
	this._clickdetectstart = function(evt){
		if (evt.touches.length == 1) {
            this.clickDetectX = -1;
            this.clickDetectY = -1;		
		}
		//alert("start");
	}
	this._clickdetectmove = function(evt){
		if (evt.touches.length == 1) {
            this.clickDetectX = evt.touches[0].pageX;
            this.clickDetectY = evt.touches[0].pageY;		
		}
		//alert("move");
	}
	this._clickdetectstop = function(evt){
		if (evt.touches.length == 0) {
			if ((this.clickDetectX == -1) && (this.clickDetectY == -1)){
				this.close();
			}	
		}
		//alert("end");
	}
	
	// workaround for detecting a click on touch devices
	// original click event is suppressed by touchmove-handler of the map
	khtml.maplib.base.helpers.eventAttach(this.closebutton, "touchstart", this._clickdetectstart, this, false);
	khtml.maplib.base.helpers.eventAttach(this.closebutton, "touchmove", this._clickdetectmove, this, false);
	khtml.maplib.base.helpers.eventAttach(this.closebutton, "touchend", this._clickdetectstop, this, false);
}



// size of the pointer_image
var pointerwidth=90;
var pointerheight=70;


if ((navigator.userAgent.indexOf("MSIE") != -1)	// IE 6-7 do not support data-URI
	&& (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 7)){
	//if (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) <= 6){
		// todo: generate images with reduced colors for transparency in IE6
	//	var pointer_image = khtml.maplib.standardimagepath + './pointer_red.png';		// special images with reduced colors for transparency in IE6
	//}
	//else
	{
		var pointer_image = khtml.maplib.standardimagepath + './pointer_nor.png';		// normal images
		var corner_image = khtml.maplib.standardimagepath + './corners_nor.png';
		var shadow_image = khtml.maplib.standardimagepath + './shadow_nor.png';
		var close_image = khtml.maplib.standardimagepath + './close_nor.png';
	}
}else{ // others do support data-URI
// embedded image for pointer
var pointer_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABGCAYAAABMvIPiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNDgwMTE3NDA3MjA2ODExOERCQkRDOEYwREVGMEUzQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNzQ4NEUxRkMwQkMxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNzQ4NEUxRUMwQkMxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVBRjUzOEVGN0UyMDY4MTE4REJCREM4RjBERUYwRTNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA0ODAxMTc0MDcyMDY4MTE4REJCREM4RjBERUYwRTNBIi8+IDwvcmRmOkRlc2NyaXB0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';

// embedded image for infobox corners
var corner_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFREY1MzhFRjdFMjA2ODExOERCQkRDOEYwREVGMEUzQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMERGRjZBNEMwQkIxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMERGRjZBM0MwQkIxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkYxRjUzOEVGN0UyMDY4MTE4REJCREM4RjBERUYwRTNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVERjUzOEVGN0UyMDY4MTE4REJCREM4RjBERUYwRTNBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+qUowwgAAAgJJREFUeNqslF1kW2EYx5+T0y1ChIRxktGrfBDGOCE3vYhcHSmj7GpUu5vdjVHKbCRh097sYlezq+1mjUQJIzLKmJBQCSHycRESJRLCiIREpbL/E++ptouk69mfv/N4znl/53m/HikWi9ECWeFn8BNYhRWRP4NL8LHweTQavTZwbQHsBXygqqrD5/OR0+kkq9U6fzEYDNa73e56rVbbqlQqB0jtCfClpCsV3oc/A7QbCARIURRaplarRcVikQA/RJWv9bwcCoX0+EswGNyJRCKXFS2T3W4nt9tNk8lkI5FI3APnJ+dN+jRR2bamafQvMpvNFA6HGfwmHo9rOpDLecfTvIssFguJsR8AlRm4jcSDVWu2TLx5Ho/Hj1Bj4KbX6yWjEoxNBqp8NIxKMFSTLMvKbXZ1lWw2Gz8emiRJov8hwZFN0+n093g8NgwcjUb86PEannY6HcNAwThlYLrRaBgGCkaagUelUqlvpEqGNZvNGsITBvLk9/mi30XoQJRMJi8QvkKTuNDv8tdyufwpm83ScDi8NazX61Eul+PwLWAnN7vND0z7vFAobOBcyi6Xayksn89TKpUaoT++BOzjogbLZb+Hv2cymW/tdvuR3+8nh8Mx742z2WxeUb/fp3q9zuv2C98+B6y1qmNX4EC1Wt2CnyJ2w4/FD8swL35a+C/9EWAAn8a43yIKi2QAAAAASUVORK5CYII=';

var shadow_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA90AAAF0CAYAAAA+QlqJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTVGMzFDQzlDMEQ3MTFFMDhDNzNDM0Y5QTQ5QjQ1OTgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTVGMzFDQzhDMEQ3MTFFMDhDNzNDM0Y5QTQ5QjQ1OTgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDo1QUJFM0JCQjU5MjA2ODExOTEwOUY4MjY5NjY1RDIxRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QUJFM0JCQjU5MjA2ODExOTEwOUY4MjY5NjY1RDIxRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnYug9wAABhFSURBVHja7N2LUhs7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';

// embedded image for the close button
var close_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowOTgwMTE3NDA3MjA2ODExOERCQkRDOEYwREVGMEUzQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNzQ4NEUyM0MwQkMxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNzQ4NEUyMkMwQkMxMUUwOEM3M0MzRjlBNDlCNDU5OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA5ODAxMTc0MDcyMDY4MTE4REJCREM4RjBERUYwRTNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA5ODAxMTc0MDcyMDY4MTE4REJCREM4RjBERUYwRTNBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jr2YPQAAAUVJREFUeNpitLe3Z6AmYMIhzk+EXiFiDewF4pNALIHHMDkgPgPE0wgZ2AXERUCsDsQHcBgKMuwwECsCcSYQT8ZlYDsQlyLxYYZKI4kpQg2TQxLLAeIJ6AbCbEMHIEP3Qg1VwWIYDMRCzYAbeB+I3YD4Iw5Dj0ENk8Yi/xqInaFmoHj5FFTiI45wk8BhmAMQX8AVKWehhr4jItm8gBp2jVCyOYvHpXgNw5ewCYH/QPyd2IRtDI1ZfLlFEikt4jXQEmqYEBGulIOmU0VcBoIM247DZU+gMYov16AYCHLRLhyG3QFiC2gkvMAiLw01VAjZQFAyKcCi+CbUoKfQGMVl6CxYUkP28lwgTkHiX0MyDJsFMNAExWDAgmYTyFBmIM6HpsUXOFztDI08kPp6ZElGHCU2GxD/IqKAfUdswv5FRLLBmj0BAgwAom1FkjBGocAAAAAASUVORK5CYII=';
}