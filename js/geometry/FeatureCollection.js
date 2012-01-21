
/**
This will be moved to the geometry directory
*/

khtml.maplib.geometry.FeatureCollection=function(feature,parentNode){
	this.type="FeatureCollection";
	this.style=new Object;
	this.className=new Object;
	if(parentNode){
		this.parentNode=parentNode;
		if(!parentNode.documentElement){
			this.documentElement=parentNode;
		}else{
			this.documentElement=this.parentNode.documentElement;
		}
		this.map=this.parentNode.map;
		//this.backend=this.parentNode.backend;
		if(this.parentNode.context)this.context=this.parentNode.context;
		if(this.documentElement.backend=="svg"){
			this.element=document.createElementNS("http://www.w3.org/2000/svg","g");
			if(this.parentNode.element){
				this.parentNode.element.appendChild(this.element);
			}
		}
	}
	if(!this.features){
		this.features=new Array();
		this.childNodes=this.features;
	}
	if(this.documentElement && this.documentElement.backend=="svg"){
		if(feature.style){
			for(var s in feature.style){
				this.style[s]=feature.style[s];
			}
		}
		this.style=this.element.style;
		this.className=this.element.className;
		if(feature.className){
			this.className.baseVal=feature.className.baseVal;
		}
	}
	if(feature){
		this.properties=feature.properties;
	}

	this.init=function(parentNode){
		if(this.backend=="svg"){
			if(!this.element){
				this.element=document.createElementNS("http://www.w3.org/2000/svg","g");
				this.style=this.element.style;
				this.style.fill="green"
			}
			parentNode.element.appendChild(this.element);
		}
		this.parentNode=parentNode
		this.documentElement=this.parentNode.documentElement;

		if(!feature)feature=this;
		if(feature.features){
			for(var i=0;i<feature.features.length;i++){
				var f=feature.features[i];
				//if(!f.geometry || f.geometry.type!="PPoint"){
					this.appendChild(feature.features[i]);
				//}
			}
		}


	}
	/**
	API Sytax stolen from: DOM 2 Core http://www.w3.org/TR/DOM-Level-2-Core/core.html
	*/
	this.appendChild=function(newFeature){
		var exists=false;
		if(!newFeature.element && !newFeature.mmarker){   //mmarker - bad name
			if(newFeature.render){
				newFeature.parentNode=this;
				newFeature.documentElement=this.documentElement;
			}else{
				newFeature=new khtml.maplib.geometry.Feature(newFeature,this);
			}
		}else{
		    exists=true;
			console.log("zzz",newFeature);
		    for(var i=0;i<newFeature.parentNode.features.length;i++){
                        if(newFeature.parentNode.features[i]==newFeature){
				if(this==newFeature.parentNode && i==newFeature.parentNode.features.length -1){
					//already at last position
					return newFeature;
				}
				newFeature.parentNode.features.splice(i,1);
				if(newFeature.element){
					this.element.appendChild(newFeature.element);
				}
				break;
			}
		    }

		}
		this.features.push(newFeature);
		if(this.documentElement){
			newFeature.documentElement=this.documentElement;
			this.documentElement.recurseLinksDirty=true;
		}
		newFeature.parentNode=this;
		if(!exists){
			newFeature.init(this);
		}
		//init childnode
		/*
		if(newFeature.features){
			for(var i=0;i<newFeature.features.length;i++){
				if((!newFeature.features[i].documentElement) && newFeature.features[i].init){
				//	newFeature.features[i].init(newFeature);
				}
			}
		}
		*/
		//this.makeBounds();  //too slow
		newFeature.render();
		return newFeature;
	}

	/**
	API Sytax stolen from: DOM 2 Core http://www.w3.org/TR/DOM-Level-2-Core/core.html
	*/
	this.insertBefore=function(newFeature,refFeature){
		var exists=false;
		var numDelete=0;
		if(!refFeature){
			if(this.features[0]){
				refFeature=this.features[0];
			}else{
				this.appendChild(newFeature);
				return false;
			}
		}
		if(newFeature==refFeature)return newFeature; //already at correct position
		if(!newFeature.element && !newFeature.marker){
			newFeature=new khtml.maplib.geometry.Feature(newFeature);
		}else{
			exists=true;
			if(newFeature.parentNode){
			for(var i=0;i<newFeature.parentNode.features.length;i++){
				if(newFeature.parentNode.features[i]==newFeature){
					newFeature.parentNode.features.splice(i,1);
					break;
				}
			}
			}
		}
		for(var i=0;i<this.features.length;i++){
			if(this.features[i]==refFeature){
				this.features.splice(i,0,newFeature);
				if(newFeature.element){	
					this.element.insertBefore(newFeature.element,refFeature.element);
				}
				break;
			}
		}
		this.documentElement.recurseLinksDirty=true;
		newFeature.parentNode=this;
		if(!exists){
			newFeature.init(this);
		}
		newFeature.render();
		this.makeBounds();

		return newFeature;
	}

	/**
	API Sytax stolen from: DOM 2 Core http://www.w3.org/TR/DOM-Level-2-Core/core.html
	*/
	this.removeChild=function(f){
		if(f.mmarker){
			f.mmarker.destroy();	
		}
		for(var i=0;i<this.features.length;i++){
			if(this.features[i]==f){
				if(this.features[i].preceding){
					this.features[i].preceding.following=this.features[i].following;
				}
				if(this.features[i].following){
					this.features[i].following.preceding=this.features[i].preceding;
				}
				/*
				try{
				this.removeChild(this.features[i]);
				}catch(e){}
				*/

				try{
				this.element.removeChild(this.features[i].element);
				}catch(e){
					//console.log(e.message);
				}
				this.features.splice(i,1);
				break;
			}
		}
		if(this.documentElement.backend=="canvas"){
			this.documentElement.render(true);
		}
		
	}

	/**
	API Sytax stolen from: DOM 2 Core http://www.w3.org/TR/DOM-Level-2-Core/core.html
	*/
	this.replaceChild=function(newChild,oldChild){
		var newFeature=this.insertBefore(newChild,oldChild);
		this.removeChild(oldChild);
		return newFeature;
	}
	/* not in use */
	this.render=function(){
//		console.log(this.element.parentNode.parentNode.parentNode);
		/*
		for(var i=0;i<this.features.length;i++){
			this.features[i].render();
		}	
		*/
	}

	/**
	Serialize to JSON
	*/
	this.toJSON=function(){
		var json=khtml.maplib.base.helpers.reduceToJSON(this);
		return json;
	}

	/**
	repaire bounding box (slow)
	*/
	this.makeBounds=function(){
		this.bbox=null;
		for(var i=0;i<this.features.length;i++){
			if(this.features[i].makeBounds){
				if(this.features[i].bbox){
					var bbox=this.features[i].bbox;
				}else{
					var bbox=this.features[i].makeBounds();
				}
				this.bbox=khtml.maplib.base.helpers.extendBBox(this.bbox,bbox);
			}
		}
		return this.bbox;	
	}
}



