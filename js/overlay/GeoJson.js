/**
This is the  speed optimaced Vector and Marker API.
The API is geojson + css based and provides a simple but compelete Interface for Markers and Vectors an Map.
It prevents browser stall and is able to use SVG, Canvas und VML as Backend.

This API is dicussed here:
http://wiki.openstreetmap.org/wiki/Overlay_API

API Syntax documentElement vs. ownerElement


*/


khtml.maplib.overlay.GeoJson = function() {
	this.backend="svg";
	this.count=0;
	this.deltaX=0;
	this.deltaY=0;


	/**
	Constructor:
	This function is called at the end of this class.
	*/		
	
	this.init=function(map){
		this.map=map;
		if(this.root)this.root.parentNode.removeChild(this.root);
		if(this.element){	
			this.element.parentNode.removeChild(this.element);
			delete this.element;
		}
		this.root=document.createElement("div");
		this.root.style.position="absolute";
		this.root.setAttribute("GeoJson","root");  //to be visual in debugger tree view
		this.root.setAttribute("id","root");  //to be visual in debugger tree view
		this.map.overlayDiv.appendChild(this.root);
		this.load({"type":"FeatureCollection"});
	}

	/**
	load not good, make it part of init
	*/

	this.load=function(featureCollection){
		if(!this.element){
			this.element=this.renderElement(this.root);
			if(this.backend=="canvas"){
				this.context=this.element.getContext('2d');
				this.canvasStyler=new khtml.maplib.overlay.renderer.Styler();
			}
		}
		//this.documentElement=this.element;
		this.featureCollection=this.recurseInit(featureCollection);
		this.parentNode=this.featureCollection;
		this.recurseLinksDirty=true //this.featureCollection);
	}
	this.lastzoom=null;  //rename to previousZoomLevel

	this.bounds=null;

	/**
	Start the rendering Engine.
	*/
	this.render=function(force){
		if(!this.featureCollection)return;

		//builds an index
		if(this.recurseLinksDirty){
			this.recurseLink();
		}

		/*
		Fast Rendering decisson. Do full rendering or do fast move and scale.
		*/
		if(!force && (!this.map.finalDraw  || this.map.moving )){ // && this.backend=="canvas"){
				if(this.element.finished){
					this.visibleElement=this.element;
				}else{
					if(!this.oldelement)return;
					this.visibleElement=this.oldelement;
				}
				if(!this.visibleElement.bounds)return;
				this.visibleElement.style.display="";
				this.visibleElement.bottomleft=this.map.latlngToXY(this.visibleElement.bounds.sw());
				this.visibleElement.topright=this.map.latlngToXY(this.visibleElement.bounds.ne());
				var top=this.visibleElement.topright.y;
				var left=this.visibleElement.bottomleft.x;
				this.visibleElement.style.top=top+"px";
				this.visibleElement.style.left=left+"px";
				this.visibleElement.style.width=(this.visibleElement.topright.x - this.visibleElement.bottomleft.x) +"px";
				this.visibleElement.style.height=(-this.visibleElement.topright.y + this.visibleElement.bottomleft.y) +"px";
				var h=this.visibleElement.offsetLeft;  //prevend browser cheating
			return;
		}
		if(!this.element){
			//returns the rendering target
			this.element=this.renderElement();

		}

		/*
		rendering is done in a seperate thread. 
		This seperate thread is done be setTimeout tricks.
		This is the only way to intercept (kill) rendering if there is something.
		If rendering is complete, the render element will be cloned.
		*/

		if(this.element.finished){
			if(this.oldelement){
				//throw away the old, we have a new
				this.root.removeChild(this.oldelement);
			}
			if(this.backend=="canvas"){
				this.oldelement=this.element;
				this.element=this.renderElement();
			}else{
				this.oldelement=this.element.cloneNode(true);
			}
			this.root.appendChild(this.oldelement);
			this.oldelement.bounds=this.element.bounds;
			this.oldelement.style.display="";
			this.element.style.display="none";
			this.element.finished=false;
			this.element.topright=null;  //sorry tricky

			this.element.setAttribute("viewBox","0 0 "+this.map.size.width+" "+this.map.size.height);
		}

		this.element.style.top="0px";
		this.element.style.left="0px";
		//this.root.style.display="none";
		this.element.style.width=this.map.size.width+"px";
		this.element.style.height=this.map.size.height +"px";
		this.element.bounds=this.map.bounds();  
//		this.root.style.top=this.deltaY+"px";
//		this.root.style.left=this.deltaX+"px";
		this.lastzoom=this.map.zoom();
		this.clear();  //canvas only
		var base=this.featureCollection;
	
		//now the funny part starts	
		this.recurse(base,base);
		this.deltaX=0;
		this.deltaY=0;
	}
	/**
	Maybe outdated, dont use!!
	This method maybe already replace.
	*/
	this.makeGroupElements=function(fc,parent){
		fc.element=document.createElementNS("http://www.w3.org/2000/svg","g");
		fc.element.bounds=this.map.bounds();   //if g element have bounds it could render faster
		parent.appendChild(fc.element);
		for(var i=0;i<fc.features.length;i++){
			if(fc.features[i].type=="FeatureCollection"){
				this.makeGroupElements(fc.features[i],fc.element);
			}
		}
		fc.style=fc.element.style;
	}
	/**
	Switch backend on the fly.
	*/
	this.renderbackend=function(backend){
		var json=this.featureCollection.toJSON();
		this.root.removeChild(this.element);
		delete this.element;
		this.backend=backend;
		this.load(json);
		this.render(true);
	}

	/**
	Is intendet do rebuild all bbox, css things. Da full render call.
	*/
	this.draw=function(base){
		this.recurseLinksDirty=true //this.featureCollection);
		//this.init(this.map);
		this.render(true);
	}
	/**
	Not in use anymore
	*/
	this.hide=function(){
		this.root.style.display="none";
	}
	/*
	this.hide=function(){
//		this.root.style.display="none";
		if(this.backend=="svg"){
			var els=this.root.getElementsByTagName("*");
			for(var i=0;i<els.length;i++){
				if(els[i].tagName!="g" && els[i].tagName!="svg"){
				if(typeof(els[i].display)=="undefined"){
					els[i].display=els[i].style.display;
				}
				els[i].style.display="none";
				}
			}
		}else{
			this.root.style.display="none";
		}
	}
	*/
	/**
	Tricki very much
	recursion to allow interception.

	Purpose:
	To anable a responsive userinteferce, there must not be uninteruptable processes.
	*/
	this.recurse=function(feature,time){
		var that=this;
		this.busy=true;
		if(this.topright || (!this.map.doTheOverlays && !this.map.finalDraw)){
			return;
		}
		/* bremse */
		/* To simulate slow computers. For deveopter */
		/*
		for(var i=0;i<100000;i++){
			var x=document.body.offsetWidth;
		}
		*/


		/**
		Slow processes will be killed. The Sceduler need timing
		*/
		if(!time){
			var time=new Date();
			delta=0;
		}else{
			var now=new Date();
			var delta=now - time;
		}


		/*
		Render a feature an setTimout for next rendering contract.
		If you do not understand this part. Please, Please hands of here!!!
		*/

		if(feature && feature.following ){
			if(delta < 50){
				//prevent to much recursion (stack overflow);
				for(var i=0;i<100;i++){
					if(!feature)break;
					feature.render();	
					feature=feature.following;
				}
				if(feature){
					//non interceptable, but faster direct function call
					that.recurse(feature.following,time);
				}else{
					that.cleanup();
					return;
				}
			}else{
				//killable function call
				var tempFunc=function(){
					var time=new Date();
					that.recurse(feature.following,time);
				}
				setTimeout(tempFunc,0);
			}
		}else{
			that.cleanup();
		}
		//finaly do the payload
		feature.render();	
	}
	/**
	Internally used
	Rendering went well and makes some destruction work
	*/
	this.cleanup=function(){
		if(this.oldelement ){
			this.root.removeChild(this.oldelement);
			delete this.oldelement;
		}
		this.element.style.display="";
		this.element.finished=true;
		this.root.style.display="";
	}

	/**
	not in use anymore
	*/
	this.recurseInit=function(base,geojson,parentNode){
		if(!geojson)geojson=base;
		if(geojson.type=="FeatureCollection"){
			var feature=new khtml.maplib.geometry.FeatureCollection(geojson,this); //make real object from geojson
		}else{
			var feature=new khtml.maplib.geometry.Feature(geojson,this); //make real object from geojson
		}
		if(parentNode)feature.parentNode=parentNode;
		if(parentNode)feature.documentElement=parentNode.documentElement;
		if(parentNode)feature.owner=parentNode;
		if(geojson.type=="FeatureCollection"){
			if(geojson.features){
				for(var i=0;i<geojson.features.length;i++){
					var subFeature=this.recurseInit(base,geojson.features[i],feature);
					feature.features.push(subFeature);
				}
			}
		}
		return feature;
	}
	this.recurseLinksDirty=true;

	/**
	Builds index for fast access. 
	The DOM like property API is also done here

	this.last=null;
	*/

	this.recurseLink=function(base,feature,depth){
		if(!base){
			//initialize if function is called without parmeters
			this.removeLinks();
			var base=this.featureCollection;
			this.last=null;
		}
		if(!depth)depth=0; //for debug only
		if(!feature)feature=base;
		if(this.last){
			feature.preceding=this.last;
			this.last.following=feature;
		}
		this.last=feature;
		if(feature.type=="FeatureCollection"){
			for(var i=0;i<feature.features.length;i++){
				this.recurseLink(base,feature.features[i],depth+1);
				if(i==0){
					feature.features[i].precedingSibling=null;
				}
				if(i>0){
					feature.features[i].precedingSibling=feature.features[i -1];
				}
				if(i< feature.features.length-1){
					feature.features[i].followingSibling=feature.features[i +1];
				}
				if(i== feature.features.length-1){
					feature.features[i].followingSibling=null;
				}
			}
			if(feature.features[0]){
				feature.firstChild=feature.features[0];
				feature.lastChild=feature.features[feature.features.length -1];
			}
		}
		if(depth==0){
			//finished
			this.recurseLinksDirty=false;
		}
	}
	/**
	Clear index 
	*/
	this.removeLinks=function(feature){
		if(!feature)feature=this.featureCollection;
		if(feature.features){
		for(var i=0;i<feature.features.length;i++){
			this.removeLinks(feature.features[i]);
		}
		}
		feature.following=null;
		feature.preceding=null;
		feature.followingSibling=null;
		feature.precedingSibling=null;
	}
	/**
	Not in use anymore
	*/
	this.initFeature=function(feature){
		var featureObject=new khtml.maplib.geometry.Feature(feature);
		return featureObject;
	}
	/**
	For write only interface, clear blackboard
	*/
	this.clear=function(){
		if(this.backend=="canvas"){
			//this.context.clearRect(0,0,this.map.size.width,this.map.size.height);
		}
	}
	/**
	Do the base rendering elements dependent on backend. 
	A CSS based Print interface would be the cooles of all things.
	*/
	this.renderElement=function(){
		switch(this.backend){
			case "svg":
				var element=document.createElementNS("http://www.w3.org/2000/svg","svg");
				element.style.height=this.map.size.height+"px";
				element.style.width=this.map.size.width+"px";
				element.style.position="absolute";
				element.style.top="0px";
				element.style.left="0px";
				element.setAttribute("viewBox","0 0 "+this.map.size.width+" "+this.map.size.height);
				this.root.appendChild(element);
				return element;
				break;
			case "canvas":
				var canvas=document.createElement("canvas");
				canvas.style.height=this.map.size.height+"px";
				canvas.style.width=this.map.size.width+"px";
				canvas.setAttribute("height",this.map.size.height);
				canvas.setAttribute("width",this.map.size.width);
				canvas.style.position="absolute";
				canvas.style.top="0px";
				canvas.style.left="0px";
				this.context=canvas.getContext('2d');
				this.root.appendChild(canvas);
				return canvas;
				break;
			case "vml":
				//not implemented
				break;
			default:
				console.log("not implemented");
		}
	}
}

