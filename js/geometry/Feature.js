
/**
 * This class renders a single feature like Polygon, LineString,...
 * Ducktyping in use.

 * The initializition process is a bit complicated.
 * Maybe there the feature should be cloned completely.

 * @param feature - an object that repesents the feature
 * @param optional - the featureCollection 
 * @class
*/




khtml.maplib.geometry.Feature=function(feature,parentNode){
	var that=this;
	if(feature.type=="FeatureCollection"){
		return new khtml.maplib.geometry.FeatureCollection(feature,parentNode);	
	}
	this.type="Feature";
	this.events=new Array();

	this.geometry=new Object;
	/*
	Duck typing fault tolerant parameters need repair.
	*/
	if(feature.geometry){
		//long geojson {type:"Feature",geometry:{type:"LineString",coordinates:[...]}}
		//todo: change name to "parseCoordinates"
		this.geometry.coordinates=khtml.maplib.base.helpers.parseLine(feature.geometry.coordinates);
		this.geometry.type=feature.geometry.type;
	}else{
		//short geojson {type:"LineString",coordinates:[...]}
		this.geometry.coordinates=khtml.maplib.base.helpers.parseLine(feature.coordinates);
		this.geometry.type=feature.type;
	}
	if(!feature.style){
		this.style=new Object;
	}else{
		this.style=feature.style;
	}
	if(feature.className){
		this.className=feature.className;
	}else{
		this.className=new Object;
	}
	if(feature.properties){
		this.properties=feature.properties;
	}
	if(feature.infobox){
		this.infobox=feature.infobox;
	}
	if(feature.title){
		this.title=feature.title;
	}
	this.init=function(parentNode){
		this.parentNode=parentNode;
		this.documentElement=parentNode.documentElement;
		if(!this.bbox){
			this.bbox=this.makeBounds();
		}
	}

	/**
	Event Interface
	*/
	
        this.eventAttach=function(eventType,method,context,bubble){
                if(this.element){
                        var ev=khtml.maplib.base.helpers.eventAttach(this.element,eventType,method,context,bubble);
                }
                this.events.push({"eventType":eventType,"method":method,"context":context,"bubble":bubble});
        }
        this.eventRemove=function(){
                console.log("not implemented");
        }

	/**
	calcualte bounding box (for lacy rendering)
	Looks like duplicated code, should be moved to helpers class
	*/


        this.makeBounds=function(coordinates){
		if(!coordinates){
			var coordinates=this.geometry.coordinates;
		}
                var boundsSouth = 90;
                var boundsNorth = -90;
                var boundsWest = 180;
                var boundsEast = -180;
		if(coordinates instanceof khtml.maplib.geometry.LatLng){
			
			if(coordinates.lat){	
				var lng = coordinates.lng();
				var lat = coordinates.lat();
				if (lat > boundsNorth) {
					boundsNorth = lat;
				}
				if (lat < boundsSouth) {
					boundsSouth = lat;
				}
				if (lng > boundsEast) {
					boundsEast = lng;
				}
				if (lng < boundsWest) {
					boundsWest = lng;
				}
			}

		}else{
			for(var i=0; i < coordinates.length;i++){
				if(coordinates[i] instanceof khtml.maplib.geometry.LatLng){
					var lng = coordinates[i].lng();
					var lat = coordinates[i].lat();
					if (lat > boundsNorth) {
						boundsNorth = lat;
					}
					if (lat < boundsSouth) {
						boundsSouth = lat;
					}
					if (lng > boundsEast) {
						boundsEast = lng;
					}
					if (lng < boundsWest) {
						boundsWest = lng;
					}

				}else{
					var bounds=this.makeBounds(coordinates[i]);
					if(bounds.sw().lat() < boundsSouth){
						boundsSouth=bounds.sw().lat();
					}
					if(bounds.sw().lng() < boundsWest){
						boundsWest=bounds.sw().lng();
					}
					if(bounds.ne().lat() > boundsNorth){
						boundsNorth=bounds.ne().lat();
					}
					if(bounds.ne().lng() > boundsEast){
						boundsEast=bounds.ne().lng();
					}
				}
			}
                }
                //return line bounds
                var sw = new khtml.maplib.LatLng(boundsSouth, boundsWest);
                var ne = new khtml.maplib.LatLng(boundsNorth, boundsEast);
                var b = new khtml.maplib.geometry.Bounds(sw, ne);
                return (b);

        }










	/**
	============== Now do the real things ================
	**/


        /**
        Bring it to the screen. 
        Canvas Holes in Polygon rendering is still buggy.
        VML missing
        */
        this.render=function(){
                if(!that.documentElement)return;
                //if(!that.documentElement.map.finalDraw)return;
                if(!that.parentNode)that.parentNode=that.featureCollection;
                if(khtml.maplib.base.helpers.overlaps(that.documentElement.map.bounds(),that.bbox)){
                        that.style.display="";
                        switch(that.documentElement.backend){
                                case "svg":that.renderSVG(that);
                                        break;
                                case "vml":
                                        that.renderVML(that);
                                        break;
                                case "canvas":
                                        that.renderCanvas(that);
                                        break;
                                default:
                                        if(console && console.log)console.log("backend unknown",that.parentNode.backend);


                        }
                }else{
                        that.style.display="none";
                }
                if(that.geometry.type=="Point"){
                        that.renderMarker(that.parentNode.element);
                }
        }


        /**
        khtml.maplib provides 2 marker interface. 
        The simple interface takes a DOM element.
        The other is the Ewald GSoC interface (google API)
        */

        this.renderMarker=function(domParent){
                if(this.mmarker)return;
                if(!feature.marker)feature.marker=new Object;
                this.marker=feature.marker;
                this.mmarker = new khtml.maplib.overlay.Marker({
                        position: this.geometry.coordinates,
                        map: this.documentElement.map,
                        title:feature.title,
                        icon:feature.marker.icon,
                        shadow:feature.marker.shadow,
                        draggable:feature.draggable,
                        raiseOnDrag:feature.raiseOnDrag
                });
                //todo - not working
                if(feature.marker.infobox){
                        this.mmarker.box = new khtml.maplib.overlay.InfoWindow({content: feature.marker.infobox});
                        this.mmarker.attachEvent( 'click', function() {
                                this.box.open(this.mapObj,this);
                        });
                }
        }


	/**
	SVG Backend
	*/
	old=null;
	this.doSVGPath=function(feature,coordinates,close){
		//if map is moving there is a delta needed. For zoom not implemented (speed)
		var deltaTop=0;
		var deltaLeft=0;
		var fx=1;
		var fy=1;
		if(feature.documentElement.element.finished){
		if(feature.documentElement.element && feature.documentElement.element.topright ){
			deltaTop=feature.documentElement.element.topright.y
			deltaLeft=feature.documentElement.element.bottomleft.x;
			var width=feature.documentElement.element.topright.x - deltaLeft;
			var height=feature.documentElement.element.bottomleft.y - deltaTop;

			var fx=width / feature.documentElement.map.size.width;
			var fy=height / feature.documentElement.map.size.height;
			old=deltaTop;

		}
		}
		var d="";
		for(var i=0;i<coordinates.length;i++){
			if(coordinates[i] instanceof khtml.maplib.geometry.LatLng){
				var xy1=this.documentElement.map.latlngToXY(coordinates[i]);
				var xy={"x":(xy1.x -deltaLeft),"y":(xy1.y -deltaTop)};
				xy.x=xy.x/fx;
				xy.y=xy.y/fy;
				if(i==0){
					d=" M"+xy.x+" "+xy.y;
				}else{
					d+=" L"+xy.x+" "+xy.y;
				}
				if(close && i==coordinates.length -1){
					d+=" z";
				}
			}else{
				d+=this.doSVGPath(feature,coordinates[i],close);
			}
		}	
		return d;

	}
	this.renderSVG=function(feature){
//		this.documentElement.element.finished=false;
		if(feature.geometry.type=="Point")return;
		var close=false;
		if(feature.geometry.type=="LinearRing" || feature.geometry.type=="Polygon" || feature.geometry.type=="MultiPolygon"){
			close=true;
		}
		var d=this.doSVGPath(feature,feature.geometry.coordinates,close);
		/*
		if(this.element && this.element.parentNode!=this.documentElement.element){
			//this.element.parentNode.removeChild(this.element);
			//delete this.element;
			//this.doc
			this.parentNode.element.appendChild(this.element);
		}
		*/
		if(!this.element){
			this.element=document.createElementNS("http://www.w3.org/2000/svg","path");
			this.element.feature=feature;
			this.parentNode.element.appendChild(this.element);  
			for(var e=0;e<feature.events.length;e++){
				var ev=feature.events[e];
				khtml.maplib.base.helpers.eventAttach(this.element,ev.eventType,ev.method,ev.context,ev.bubble);
			}

		}
		this.element.setAttribute("d",d);
		if(feature.geometry.type=="Polygon" || feature.geometry.type=="MultiPolygon"){
			this.element.setAttribute("fill-rule","evenodd");
		}else{
			if(!this.style)this.style=new Object;
			this.style.fill="none";
		}
		for(var s in this.style){
			try{
			this.element.style[s]=this.style[s];
			}catch(e){} //opera throws strange bug
		}
		this.style=this.element.style;

		
//		if(feature.className && feature.className.baseVal){
			this.element.className.baseVal=feature.className.baseVal;
//		}	
		if(typeof(this.display)!="undefined"){
			this.element.style.display=this.display;
		}else{
			this.element.style.display="";
		}
	}
  
  /**
  VML Backend  
There is not opimization on VML rendering. It's not tested very well and I think there are some bugs.
  */  
  
  
  this.doVMLPath=function(feature,coordinates,close){
		//if map is moving there is a delta needed. For zoom not implemented (speed)
    /* IE is dead - I don't support zombies.
		var deltaTop=0;
		var deltaLeft=0;
    
		var fx=1;
		var fy=1;
		if(feature.documentElement.element.finished){
		if(feature.documentElement.element && feature.documentElement.element.topright ){
			deltaTop=feature.documentElement.element.topright.y
			deltaLeft=feature.documentElement.element.bottomleft.x;
			var width=feature.documentElement.element.topright.x - deltaLeft;
			var height=feature.documentElement.element.bottomleft.y - deltaTop;

			var fx=width / feature.documentElement.map.size.width;
			var fy=height / feature.documentElement.map.size.height;
			old=deltaTop;

		}
		}
    */
    
		var d="";
		for(var i=0;i<coordinates.length;i++){
			if(coordinates[i] instanceof khtml.maplib.geometry.LatLng){
				var xy=this.documentElement.map.latlngToXY(coordinates[i]);
				//var xy={"x":(xy1.x -deltaLeft),"y":(xy1.y -deltaTop)};
				//xy.x=Math.round(xy.x/fx);
				//xy.y=Math.round(xy.y/fy);
				if(i==0){
					d=" "+xy.x+","+xy.y;
          }else{
					d+=" "+xy.x+","+xy.y;
				}
				if(close && i==coordinates.length -1){
					var xy=this.documentElement.map.latlngToXY(coordinates[0]);
          d+=" "+xy.x+","+xy.y;
				}
			}else{
				d+=this.doVMLPath(feature,coordinates[i],close);
			}
		}	
		return d;

	}
  
  
  
  this.renderVML=function(feature){
    if(feature.geometry.type=="Point")return;
		var close=false;
		if(feature.geometry.type=="LinearRing" || feature.geometry.type=="Polygon" || feature.geometry.type=="MultiPolygon"){
			close=true;
		}
		var d=this.doVMLPath(feature,feature.geometry.coordinates,close);
    
    if(!this.element){
      this.element = document.createElement("v:polyline");
      this.fillEl = document.createElement("v:fill");
      this.element.appendChild(this.fillEl);
      this.strokeEl = document.createElement("v:stroke");
      this.element.appendChild(this.strokeEl);
      this.element.style.position="absolute";
			this.element.feature=feature;
			this.documentElement.element.appendChild(this.element);  
      /*
			for(var e=0;e<feature.events.length;e++){
				var ev=feature.events[e];
				khtml.maplib.base.helpers.eventAttach(this.element,ev.eventType,ev.method,ev.context,ev.bubble);
			}
      */
		}
    //if(close)this.element.filled=true;
		//this.element.setAttribute("points",d +" x e");
    //this.element.points.value=d +" x e";

        this.element.points.value=d +" x e";
        //console.log("2222",this.element.points.value);

    


  
		var style=this.documentElement.canvasStyler.makeCanvasStyle(feature);
    this.element.setAttribute("fillcolor",style.fillRGB);
		this.element.setAttribute("strokecolor",style.strokeRGB);
    this.element.setAttribute("strokeweight", style.lineWidth + "px");
    //console.log(style.fillOpacity);

    if (document.documentMode==8) {
      this.element.fillcolor=style.fillRGB;
      this.element.strokecolor=style.strokeRGB;
      this.element.stokeweight=style.lineWidth;
      this.fillEl.opacity=style.fillOpacity;
      this.strokeEl.opacity=style.strokeOpacity;
    }else{
      this.element.setAttribute("fillcolor",style.fillRGB);
      this.element.setAttribute("strokecolor",style.strokeRGB);
      this.element.setAttribute("strokeweight", style.lineWidth + "px");
      this.fillEl.setAttribute("opacity",style.fillOpacity);
      this.strokeEl.setAttribute("opacity",style.strokeOpacity);
    }



  }
  
  
  

	/**
	Canvas Backend
	*/

	this.doCanvasPath=function(type,context,coordinates,close,depth,num){
		var direct=false;
		if(!depth)depth=0;
		if(!num)num=0;
		if(type=="Polygon" && depth >0 && num >0){
		//	context.globalCompositeOperation="source-out";  //sorry not working - please feel free to repair
		 }else{
			context.globalCompositeOperation="destination-over";
		}
                for(var i=0;i<coordinates.length;i++){
                        if(coordinates[i] instanceof khtml.maplib.geometry.LatLng){
                                var xy=this.documentElement.map.latlngToXY(coordinates[i]);
				var movedXY=new Object;
				movedXY.x=xy.x -this.documentElement.deltaX;
				movedXY.y=xy.y -this.documentElement.deltaY;
                                if(i==0){
					context.moveTo(movedXY.x, movedXY.y);
                                }else{
					context.lineTo(movedXY.x, movedXY.y);
                                }
                                if(close && i==coordinates.length -1){
					xy=this.documentElement.map.latlngToXY(coordinates[0]);
					context.lineTo(xy.x, xy.y);
                                }
                        }else{
                                this.doCanvasPath(type,context,coordinates[i],close,depth+1,i);
                        }
                }

	}

	this.renderCanvas=function(feature){
		if(feature.geometry.type=="Point")return;
		//try{
		if(!feature.canvasStyle){
			var style=this.documentElement.canvasStyler.makeCanvasStyle(feature);
			feature.canvasStyle=style;
		}

                var close=false;
                if(feature.geometry.type=="LinearRing" || feature.geometry.type=="Polygon" || feature.geometry.type=="MultiPolygon"){
                        close=true;
                }
		var context=this.documentElement.context;

		context.beginPath();
		for(var s in feature.canvasStyle){
			context[s]=feature.canvasStyle[s];
		}
                this.doCanvasPath(feature.geometry.type,context,feature.geometry.coordinates,close);
	
		context.stroke();
		context.fill();

	}
	if(parentNode){
		this.init(parentNode);
	}

	/**
	Not in use anymore
	moved to helpers
	*/

        function reduce(origObj,depth){
		//this array should go to an other place. It's also not complete.
                var good=["type","features","coordinates","style","className","baseVal","geometry","fill","stroke","strokeWidth","opacity","fillOpacity","strokeOpacity","dashArray","marker"];
                if(origObj instanceof khtml.maplib.geometry.LatLng){
                        return [origObj.lng(),origObj.lat()];
                }
                if(!depth)depth=0;
                if(depth >15)return;
                var retObj=new Object;
                if(typeof(origObj)=="string"){
                        return origObj;
                }
                if(origObj instanceof Array){
                        var ar=new Array();
                        for(var i=0;i<origObj.length;i++){
                                ar[i]=reduce(origObj[i],depth+1);
                        }
                        return ar;
                }
                if(origObj instanceof CSSStyleDeclaration){
                        var styleProperty=new Object;
                        for(var i=0;i<origObj.length;i++){
                                var name=origObj[i];
                                var value=origObj[origObj[i]];
                                styleProperty[name]=value;
                                //var styleProperty={origObj[i]:origObj[origObj[i]]};
                        }
                        return styleProperty;
                }
                for(var o in origObj){
                        var skip=true;
                        for(var i=0;i<good.length;i++){
                                if(good[i]==o ){
                                        skip=false;
                                        break;
                                }
                        }
                        if(skip)continue;
                        if(typeof(origObj[o])=="string"){
                                retObj[o]=origObj[o];
                        }else{
                                retObj[o]=reduce(origObj[o],depth+1);
                        }
                }
                return retObj;
        }
	
	/**
	Remove Methods,... to make transfer and storable able (JSON)
	*/

	this.toJSON=function(){
		var json=khtml.maplib.base.helpers.reduceToJSON(this);
		return json;
	}

}
