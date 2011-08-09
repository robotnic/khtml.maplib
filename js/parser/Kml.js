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
 * class understands KML and manages the layers related to the KML passed
 * is like a layer in the view of the map but manages multiple layers of different types
 * can be added to map as overlay
 *
 * @class
 * Example: <a href="../../../examples/parser/kml/googlebuildings.html">kml from google tutorial</a>
*/
khtml.maplib.parser.Kml = function(KML) {
	// initialize variables
	this.parsed = null;
	this.styles=new Array();
	
	// Methods
	/**
	 * Parse KML!
	 *
	 * @param {boolean} force	parse dom again - even if it has been parsed before.
	 * @returns {khtml.maplib.overlay.Layer}
	*/
	this.parse = function(force) {
		//khtml.maplib.base.Log.log('Kml.parse(): begin');
		if(force || null==this.parsed) {
			if(!this.dom) {
				//khtml.maplib.base.Log.warn('Kml.parse(): Aborted. dom is empty! use kml.setDom(data)');
				return false;
			}

			if(this.dom.hasChildNodes) {
				this.parsed = this.parseNode(this.dom.documentElement);
			}
		}
		
		//khtml.maplib.base.Log.log('Kml.parse(): end');
		
		return this.parsed;
	}

	/**
	 * Parse a single node.
	 * Entry point for parsing.
	 *
	 * @param {DOMElement} node
	 * @returns {khtml.maplib.overlays.Layer} or null
	*/
	this.parseNode = function(node) {		
		if(!node) return false;
		
		var layer = null;
		var newLayer = null;
		
		
		switch(node.nodeName) {
			case "xml":
			case "#document":  //??????
				if(khtml.maplib.base.helpers.isIE() && node.childNodes.length > 1) return this.parseNode(node.childNodes[1]);
				return this.parseNode(node.childNodes[0]);
				break;
			case "kml":
				/*
				if(node.childNodes.length > 1) {
					khtml.maplib.base.Log.warn(
						"Some elements inside the <kml>-Tag were ignored! Only the first tag was parsed!"
					);
				}
				return this.parseNode(node.childNodes[0]);
				*/
				var fc=this.parseNode(node.getElementsByTagName("*").item(0));
				return fc;
				/*
				for(var j = 0; j < node.childNodes.length; j++) {
					var layer = this.parseNode(node.childNodes[j]);
					if(layer != null) return layer;
				}
				*/
				break;
			case "Document":
				//newLayer = this.parseDocument(node);
				layer = this.parseDocument(node);
				return layer;
			case "Folder":
				if ("Folder" == node.nodeName) {
					newLayer = this.parseFolder(node);
				}

				if(null==layer) {
					layer = newLayer;
				} else {
					layer.appendChild(newLayer);
				}
				break;
			case "Placemark":
				// prepare layer
				//if(null==layer) layer = new khtml.maplib.overlay.Layer();
				// add feature
				layer.appendChild(this.parsePlacemark(node));
				break;
			case "GroundOverlay":
				// prepare layer
				if(null==layer) layer = new khtml.maplib.overlay.FeatureCollection();
				// add feature
				layer.appendChild(this.parseGroundOverlay(node));
				break;
			case "Region":
			case "ExtendedData":

			default:
				//khtml.maplib.base.Log.log("ignored node (parseNode): " +  + node.nodeName);
				break;
		}
		
		return layer;
	}
	
	/**
	 * Parse "Folder" tags in the first level of the supplied node.
	 * This function dosen't support to parse all tags because folder
	 * structure is allways hierarchical.
	 *
	 *
	 * <pre>A Folder is used to arrange other Features hierarchically (Folders, Placemarks, NetworkLinks, or Overlays).
	 * A Feature is visible only if it and all its ancestors are visible.</pre>
	 *
	 * @see http://code.google.com/intl/de/apis/kml/documentation/kmlreference.html#folder 
	 * @param {DOMElement} node
	*/
	this.parseFolder = function(node) {
		//khtml.maplib.base.Log.log('parse Folder!');
		var folder = new khtml.maplib.overlay.FeatureCollection();

		for(var j = 0; j < node.childNodes.length; j++) {	
			switch(node.childNodes[j].nodeName) {
				case "name":
					folder.properties.name=node.childNodes[j].childNodes[0].nodeValue;
					break;
				case "open":
					// Specifies if the folder is open/closed in Google Earths list view.
					// 1=expanded / 0=collapsed
					//folder.attribute("open", node.childNodes[j].childNodes[0].nodeValue);
					break;
				case "visibility":
					// Specifies whether the feature is drawn in the 3D viewer when it is initially loaded.
					// In order for a feature to be visible, the <visibility> tag of all its ancestors
					// must also be set to 1.
					folder.visible(parseInt(node.childNodes[j].childNodes[0].nodeValue)==1);
					break;
				case "description":
					folder.properties.description=node.childNodes[j].childNodes[0].nodeValue;
					break;
				case "Folder":
					folder.appendChild(this.parseFolder(node.childNodes[j]));
					break;
				case "Placemark":
					// add feature
					folder.appendChild(this.parsePlacemark(node.childNodes[j]));
					break;
				case "GroundOverlay":
					folder.appendChild(this.parseGroundOverlay(node.childNodes[j]));
					break;

				default:
					//khtml.maplib.base.Log.log("ignored node (parseFolder): " + node.childNodes[j].nodeName);
			}
		}

		//khtml.maplib.base.Log.log('Folder:', folder, node);
		
		return folder;
	}
	
	/**
	 * Parse a "Document" tag.
	 *
	 * <pre>A Document is a container for features and styles.
	 * This element is required if your KML file uses shared styles. 
	 * Do not put shared styles within a Folder.</pre>
	 *
	 * @see http://code.google.com/intl/de/apis/kml/documentation/kmlreference.html#document 
	 * @param {DOMElement} node
	*/
	this.parseDocument = function(node) {
		var doc = new khtml.maplib.overlay.FeatureCollection();

		
		for(var j = 0; j < node.childNodes.length; j++) {	
			if(node.childNodes[j].nodeType!=1)continue; //white spaces
			switch(node.childNodes[j].nodeName) {
				case "name":
					doc.name=node.childNodes[j].childNodes[0].nodeValue;
					break;
				case "open":
					// Specifies if the folder is open/closed in Google Earths list view.
					// 1=expanded / 0=collapsed
					doc.attribute("open", node.childNodes[j].childNodes[0].nodeValue);
					break;
				case "visibility":
					// Specifies whether the feature is drawn in the 3D viewer when it is initially loaded.
					// In order for a feature to be visible, the <visibility> tag of all its ancestors
					// must also be set to 1.
					doc.visible(parseInt(node.childNodes[j].childNodes[0].nodeValue)==1);
					break;
				case "description":
					// Text in Popup Baloon
					doc.properties.description=node.childNodes[j].childNodes[0].nodeValue;
					break;
				case "Style":
					var style = this.parseStyle(node.childNodes[j]);
					break;
				case "Folder":
					doc.appendChild(this.parseFolder(node.childNodes[j]));
					break;
				case "GroundOverlay":
					doc.addContent(this.parseGroundOverlay(node.childNodes[j]), true);
					break;
				case "Placemark":
					var feature=this.parsePlacemark(node.childNodes[j]);
					if(feature.type=="Feature" || feature.type=="Marker"){
						doc.appendChild(feature);
					}else{
					}
					break;
				default:
					//khtml.maplib.base.Log.log("ignored node (parseDocument): " + node.childNodes[j].nodeName);
			}
		}
		
		//khtml.maplib.base.Log.log('Document:', doc);
		
		return doc;
	}

	/**
	 * Parse a "Style" tag.
	 *
	 * @see http://code.google.com/intl/de/apis/kml/documentation/kmlreference.html#style
	 * @param {DOMElement} node XML Node
	*/
	this.parseStyle = function(node) {
		if(!node) return false;
		var id=node.getAttribute("id");
		if(!this.styles[id]){
			this.styles[id]=new Array();
		}
		for(var i=0;i<node.childNodes.length;i++){
			var styleNode=node.childNodes[i];
			if(styleNode.nodeType!=1)continue;
			var style=new Object;
			style.fill="none";	
			style.stroke="rgba(255,0,0,0.48828125)";
			style.strokeWidth=3;	
			this.styles[id][style.tagName]=style;
			for(var p=0; p< styleNode.childNodes.length;p++){
				if(styleNode.childNodes[p].nodeType!=1)continue;
				var tagName=styleNode.childNodes[p].tagName;
				if(!styleNode.childNodes[p].firstChild)continue; //empty element
				switch(tagName){
					case "color":
						if(styleNode.nodeName=="LineStyle"){
							 style.stroke=hex2rgba(styleNode.childNodes[p].firstChild.nodeValue);
						}
						if(styleNode.nodeName=="PolyStyle") style.fill=hex2rgba(styleNode.childNodes[p].firstChild.nodeValue);
						break;
					case "width":
						if(styleNode.nodeName=="LineStyle") style.strokeWidth=styleNode.childNodes[p].firstChild.nodeValue;
						if(styleNode.nodeName=="PolyStyle") style.strokeWidth=styleNode.childNodes[p].firstChild.nodeValue;
						break;
					default:
						console.log("not implemented",tagName,styleNode[p]);
				}
			}
			this.styles[id][styleNode.tagName]=style;
			
		}
		
		//khtml.maplib.base.Log.warn('parseStyle(): Warning - not implemented!');
		return false;
	}	
	/**
	 * Parse a "GroundOverlay" tag.
	 *
	 * Example:
	 <pre>
	<GroundOverlay>
	   <name>GroundOverlay.kml</name>
	   <color>7fffffff</color>
	   <drawOrder>1</drawOrder>
	   <Icon>
	      <href>http://www.google.com/intl/en/images/logo.gif</href>
	      <refreshMode>onInterval</refreshMode>
	      <refreshInterval>86400</refreshInterval>
	      <viewBoundScale>0.75</viewBoundScale>
	   </Icon>
	   <LatLonBox>
	      <north>37.83234</north>
	      <south>37.832122</south>
	      <east>-122.373033</east>
	      <west>-122.373724</west>
	      <rotation>45</rotation>
	   </LatLonBox>
	</GroundOverlay>
	</pre>
	 *
	 * Note: rotation is in degree (+-180) around object center.
	 *
	 * @see http://code.google.com/intl/de/apis/kml/documentation/kmlreference.html#groundoverlay
	 * @param {DOMElement} node XML Node of type "GroundOverlay"
	 * @returns false if node is not a groundoverlay. Otherwise a new {khtml.maplib.overlay.Image} layer.
	*/
	this.parseGroundOverlay = function(node) {
		if(!node) return false;
		if(!node.nodeName=="GroundOverlay") return false;
		
		// <Icon>
		var myIcon = this.parseIcon(node);
		
		// <LatLonBox>
		var latlonbox = node.getElementsByTagName("LatLonBox")[0];
		
		var north = latlonbox.getElementsByTagName("north")[0].childNodes[0].nodeValue;
		var east = latlonbox.getElementsByTagName("east")[0].childNodes[0].nodeValue;
		
		var south = latlonbox.getElementsByTagName("south")[0].childNodes[0].nodeValue;
		var west = latlonbox.getElementsByTagName("west")[0].childNodes[0].nodeValue;
		
		// <LatLonBox><rotation>..
		var options = new Object();
		if(latlonbox.getElementsByTagName("rotation")[0] != undefined) {
			// fetch rotation
			var myRotation = latlonbox.getElementsByTagName("rotation")[0].childNodes[0].nodeValue;
			options.rotation = parseFloat(myRotation);
		}
		
		// Define Boundingbox
		var myBB = new khtml.maplib.geometry.Bounds(
			new khtml.maplib.LatLng(south, west),
			new khtml.maplib.LatLng(north, east)
		);
		
		// Create new image layer
		var myLayer = new khtml.maplib.overlay.GroundOverlay(myBB, myIcon, options);

		// Create feature
		/*
		var feature = new khtml.maplib.overlay.Feature();
		feature.marker(myLayer);
		feature.geometry(myBB);
		*/
		
		//khtml.maplib.base.Log.log('GroundOverlay:', feature);

		return myLayer;
	}
		
	/**
	 * Parse a "Placemark" tag.
	 *
	 * @param {DOMElement} node
	*/
	this.parsePlacemark = function(node) {
		if(!node) return false;
		var pm = node;
		var data = {};
		data.visibility = true; // default
		//khtml.maplib.base.Log.log('node',node);
		
		for(var j = 0; j < pm.childNodes.length; j++) {
			switch(pm.childNodes[j].nodeName) {
				case "name":
					if(pm.childNodes[j].childNodes.length > 0) {
						if(typeof(pm.childNodes[j].childNodes[0].nodeValue)!='undefined'){
							data.name = pm.childNodes[j].childNodes[0].nodeValue;
						}
					}
					break;
				case "description":
					if(pm.childNodes[j].childNodes.length > 0) {
						if(typeof(pm.childNodes[j].childNodes[0].nodeValue)!='undefined'){
							data.description = pm.childNodes[j].childNodes[0].nodeValue;
						}
					}
					break;
				case "Point":
					data = this.parsePoint(pm.childNodes[j]);
					break;
				case "LineString":
					data = this.parseLineString(pm.childNodes[j]);
					break;
				case "Polygon":
					data = this.parsePolygon(pm.childNodes[j]);
					break;
				case "gx:drawOrder":
					data.gxdraworder = pm.childNodes[j];
					break;
				case "visibility":
					// Specifies whether the feature is drawn in the 3D viewer when it is initially loaded.
					// In order for a feature to be visible, the <visibility> tag of all its ancestors
					// must also be set to 1.
					data.visibility = parseInt(pm.childNodes[j].childNodes[0].nodeValue)==1;
					break;
			}
		
			//khtml.maplib.base.Log.log('data',data);
			var styleUrls=pm.getElementsByTagName("styleUrl");
			if(styleUrls.length>0){
				if(styleUrls[0].firstChild){
					var stylename=styleUrls[0].firstChild.nodeValue;	
					stylename=stylename.substring(1,stylename.length);
				}
				if(this.styles[stylename]){
					if(this.styles[stylename][pm.childNodes[j].nodeName]){
					}		
				}
			}
		}
		//name + description
		try{
		var name=pm.getElementsByTagName("name").item(0).firstChild.nodeValue
		data.properties.name=name;
		}catch(e){}
		try{
		var description=pm.getElementsByTagName("description").item(0).firstChild.nodeValue
		data.properties.description=description;
		}catch(e){}
		return data; //this.generateFeature(data);
	}
	

	/**
	 * Parse a "LineString" tag.
	 *
	 * @param {DOMElement} node
	 * @see http://code.google.com/intl/de/apis/kml/documentation/kmlreference.html#linestring
	 * @returns {khtml.maplib.geometry.LineString}
	*/
	this.parseLineString = function(node) {
		try{
		var styleUrl=node.parentNode.getElementsByTagName("styleUrl").item(0).firstChild.nodeValue;
			styleUrl=styleUrl.substring(1,styleUrl.length);
		}catch(e){
		}
		
		if(!node) return false;

		// fetch coordinates
		var coordinates = this.parseCoordinates(node);
		// generate LineString
		var lineString = new khtml.maplib.geometry.Feature({type:"LineString",coordinates:coordinates[0]});
		//khtml.maplib.base.Log.log('coordinates:', coordinates);
		// assign coordinates
		//lineString.setPoints(coordinates[0]);
		// Set class
		lineString.className.baseVal =  "kml_linestring";
		
		//khtml.maplib.base.Log.log('LineString:', lineString);
		if(this.styles[styleUrl]){
			//console.log("fast",this.styles[styleUrl].LineStyle);
			lineString.style=this.styles[styleUrl].LineStyle.style;
		}else{
			lineString.style.stroke="blue";
			lineString.style.strokeWidth=4;
		}
		return lineString;
	}
	
	/**
	 * Parse a "Polygon" tag.
	 *
	 * @param {DOMElement} node
	 * @see http://code.google.com/intl/de/apis/kml/documentation/kmlreference.html#polygon
	 * @returns {khtml.maplib.geometry.Polygon}
	*/
	this.parsePolygon = function(node) {
		if(!node) return false;
		try{
		var styleUrl=node.parentNode.getElementsByTagName("styleUrl").item(0).firstChild.nodeValue;
			styleUrl=styleUrl.substring(1,styleUrl.length);
		}catch(e){}
		
		var polygon = new khtml.maplib.geometry.Feature({type:"Polygon"});

		for(var j = 0; j < node.childNodes.length; j++) {
			//khtml.maplib.base.Log.log('nodeName:'+node.childNodes[j].nodeName);
			switch(node.childNodes[j].nodeName) {
				case "outerBoundaryIs":
					var coordinates = this.parseCoordinates(node.childNodes[j]);
					polygon.geometry.coordinates=coordinates[0];
					break;
				case "innerBoundaryIs":
					var coordinates = this.parseCoordinates(node.childNodes[j]);
					//tut noch nicht
					//polygon.addInnerBoundary(coordinates[0]);
					break;
				/*
				discard other attributes:
				
				<extrude>0</extrude>                       <!-- boolean -->
				  <tessellate>0</tessellate>                 <!-- boolean -->
				  <altitudeMode>clampToGround</altitudeMode>
				*/
			}
		}
		
		// Set class
		polygon.className = polygon.className + " kml_polygon";
		if(this.styles[styleUrl]){
			//console.log("fast",this.styles[styleUrl].LineStyle);
			polygon.style=this.styles[styleUrl].PolyStyle;
		}
		//khtml.maplib.base.Log.log('Polygon:', polygon);
		
		return polygon;
	}
	
	/**
	 * Expects a DOMElement and extracts all "coordinates" tags
	 * Returns a two dimensional array of points or an array where array[0][0] is set to null 
	 * 
	 * @param {DOMElement} node
	 * @see http://code.google.com/intl/de/apis/kml/documentation/kmlreference.html#coordinates
	 * @returns Array
	 */
	this.parseCoordinates = function(node) {
		var coordinates = node.getElementsByTagName("coordinates");
		var pointArray = new Array();
		
		if(coordinates.length == 0) {
			// if no coordinates found, make an array of two dimensions and set the first value null
			// an two dimensional array is expected by the callerfunctions
			pointArray[0] = new Array();
			pointArray[0][0] = null;
		}
		
		for(var i = 0; i < coordinates.length; i++) {
			pointArray[i] = new Array(); 
			var coordinatesString = '';
			
			// Note: This loop is very important for Firefox!
			//		 Child nodes are max. 4096 characters long!
			//		 In contrast, Safari&Chrome put the same 60000 characters long string into 1 childNode!
			for(var k = 0; k < coordinates[i].childNodes.length; k++) {
				var value = coordinates[i].childNodes[k].nodeValue;
				if(value !=null && value.length > 0) {
					coordinatesString = coordinatesString + value.trim();
				}
			}

			//khtml.maplib.base.Log.log('child nodes length:'+coordinates[i].childNodes.length);
			//khtml.maplib.base.Log.log('coordinatesString:'+coordinatesString.length);
			var coordinatesArray = coordinatesString.split(/\s/); // Split at any whitespace character (whitespace/newline/tab/..)

			var j_pointArray = 0;
			for(var j = 0; j < coordinatesArray.length; j++) {
				var coordinatesString2 = coordinatesArray[j].trim();
				if(coordinatesString2.length > 0) {
					var singlePoint = coordinatesString2.split(',');
					pointArray[i][j_pointArray] = new khtml.maplib.LatLng(singlePoint[1]/*lat*/,singlePoint[0]/*long*/);
					j_pointArray++;
				}
			}
		}

		return pointArray;
	}
	
	/**
	 * Input should look like this:
		<Point>
			<coordinates>9.205455021203617,47.46315014149831,0</coordinates>
		</Point>
	 * @see http://code.google.com/intl/de/apis/kml/documentation/kmlreference.html#coordinates
	*/
	this.parsePoint = function(node) {
		var img=document.createElement("img");
		img.setAttribute("src","http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png");
		var point=new this.parseCoordinates(node)[0][0],img;
		var marker=new khtml.maplib.overlay.Marker(point,img);
		return marker;
	}
	
	/**
	 * Parse an "Icon" tag.
	 * 
	 * Parse tags: href,gx:x,gx:y,gx:w,gx:h.
	 * Ignore tags: refreshMode, refreshInterval, viewRefreshMode, viewRefreshTime, viewBoundScale, viewFormat, httpQuery.
	 * 
	 * @see http://code.google.com/intl/de/apis/kml/documentation/kmlreference.html#icon
	 * @param {DOMElement} node
	 */
	this.parseIcon = function(node) {
		var imgSrc = this._imgBasePath + node.getElementsByTagName("href")[0].childNodes[0].nodeValue;
		
		var myIcon = null;
		var myImg = document.createElement("img");
		myImg.setAttribute("src", imgSrc);
		
		// check if image size (gx:w/gx:h) or image position (gx:x/gx:y) tags are available
		if(node.getElementsByTagName("gx:x").length != 0 
			|| node.getElementsByTagName("gx:y").length != 0 
			|| node.getElementsByTagName("gx:w").length != 0 
			|| node.getElementsByTagName("gx:h").length != 0) {
			
			// Set image size
			myIcon = document.createElement("div");
			var w = node.getElementsByTagName("gx:w")[0].childNodes[0].nodeValue;
			var h = node.getElementsByTagName("gx:h")[0].childNodes[0].nodeValue;
			
			myIcon.setAttribute("style", "overflow: hidden; position: absolute; width: "+w+"px; height: "+h+"px;");
			myIcon.naturalWidth = w; // guard original for zoom calculations
			myIcon.naturalHeight = h; // guard original for zoom calculations
			
			// Set image position
			var x = node.getElementsByTagName("gx:x")[0].childNodes[0].nodeValue;
			var y = node.getElementsByTagName("gx:y")[0].childNodes[0].nodeValue;
			myImg.setAttribute("style", "position: absolute; left: -"+x+"px; bottom: -"+y+"px;");
			myImg.naturalLeft = x*(-1); // guard original for zoom calculations
			myImg.naturalBottom = y*(-1); // guard original for zoom calculations
			
			// append image to div
			myIcon.appendChild(myImg);
		} else {
			// no cropping is needed
			myIcon = myImg;
		}
		
		return myIcon;
	}
	
	/**
	 * Creates a Vector Feature.
	 *
	 * @param {Object} data Example {tite:"MyTitle", desription: "MyDescription", point: new khtml.maplib.LatLng()} instead of attribute line (type: {khtml.maplib.geometry.LineString})
	 * @returns {khtml.maplib.overlay.Feature}
	*/
	this.generateFeature = function(data) {
		return false; //sosososo
		if(!data) return false;
		
		var feature = new khtml.maplib.overlay.Feature();

		// quit if position for this feature is unknown.
		if(typeof(data.point) != "object" && typeof(data.geometry) != "object") {
			khtml.maplib.base.Log.warn("generateFeature(): no feature generated. no geometry information is available! (no .point/.geometry propetry)", data);
			return null;
		}
		
		// set visibility
		feature.visible(data.visibility);
		// save data
		feature.data = data;
		
		// add geometry
		if(data.point) {
			feature.geometry(data.point);
			feature.marker(this.getMarkerForFeature(data));
		} else if (data.geometry) {
			feature.geometry(data.geometry);

			/*
			// generate marker
			var container = document.createElement('div');
			// add class
			container.className = "kml_placemark";

			// is title attribute set?
			if(data.title) {
				// add information to feature
				feature.data.title = data.title;
			
				var title = document.createElement('div');
				title.appendChild(document.createTextNode(data.title));
				// set class
				title.className = "kml_placemark_title";
				// add title to container
				container.appendChild(title);
			}
			// is description attribute set?
			if(data.description) {
				// add information to feature
				feature.data.description = data.description;

				//khtml.maplib.base.Log.log("description: " + data.description);
				var title = document.createElement('p');
				title.appendChild(document.createTextNode(data.description));
				// set class
				title.className = "kml_placemark_description";
				// add element to container
				container.appendChild(title);
			}
		
			if(data.title || data.description) {
				// Create marker
				var marker = new khtml.maplib.displayable.Marker(null,container);		
				feature.marker(marker);
			}
			*/
		}
		
		return feature;
	}
	
	
	/**
	 * Generate a marker for the feature of a placemark.
	 *
	 * To switch the image, use <pre>this.imageMarkerUrl('http://new url')</pre>
	 *
	 * Hint: if you wan't to generate different markers, overwrite this method in your code.
	 * Example:
	 * <pre>
	 * var parser = khtml.maplib.parser.Kml();
	 * parser.getMarkerForFeature = function(data) { return new ... }
	 * </pre>
	 *
	 * @param {String} data feature data
	*/
	this.getMarkerForFeature = function(data) {
		return new khtml.maplib.displayable.ImageMarker(this.imageMarkerUrl());
	}
	
	/**
	 * Parse XML.
	 *
	 * @param {String} xml xml as string or as parsed object
	*/
	this.setDom = function(xml) {
		if(typeof(xml)=="string"){
			this.dom=khtml.maplib.base.helpers.parseXml(xml);
		}else{
			this.dom=xml;
		}
	};
	
	/**
	 * This path is prepended to groundoverlay image url's.
	 *
	 * @param {String} p base path
	*/
	this.imgBasePath = function(p) {
		if(typeof(p)!="undefined"){
			this._imgBasePath = p;
		}
		
		return this._imgBasePath;
	};
		
	/**
	 * This url is used for the imagemarker in placemarks.
	 *
	 * @param {String} p url
	*/
	this.imageMarkerUrl = function(p) {
		if(typeof(p)!="undefined"){
			this._imageMarkerUrl = p;
		}
		
		return this._imageMarkerUrl;
	};

	function hex2rgba(hex){
		var a=parseInt(hex.substring(0,2),16)/256;
		var r=parseInt(hex.substring(2,4),16);
		var g=parseInt(hex.substring(4,6),16);
		var b=parseInt(hex.substring(6,8),16);
		var color="rgba("+r+","+g+","+b+","+a+")";	
		return color;
	}
		
	// Constructor
	this.layers = new Array();
	this.folders = new Array();
	this._imgBasePath = '';
	this.imageMarkerUrl('http://thydzik.com/thydzikGoogleMap/markerlink.php?color=5680FC');
	this.setDom(KML);	
};
