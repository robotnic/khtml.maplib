

khtml.maplib.overlay.FeatureCollection = function() {
	this.type="Feature";
	this.className="";
	this.realLayer=false;  //true -> only one vector element
	this.properties=new Object;
	this.geometry=new Object;
	this.geometry.type="FeatureCollection";
	this.features=new Array();
	this.overlayDiv=document.createElement("div");
	this.overlayDiv.setAttribute("kazalabas","eluag");
	this.style=this.overlayDiv.style;
	this.className=this.overlayDiv.className;
//	this.overlaySVG=new khtml.maplib.overlay.Vector();
	this.init=function(owner){
		this.owner=owner;
		if(owner instanceof khtml.maplib.base.Map){
			this.map=owner;
			this.map.overlayDiv.appendChild(this.overlayDiv);	
		}else{
			if(owner.map){
				this.map=owner.map;
				this.owner.overlayDiv.appendChild(this.overlayDiv);
			}else{
				return;
			}
		}
		this.makeVectorLayer();
		//for(var i=0;i<this.features.length;i++){
		for(var i in this.features){
			if(!this.features[i].map){
				var el=this.features[i];		
				if(el.type=="Marker"){
					el.init(this);
				}else{
					if(el.geometry.type=="FeatureCollection" || el.geometry.type=="GroundOverlay"){
						el.init(this);
					}else{
						this.vectorLayer.createPolyline(el);
						this.vectorLayer.render(el);
					}
				}
			}else{
			}
			this.extendBBox(el);
		}			
		if(this.owner && this.owner.extendBBox){
			this.owner.extendBBox(this);
		}
	}
	this.makeVectorLayer=function(){
		if(this.vectorLayer)return;
		if(this.owner){
			if(this.owner.vectorLayer && !this.realLayer){
				this.vectorLayer=this.owner.vectorLayer;
			}else{
				this.vectorLayer=new khtml.maplib.overlay.Vector();
				if(this.map){
					this.vectorLayer.init(this);
				}
			}
		}
	}
	this.oldStyleDisplay=null;
	this.render=function(){
		if(!this.overlayDiv.parentNode){
			this.owner.overlayDiv.appendChild(this.overlayDiv);
		}
		for(var i=0; i<this.features.length;i++){	
			if(!this.features[i]) continue;
			if(this.features[i].geometry.type=="Point"){
				this.features[i].render();
			}
			if(this.features[i].geometry.type=="FeatureCollection"){
				this.features[i].render();	
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
		this.owner.overlayDiv.removeChild(this.overlayDiv);
		//return;
		//console.log(this.oldStyleDisplay);
		if(this.oldStyleDisplay==null){
			this.oldStyleDisplay=this.style.display;
			this.style.display="none";
		}
		//console.log("layer clear");
		for(var i=0; i< this.features.length;i++){
			//console.log("clear");
			if(this.features[i].type=="Marker"){
				this.features[i].clear();
			}
			if(this.features[i].geometry.type=="FeatureCollection" && !this.realLayer){
				this.features[i].clear();	
			}	
		}
		/*
		if(this.realLayer){
			if(this.backend=="canvas"){
			this.vectorLayer.clear();
			}
		}
		*/
	}
	this.removeChild=function(el){
		for(var f in this.features){
			if(this.features[f]==el){
				this.features.splice(f,1);	
			}
		}
		this.render();
	}
	this.appendChild=function(el){
		this.features.push(el);
		if(!el.geometry)return;
		if(el.geometry.type!=="Point" && el.geometry.type!=="FeatureCollection"&& el.geometry.type!=="GroundOverlay"){
			if(this.vectorLayer){  //if owner is initialized
				this.vectorLayer.createPolyline(el);
				this.vectorLayer.render(el);
			}
			//return;
		}else{
			el.owner=this;
			if(el.owner.map){
				el.init(this);
				el.render();
			}else{
				//console.log("noch nix map");
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
		this.bbox=khtml.maplib.base.helpers.extendBBox(this.bbox,bbox);
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
