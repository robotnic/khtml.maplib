/**
KML Parser
*/


khtml.maplib.parser.Kml=function(targetLayer){
	this.styles=new Array();
	var fc=new khtml.maplib.geometry.Feature({type:"FeatureCollection"});
	targetLayer.appendChild(fc);
	//fc.features=new Array();
	this.folders=new Array();
	this.parse=function (dom){
		var doc=dom.getElementsByTagName("Document").item(0);
		console.log(doc);
		for(var i=0;i<doc.childNodes.length;i++){
			var child=doc.childNodes[i];
			if(child.nodeType!=1)continue;
			switch(child.tagName){
				case "Folder":
					var feature=this.parseFolder(child);
					fc.appendChild(feature);
					break;
				case "Style":
					this.parseStyle(child);
			}
		}
		return fc
	}
	this.parseStyle=function(el){
		for(var i=0;i<el.childNodes.length;i++){
			var child=el.childNodes[i];
			if(child.nodeType!=1)continue;
			var id=el.getAttribute("id");
			this.styles[id]=new Object;
			switch(child.tagName){
				case "LineStyle":
					var width=elementText(child,"width");
					this.styles[id].strokeWidth=width;
					break;
				case "PolyStyle":
					var color=elementText(child,"color");
					this.styles[id].fill=hex2rgba(color);
					break;
			}

		}
		
	}
	this.parseFolder=function(el){
		var name=elementText(el,"name");
		var f={name:name};
		f.placeMarks=new Array();
		this.folders.push(f);
		var folder=new khtml.maplib.geometry.Feature({type:"FeatureCollection"});
		f.feature=folder;
		//folder.features=new Array();
		for(var i=0;i<el.childNodes.length;i++){
			var child=el.childNodes[i];
			name=elementText(child,"name");
			var placemark={name:name};
			f.placeMarks.push(placemark);
			if(child.nodeType!=1)continue;
			switch(child.tagName){
				case "Placemark":	
					var feature=this.parsePlacemark(folder,child);
					break;
				case "GroundOverlay":	
					this.parseGroundOverlay(folder,child);
					break;
				case "ScreenOverlay":	
					break;
			}		
			if(feature){
				folder.appendChild(feature);
				placemark.feature=feature;
			}
		}
		return folder;
	}

	this.parseGroundOverlay=function(folder,el){
                var myIconName=elementText(el.getElementsByTagName("Icon").item(0),"href");
		var myIcon=document.createElement("img");
		myIcon.setAttribute("src",myIconName);

                // LatLonBox
                var latlonbox = el.getElementsByTagName("LatLonBox")[0];
                
                var north = elementText(latlonbox,"north"); 
                var east = elementText(latlonbox,"east"); 
                
                var south = elementText(latlonbox,"south"); 
                var west = elementText(latlonbox,"west"); 
       
                // LatLonBox rotation..
                var options = new Object();
                if(latlonbox.getElementsByTagName("rotation")[0] != undefined) {
		}
		// Define Boundingbox
                var myBB = new khtml.maplib.geometry.Bounds(
                        new khtml.maplib.LatLng(south, west),
                        new khtml.maplib.LatLng(north, east)
                );

                // Create new image layer
                var myLayer = new khtml.maplib.overlay.GroundOverlay(myBB, myIcon, options);
		map.addOverlay(myLayer);

	}
	this.parsePlacemark=function(folder,el){
		try{
		var styleUrl=elementText(el,"styleUrl");
		}catch(e) {}
		for(var i=0;i<el.childNodes.length;i++){
			var child=el.childNodes[i];
			if(child.nodeType!=1)continue;
			switch(child.tagName){
				case "Polygon":
					var feature={type:"Feature"};
					feature.geometry={type:"Polygon"}
					var coords=elementText(child,"coordinates");
					coords=coords.replace(/\n/g," ");
					var coords=coords.replace(/ +/g," ");
					var coords=coords.replace(/^ +/,"");  //trim
					var coords=coords.replace(/ +$/,"");  //trim
					var coordsArray=coords.split(" ");
					feature.geometry.coordinates=new Array();
					for(var i=0;i<coordsArray.length;i++){
						var lat=coordsArray[i].split(",")[1];
						var lng=coordsArray[i].split(",")[0];
						feature.geometry.coordinates.push([lng,lat]);
					}
					var styleId=styleUrl.substring(1,styleUrl.length);
					feature.style=this.styles[styleId];
						
					var featureObject=folder.appendChild(new khtml.maplib.geometry.Feature(feature));
					break;
				case "Point":
					var feature={type:"Feature"};
					feature.geometry={type:"Point"};
					var coords=elementText(child,"coordinates");
					var lat=coords.split(",")[1];
					var lng=coords.split(",")[0];
					feature.geometry.coordinates=[lng,lat];
					feature.marker=new Object;
					feature.marker.infobox=elementText(child.parentNode,"description");
                                        var featureObject=folder.appendChild(new khtml.maplib.geometry.Feature(feature));

					break;
			}
		}
		return featureObject;
	}

        function hex2rgba(hex){
                var a=parseInt(hex.substring(0,2),16)/256;
                var r=parseInt(hex.substring(2,4),16);
                var g=parseInt(hex.substring(4,6),16);
                var b=parseInt(hex.substring(6,8),16);
                var color="rgba("+r+","+g+","+b+","+a+")";
                return color;
        }

	function elementText(el,name){
		try{
			var element=el.getElementsByTagName(name).item(0);
			var text=element.firstChild.nodeValue;
		}catch(e){
			var text="";
		}
		return text;
	}
	
}

