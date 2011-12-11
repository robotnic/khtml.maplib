

khtml.maplib.overlay.FeatureCollection = function() {
	this.type="Feature";
	this.className=new Object;
	this.realLayer=false;  //true -> only one vector element
	this.properties=new Object;
	this.geometry=new Object;
	this.geometry.type="FeatureCollection";
	this.features=new Array();
	this.childNodes=this.features; //dom way to access
	this.overlayDiv=document.createElement("div");
	this.overlayDiv.setAttribute("kazalabas","eluag");
	this.style=new Object;
	//this.backend="svg";
	//this.className=this.overlayDiv.className;
//	this.overlaySVG=new khtml.maplib.overlay.Vector();
	this.init=function(owner){
		this.owner=owner;
		this.parentNode=this.owner; //dom style accessing
		if(owner instanceof khtml.maplib.base.Map){
			this.map=owner;
			if(!this.overlayDiv.parentNode){
			this.map.overlayDiv.appendChild(this.overlayDiv);	
			}
		}else{
			if(owner.map){
				this.map=owner.map;
				if(!this.overlayDiv.parentNode){
				this.owner.overlayDiv.appendChild(this.overlayDiv);
				}
			}else{
				return;
			}
		}
		//if(!this.owner.backend)this.backend=this.owner.backend;
		//if(!this.backend)this.backend="canvas";
		if(this.owner && this.owner.backend){
			this.backend=this.owner.backend;
		}
		this.vectorEl=this.makeVectorLayer(this.backend);
		//for(var i=0;i<this.features.length;i++){
		for(var i in this.features){
			if(!this.features[i].map){
				var el=this.features[i];		

				if(el.type=="SimpleMarker" || el.type=="Marker"){
					el.init(this);
				}else{
					if(el.geometry.type=="FeatureCollection" || el.geometry.type=="GroundOverlay"){
						el.init(this);
						el.render();
					}else{
						this.vectorLayer.createPolyline(el);
						this.vectorLayer.render(el);
					}
				}
				this.extendBBox(el);
			}
		}			
		if(this.owner && this.owner.extendBBox){
			this.owner.extendBBox(this);
		}
	}
	this.makeVectorLayer=function(){
		if(this.vectorLayer)return;
		if(this.owner){
				//this.vectorLayer=this.owner.vectorLayer;
				this.vectorLayer=new khtml.maplib.overlay.Vector(this.backend);
				if(this.map){
					if(this.owner.vectorLayer && !this.realLayer){
						vectorEl=this.vectorLayer.init(this,this.owner);  //g layer for css and fast rendering
					}else{
						vectorEl=this.vectorLayer.init(this); //svg, canvas, vml element
					}
					for(var p in this.style){
						var prop=this.style[p];
						if(this.vectorLayer.backend!="canvas"){
							vectorEl.style[p]=prop;
						}
					}
					if(this.vectorLayer.backend!="canvas"){
						this.style=vectorEl.style;  //inherit css
					}
				}
		}
		return vectorEl;
	}
	this.renderbackend=function(backend){
		if(this.vectorLayer){
			this.vectorLayer.remove();
		}
		this.owner.backend=backend;
		/*
		for(var i=0; i<this.features.length;i++){	
			if(this.features[i].renderbackend){
				this.features[i].renderbackend(backend);	
			}
		}
		*/
		this.init(this.owner);
	}
	this.oldStyleDisplay=null;
	this.render=function(){
		if(!this.overlayDiv.parentNode){
			//this.owner.overlayDiv.appendChild(this.overlayDiv);
		}
		if(this.vectorLayer.backend=="canvas" && this.realLayer){
			this.vectorLayer.clear();
		}
		if(this.vectorLayer.backend=="vml" && this.realLayer){
			this.vectorLayer.clear();
		}
		for(var i=0; i<this.features.length;i++){	
			if(!this.features[i]) continue;
			if(this.features[i].geometry.type=="Point"){
				this.features[i].render();
			}
			if(this.features[i].geometry.type=="FeatureCollection"){
				this.features[i].render();	//maybe not nessessary. GroundOverlay does not work without
			}	
			if(this.features[i].geometry.type=="GroundOverlay"){
				this.features[i].render();	
			}	
		}	
		if(this.vectorLayer){
			this.vectorLayer.render();
		}
		if(this.oldStyleDisplay!=null){
			this.style.display=this.oldStyleDisplay;
		}
		this.oldStyleDisplay=null;

	}	
	this.clear=function(){
//		this.owner.overlayDiv.removeChild(this.overlayDiv);
		if(this.oldStyleDisplay==null){
			this.oldStyleDisplay=this.style.display;
			this.style.display="none";
		}
		for(var i=0; i< this.features.length;i++){
			if(this.features[i].type=="Marker"){
				this.features[i].clear();
			}
			if(this.features[i].geometry.type=="FeatureCollection" && !this.realLayer){
				this.features[i].clear();	
			}	
		}
	}
	this.removeChild=function(el){
		var found=false;
		for(var f in this.features){
			if(this.features[f]==el){
				if(this.features[f].geometry.type=="FeatureCollection"){
					for(var i=0;i<this.features[f].features.length;i++){
						var child=this.features[f].features[i];
						this.features[f].removeChild(child);
					}
					while(this.features[f].features.length >0){
						var f=this.features[f].features.pop();
					}
					
				}else{
					var la=map.featureCollection.vectorLayer.lineArray;
					for(var i=0;i<la.length;i++){
						if(la[i]==el){
							la.splice(i,1);
						}
					}
					el.clear();
				
				}
				this.features.splice(f,1);	
				found=true;
			}
		}
		if(found){
			delete el.owner;
			if(this.owner){
				this.render();
			}
			return true;
		}else{
			return false;
		}
	}
	this.appendChild=function(el){
		if(el.owner){
			var r=el.owner.removeChild(el);
		}
		this.features.push(el);
		if(!el.geometry)return;
		el.owner=this;
		el.parentNode=el.owner;
		if(el.geometry.type!=="Point" && el.geometry.type!=="FeatureCollection"&& el.geometry.type!=="GroundOverlay"){
			if(this.vectorLayer){  //if owner is initialized
				this.vectorLayer.createPolyline(el);
				this.vectorLayer.render(el);
			}
		}else{
			if(el.owner.map){
				el.init(this);
				el.render();
			}else{
			
			}
		}
		
		this.extendBBox(el);
		if(this.owner && this.owner.extendBBox){
			this.owner.extendBBox(el);
		}
	}
	this.extendBBox=function(el){
		if(el.point){
			var bbox=el.point;
		}else{
			var bbox=el.bbox;
		}
		if(!bbox)return;
		this.bbox=khtml.maplib.base.helpers.extendBBox(bbox,this.bbox);
		return;


		if(this.bbox){
			this.bbox=khtml.maplib.base.helpers.extendBBox(this.bbox,el);
		}else{
			if(el.bbox){
				this.bbox=el.bbox;
			}else{
				if(el.geometry.coordinates instanceof khtml.maplib.LatLng){  //node, Marker, Point
					this.bbox=new khtml.maplib.geometry.Bounds(el.geometry.coordinates,el.geometry.coordinates);
				}
			}
		}
	}
}
