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
Internaly used helper functions.
*/

/** @namespace */
khtml.maplib.base.helpers = {};

/** @function */
khtml.maplib.base.helpers.parseXml = function(xmlString) {
	var xmlDoc;
	//for IE
	if (window.ActiveXObject)
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(xmlString);
	}
	//for Mozilla, Firefox, Opera, etc.
	else if (document.implementation && document.implementation.createDocument)
	{
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlString,"text/xml");

		/*
		// Check for parser error
		// https://developer.mozilla.org/en/DOMParser#Error_handling
		var parsererror = xmlDoc.getElementsByTagName("parsererror");
		if(parsererror.length > 0) {
			khtml.maplib.base.Log.warn('Parsing the XML Document failed!');
			khtml.maplib.base.Log.log(parsererror);
			xmlDoc = null;
		}
		*/
	}
	return xmlDoc;
}

/** @function */
khtml.maplib.base.helpers.contains = function(bounds1, bounds2) {
	// calculates if two areas are overlapping
	var rangeX = new Array(bounds1.sw().lat(), bounds1.ne().lat());
	var rangeY = new Array(bounds1.sw().lng(), bounds1.ne().lng());

	if( (
			khtml.maplib.base.helpers.between(rangeX, bounds2.sw().lat())
			|| khtml.maplib.base.helpers.between(rangeX, bounds2.ne().lat())
		) 
		&& (
			khtml.maplib.base.helpers.between(rangeY, bounds2.sw().lng()) 
			|| khtml.maplib.base.helpers.between(rangeY, bounds2.ne().lng()))
		) {
		// they overlap
		return true;
	} else {
		// no overlap
		return false;
	}
}

/** @function */
khtml.maplib.base.helpers.overlaps = function(bounds1, bounds2) {
	/*
	console.log(bounds1.sw().lng() > bounds2.ne().lng());
	console.log(bounds1.ne().lng() < bounds2.sw().lng());
	console.log(bounds1.sw().lat() > bounds2.ne().lat());
	console.log(bounds1.ne().lat() < bounds2.sw().lat());
	*/
	if (bounds1.sw().lng() > bounds2.ne().lng() || bounds1.ne().lng() < bounds2.sw().lng() ||
	    bounds1.sw().lat() > bounds2.ne().lat() || bounds1.ne().lat() < bounds2.sw().lat()) {
		return false;
	}else{
		return true;
	}

}


/*
khtml.maplib.base.helpers.overlaps = function(bounds1, bounds2) {
	console.log (bounds1.sw().lng() , bounds2.ne().lng() , bounds1.ne().lng() , bounds2.sw().lng() );
	if (bounds1.sw().lng() < bounds2.ne().lng() && bounds1.ne().lng() > bounds2.sw().lng() &&
	    bounds1.sw().lat() < bounds2.ne().lat() && bounds1.ne().lat() > bounds2.sw().lat()) {
		return true;
	}else{
		return false;
	}
}
*/
khtml.maplib.base.helpers.overlapsBuggy = function(bounds1, bounds2) {
	// calculates if two areas are overlapping
	var range1Y = new Array(bounds1.sw().lat(), bounds1.ne().lat());
	var range1X = new Array(bounds1.sw().lng(), bounds1.ne().lng());

	var range2Y = new Array(bounds2.sw().lat(), bounds2.ne().lat());
	var range2X = new Array(bounds2.sw().lng(), bounds2.ne().lng());
	if( ((
			khtml.maplib.base.helpers.between(range1Y, bounds2.sw().lat())
			|| khtml.maplib.base.helpers.between(range1Y, bounds2.ne().lat())
		) 
		&& (
			khtml.maplib.base.helpers.between(range1X, bounds2.sw().lng()) 
			|| khtml.maplib.base.helpers.between(range1X, bounds2.ne().lng())
		)) || ((
                        khtml.maplib.base.helpers.between(range2Y, bounds1.sw().lat())
                        || khtml.maplib.base.helpers.between(range2Y, bounds1.ne().lat())
                )
                && (
                        khtml.maplib.base.helpers.between(range2X, bounds1.sw().lng())
                        || khtml.maplib.base.helpers.between(range2X, bounds1.ne().lng())
                )))


	{
		// they overlap
		return true;
	} else {
		// no overlap
		return false;
	}
}

khtml.maplib.base.helpers.extendBBox=function(bbox,neu){
	if(bbox instanceof khtml.maplib.geometry.Bounds){
		//shon da
	}else{
		var ne=new khtml.maplib.geometry.LatLng(-90,-180);
		var sw=new khtml.maplib.geometry.LatLng(90,180);
		bbox=new khtml.maplib.geometry.Bounds(sw,ne);
	}
	if(!neu){
		return bbox;
	}
	if(neu instanceof khtml.maplib.geometry.LatLng){
		bbox=khtml.maplib.base.helpers.extendBBoxByPoint(bbox,neu);
	}else{
		
	//if(neu instanceof khtml.maplib.geometry.Bounds){
		
		bbox=khtml.maplib.base.helpers.extendBBoxByPoint(bbox,neu.sw());
		bbox=khtml.maplib.base.helpers.extendBBoxByPoint(bbox,neu.ne());
	}
	return bbox;
}

khtml.maplib.base.helpers.extendBBoxByPoint=function(bbox,neu){
	var west=bbox.sw().lng();
	var north=bbox.ne().lat();
	var south=bbox.sw().lat();
	var east=bbox.ne().lng();

	if(neu.lat() >north) north=neu.lat();	
	if(neu.lat() <south) south=neu.lat();	
	if(neu.lng() <west) west=neu.lng();	
	if(neu.lng() >east) east=neu.lng();	
	var sw=new khtml.maplib.geometry.LatLng(south,west);
	var ne=new khtml.maplib.geometry.LatLng(north,east);
	var bounds=new khtml.maplib.geometry.Bounds(sw,ne);
	return bounds;
}

/** @function */
khtml.maplib.base.helpers.between = function(testrange, number) {
	if(testrange[0] <= number && number <= testrange[1]) {
		return true;
	} else {
		return false;
	}
}
/**
 * http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
 * @function
*/ 
khtml.maplib.base.helpers.cloneObject = function(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object"){
            clone[i] = khtml.maplib.base.helpers.cloneObject(obj[i]);
        }else{
            clone[i] = obj[i];
	}
    }
    return clone;
}


// Rest of Code ist a Copy from
//http://hiveminds.org.hiveminds.co.uk/phpBB/viewtopic6b81.html?t=2930
//
// khtml.maplib.base.helpers.eventAttach is for events and OO Programing.
//
//

/***
 <member name="$a" type="global static method">
 <summary>Loops through each argument in the supplied argument object and puts it into an array.</summary>
 <param name="a">Argument object to loop through.</param>
 <returns>Array</returns>
 </member>
 ***/
/** @function */
khtml.maplib.base.helpers.convertObjectToArray = function(a) {
	var r = new Array();
	for ( var i = 0, l = a.length; i < l; i++) {
		r.push(a[i]);
	}
	return r;
}

/***
 <member name="khtml.maplib.base.helpers.eventAttach" type="static method">
 <summary>Attach an event listener to an object.</summary>
 <param name="o">Object whose event to attach.</param>
 <param name="t">Type of event.</param>
 <param name="f">Method to fire when event is raised.</param>
 <param name="fc">Context of called method f. Defaults to object o.</param>
 <param name="c">Use capture (not available in IE).</param>
 <param name="*">Arguments to pass to function f.</param>
 </member>
 ***/
/** @function */
khtml.maplib.base.helpers.eventAttach = function(o, t, f, fc, c) {
	var a = (arguments.length > 5 ? $a(arguments).slice(5, arguments.length)
			: new Array());
	var fn = function(e) {
		a.unshift(e || window.event);
		return f.apply((fc ? fc : o), a);
	}
	if (o.addEventListener) {
		if (navigator.appName.indexOf("Netscape") == -1) {
			if (t == "DOMMouseScroll") {
				t = "mousewheel";
			}
		}
		if (navigator.userAgent.indexOf("Safari") != -1) {
			if (t == "DOMMouseScroll") {
				o.onmousewheel = fn;
			} else {
				o.addEventListener(t, fn, c);
			}
		} else {
			o.addEventListener(t, fn, c);
		}
	} else {
		if (t == "DOMMouseScroll") {
			t="onmousewheel";
		}else{
			t="on"+t;
		}
		o.attachEvent(t, fn);
	}
	return{o:o,type:t,fn:fn,c:c}
};

khtml.maplib.base.helpers.eventRemove = function(ev) {
	if (ev.o.removeEventListener) {
		ev.o.removeEventListener(ev.type, ev.fn, ev.c);
	}
}

/**
 * Mix in methods.
 *
 * @function
 * @see http://michaux.ca/articles/transitioning-from-java-classes-to-javascript-prototypes
 * @param {Object} target
 * @param {Object} source
 * @param {String/Array} props leave empty to copy all methods, pass a string or array to explicitly specify which methods should be mixed in.
*/
khtml.maplib.base.helpers.mixin = function(target, source, props) {
    if (props) {
        if (props instanceof Array) {
            for (var i=0; i<props.length; i++) {
                target[props[i]] = source[props[i]];
            }
        } else if (source[props]) {
            target[props] = source[props];
        }
    } else {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    }
}

khtml.maplib.base.helpers.showOnMap = function(geometry, map) {
	var points = Array();
	if(geometry instanceof khtml.maplib.geometry.Bounds) {
		khtml.maplib.base.Log.log('Bounds');
		khtml.maplib.base.Log.log('Northwest / Topleft',geometry.nw());
		khtml.maplib.base.Log.log('Northeast / Topright',geometry.ne());
		khtml.maplib.base.Log.log('Southeast / Bottomright',geometry.se());
		khtml.maplib.base.Log.log('Southwest / Bottomleft',geometry.sw());
		points.push(geometry.nw());
		points.push(geometry.ne());
		points.push(geometry.se());
		points.push(geometry.sw());
	}
	for(var i = 0; i < points.length; i++) {
		var div = document.createElement('div');
		div.style.width = '1px';
		div.style.height = '1px';
		div.style.color = 'red';
		div.style['font-size'] = '2em';
		div.textContent = "X";
		
		var marker = new khtml.maplib.overlay.Marker(points[i], div);
		map.addOverlay(marker);
	}
}



/**
 * Cancels the event if it is cancelable, 
 * without stopping further propagation of the event.
*/
khtml.maplib.base.helpers.cancelEvent = function(evt) {
	evt.cancelBubble = true;
	if (evt.stopPropagation)
		evt.stopPropagation();
}
/**
 * Prevents further propagation of the current event.
*/
khtml.maplib.base.helpers.stopEventPropagation = function(evt) {
	if (evt.preventDefault) {
		evt.preventDefault(); // The W3C DOM way
	} else {
		evt.returnValue = false; // The IE way
	}		
}
/**
 * Is browser an internet explorer? (checks for string MSIE in useragent.)
*/
khtml.maplib.base.helpers.isIE = function() {
	return (navigator.userAgent.indexOf("MSIE") != -1);
}


/**
 * Browserindependent check on DOM element if ".parentNode" property is empty.
*/
khtml.maplib.base.helpers.isParentNodeEmpty = function(element) {
	if(khtml.maplib.base.helpers.isIE()) {
		return (element.parentNode.nodeValue==null);
	}
	return (!element.parentNode);
}

khtml.maplib.base.helpers.parseLine = function(pointArray) {
                if (pointArray) {
                        if (typeof (pointArray) == "string") {
				pointArray=khtml.maplib.base.helpers.parseLineString;	
                        }
                        if (typeof (pointArray) == "object") {
				if((typeof(pointArray[0])=="string") && (typeof(pointArray[1])=="string")){
					if(!isNaN(parseFloat(pointArray[0])) && !isNaN(parseFloat(pointArray[1]))&& pointArray.length==2){
						var lat=parseFloat(pointArray[1]);
						var lng=parseFloat(pointArray[0]);
						var p= khtml.maplib.LatLng(lat,lng);
						return p;
					}
				}
				if(typeof(pointArray[0])=="number"&&typeof(pointArray[0])=="number" && pointArray.length==2){
					pointArray=new khtml.maplib.LatLng(pointArray[0],pointArray[1]);
				}else{
					for(var p in pointArray){
						var point=pointArray[p];
						if(!(point instanceof khtml.maplib.geometry.LatLng)){
							var lat=point[1];
							var lng=point[0];
							if((typeof(lat)=="number") && typeof(lng)=="number" && point.length==2){
								pointArray[p]=new khtml.maplib.LatLng(lat,lng);
							}else{
								pointArray[p]=khtml.maplib.base.helpers.parseLine(pointArray[p]);
							}
						}
					}
				}
				var points = pointArray;
                        }
                } else {
                        var points = new Array();
                }
                return points;
}
khtml.maplib.base.helpers.parseLineString = function(pointArray) {
	if (typeof (pointArray) == "string") {
		points = new Array();
		var pa = pointArray.split(" ");
		for ( var i = 0; i < pa.length; i++) {
			var point = pa[i].split(",");
			if (point.length != 2)
				continue;
			point[0] = parseFloat(point[0]);
			point[1] = parseFloat(point[1]);
			points.push(new khtml.maplib.LatLng(point[0], point[1]));
		}
	}
	return points;

}

khtml.maplib.base.helpers.parseMultiLine = function(lineArray) {
                if (lineArray && (typeof (lineArray) == "object")) {
			for(var l in lineArray){
				var pointArray=lineArray[l];
				for(var p in pointArray){
					var point=pointArray[p];
					if(!(point instanceof khtml.maplib.geometry.LatLng)){
						var lat=point[0];
						var lng=point[1];
						if((typeof(lat)=="number") && typeof(lng)=="number"){
							pointArray[p]=new khtml.maplib.LatLng(lat,lng);
						}
					}
				}
				
			}
		} else {
                        lineArray = new Array();
                }
                return lineArray;
}
//should go to parser directory
//call it will 1 or 2 params, third param is used internaly
var stop=0;
khtml.maplib.base.helpers.stringify=function(obj,indent,force){
//	console.log(obj)
	var full=true;
	/*
	if(stop>3390)return;
	stop++
	*/
        var array=true;
        if(typeof(obj.push) == 'undefined'){
                array=false;
        }

        var space="";
        if(!indent){
                if(indent===false){
                        var newindent=false;
                }else{
                        var newindent=1;
                }
        }else{
                newindent=indent+1;
        }
        var space="";
        var smallspace="";
        for(var i=0;i<newindent -1;i++){
                smallspace+="   ";      
        }
        if(indent!==false){
                smallspace="\n"+smallspace;
                space=smallspace+"   ";
        }
        var string="";
        for(var o in obj){
		if(o=="owner")continue;
                if(typeof(obj[o])=="function"){
                        continue;
                }
                if(obj[o] instanceof khtml.maplib.geometry.Bounds){
                        string+=space+"\"bbox\":";
                        string+="["+obj[o].sw().lng()+","+obj[o].sw().lat()+",";
                        string+=""+obj[o].ne().lng()+","+obj[o].ne().lat()+"]";
                        string+=",";
                        continue;
                }
                if(obj[o] instanceof khtml.maplib.geometry.LatLng){
			if(obj.type=="Marker"){
				continue;
			}
			if(obj.type=="Point"){
				string+='"coordinates":';
			}
                        string+="["+obj[o].lng()+","+obj[o].lat()+"],";
                        continue;
                }
                        //console.log(o,typeof(obj[o]));
                if(typeof(obj[o])=="string"){
                        if(o=="type" || force){
			if(o=="animVal")continue;
			if(obj[o]=="Marker")continue;
                        string+=space+"\""+o+"\":\""+obj[o]+"\",";
                        }
                        continue;
                }
			console.log(o,indent);
                if(array || o=="type" || o=="features" ||obj[o]&&obj[o].type=="Feature"||o=="geometry" || o=="coordinates" || o=="properties" || o=="bbox" || (o=="className" &&full)){
			console.log(o,indent);
                        if(array){
                                string+=space+khtml.maplib.base.helpers.stringify(obj[o],newindent)+",";
                        }else{
				if(o=="properties"){
					string+=space+"\""+o+"\":"+khtml.maplib.base.helpers.stringify(obj[o],newindent)+",";
				}else{
					string+=space+"\""+o+"\":"+khtml.maplib.base.helpers.stringify(obj[o],newindent,true)+",";
				}
                        }
                }
        }
        string=string.substring(0,string.length -1);
        if(!array){
                return "{"+string+smallspace+"}";
        }else{
                return "["+string+"]";
        }
}


khtml.maplib.base.helpers.rotate=function(el,angle){
	var rot="rotate("+angle+"deg)";
	el.style.webkitTransform=rot;
	el.style.MozTransform=rot;
	el.style.OTransform=rot;


	//see: http://msdn.microsoft.com/en-us/library/ms533014(v=vs.85).aspx
	if(document.all){
		var deg2radians = Math.PI * 2 / 360;
		rad = angle * deg2radians ;
		costheta = Math.cos(rad);
		sintheta = Math.sin(rad);

		el.filters.item(0).M11 = costheta;
		el.filters.item(0).M12 = -sintheta;
		el.filters.item(0).M21 = sintheta;
		el.filters.item(0).M22 = costheta;
		//    el.style.zoom=1;	
	}

}
khtml.maplib.base.helpers.Boundingbox=function(map){
	this.map=map;
	this.div=document.createElement("div");
	this.div.style.border="1px solid black";
	this.div.style.position="absolute";	
	this.div.style.strokeDasharray="4,4";	
	this.div.style.zIndex=1;
	this.div.style.pointerEvents="none"; //maybe only new browsers
	map.mapParent.appendChild(this.div);
	this.show=function(bbox){
		this.div.style.display="";
		var bottomleft=this.map.latlngToXY(bbox.sw());	
		var topright=this.map.latlngToXY(bbox.ne());	
		this.div.style.top=topright.y-parseInt(this.div.style.borderWidth)+"px";

		this.div.style.left=bottomleft.x-parseInt(this.div.style.borderWidth)+"px";
		this.div.style.width=(topright.x-bottomleft.x)+"px";
		this.div.style.height=(-topright.y + bottomleft.y)+"px";
		this.div.zIndex=10;
	}
	this.hide=function(){
		that.div.style.display="none";
	}
	var that=this;
	this.map.addCallbackFunction(that.hide);
}


/**
 * @function
 * @param {Object} el DOM-element to apply the browser-specific css-styles on
 * prevent image from being selected or dragged on modern browsers
 * for older browsers mousedown-event has to be cancelled
*/ 
khtml.maplib.base.helpers.imageNotSelectable = function(el){
		el.style.MozUserSelect = 'none';
		el.style.webkitUserSelect = 'none';
		el.style.webkitUserDrag = 'none';
		el.style.KhtmlUserSelect = 'none';
		el.style.OUserSelect = 'none';
		el.style.userSelect = 'none';
}


/**
 * @function
 * @param {Object} object DOM-Element to apply the style="cursor: ....." argument on
 * @param {String} string
 * set cursor for an object via css-style
 * vendor specific cursors
 * or via url
*/
khtml.maplib.base.helpers.setCursor = function( object, string) {
	// Internet Explorer
	if (navigator.userAgent.indexOf("MSIE") != -1) {	// tested on IE6 and IE8
        if (string == "grab")
			object.style.cursor = "url('" + khtml.maplib.standardimagepath + "hand.cur'), default";
		else if (string == "grabbing")
			object.style.cursor = "url('" + khtml.maplib.standardimagepath + "fist.cur'), move";
		else
			object.style.cursor = "pointer";
    }
	// others
	else {
		object.style.cursor = "-moz-" + string;			// tested on firefox 3.6
		if (object.style.cursor != "-moz-" + string) {
			object.style.cursor = "-webkit-" + string;		// tested on safari 5 and chrome 12
			if (object.style.cursor != "-webkit-" + string) {
				object.style.cursor = "-ms-" + string;
				if (object.style.cursor != "-ms-" + string) {		// missing, not sure if it works
					object.style.cursor = "-khtml-" + string;
					if (object.style.cursor != "-khtml-" + string) {		// missing, not sure if it works
						object.style.cursor = string;
						if (object.style.cursor != string){
							object.style.cursor = "pointer";
						}
					}
				}
			}
		}
	}
};
