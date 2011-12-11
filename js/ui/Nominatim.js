/**
Search with nominatim
*/

khtml.maplib.ui.Nominatim=function(){
	this.width=300;
	this.height=200;
	this.init=function(map){
		this.map=map;
		this.div=this.createWindow();
	}
	this.render=function(){
	//nothing to do
	}
	var that=this;
	this.keyup=function(evt){
		var searchText=that.input.value;
		if(searchText.length <=2){
			while(that.div.firstChild){
				that.div.removeChild(that.div.firstChild);
			}
			return;
		}
		var url="http://nominatim.openstreetmap.org/search?q="+searchText+"&format=json&polygon=1&addressdetails=1&json_callback=searchResult";
		if(this.scriptElement){
			if(this.scriptElement.parentNode){
				this.scriptElement.parentNode.removeChild(this.scriptElement);
			}
		}
		this.ajaxload.style.display="";
		this.scriptElement=khtml.maplib.util.scriptTagProxy(url,that.showResult);
	}
	this.focus=function(){
		this.input.value="";
		this.input.style.color="black";
	}
	this.showResult=function(r){
		that.ajaxload.style.display="none";
		that.div.style.display="";
		while(that.div.firstChild){
			that.div.removeChild(that.div.firstChild);
		}
		for(var i=0; i< r.length;i++){
			var found=r[i];
			var div=document.createElement("div");
			var tn=document.createTextNode(found.display_name);
			div.appendChild(tn);
			div.style.fontSize="12px";
			div.style.width="1200px";
			div.style.cursor="pointer";
			that.div.appendChild(div);
			khtml.maplib.base.helpers.eventAttach(div,"mouseover",that.highlight,div,false);
			khtml.maplib.base.helpers.eventAttach(div,"mouseout",that.lowlight,div,false);
			khtml.maplib.base.helpers.eventAttach(div,"mousedown",that.select,found,false);
		}
	}
	this.hideResult=function(){
		var tempFunc=function(){
		that.div.style.display="none";
		}
		this.timeout=setTimeout(tempFunc,1000);
	}
	this.unhideResult=function(){
		that.div.style.display="";
		clearTimeout(this.timeout);
	}

	this.highlight=function(){
		this.style.backgroundColor="yellow";
	}
	this.lowlight=function(){
		this.style.backgroundColor="";
	}
	this.select=function(){
		var sw=new khtml.maplib.LatLng(this.boundingbox[0],this.boundingbox[2]);
		var ne=new khtml.maplib.LatLng(this.boundingbox[1],this.boundingbox[3]);
		var bounds=new khtml.maplib.geometry.Bounds(sw,ne);
		that.map.bounds(bounds);
		that.div.style.display="none";

		that.showPoly(this.polygonpoints);
	}
	this.showPoly=function(coordinates){
		if(this.poly){
			this.map.featureCollection.removeChild(this.poly);
		}
		this.poly=new khtml.maplib.geometry.Feature({type:"LineString",coordinates:coordinates});
		this.poly.style.fill="none";
		this.poly.style.stroke="red";
		this.poly.style.strokeWidth="4";
		this.map.featureCollection.appendChild(this.poly);
	}
	this.createWindow=function(){
		var win=document.createElement("div");
		this.ajaxload=document.createElement("img");
		this.ajaxload.setAttribute("src",khtml.maplib.base.helpers.ajaxload);
		this.ajaxload.style.display="none";

		this.input=document.createElement("input");
		this.input.style.width="300px";
		this.input.style.height="20px";
		this.input.style.border="1px solid black";
		this.input.style.color="lightgrey";
		this.input.value="nominatim search";
		win.appendChild(this.input);
		win.appendChild(this.ajaxload);
		khtml.maplib.base.helpers.eventAttach(this.input,"keyup",this.keyup,this,false);
		khtml.maplib.base.helpers.eventAttach(this.input,"focus",this.focus,this,false);


		var div=document.createElement("div");
		win.style.position="absolute";
		div.style.width=this.width+"px";
		//div.style.height=this.height+"px";
		var x=this.map.size.left;
		var y=this.map.size.top;
		win.style.top=y+"px";
		win.style.left=x+"px";
		div.style.border="1px solid lightgrey";
		div.style.backgroundColor="white";
		div.style.opacity=0.8;
		div.style.display="none";
		div.style.overflow="hidden";

		div.style.borderBottomRightRadius="10px";
		div.style.borderBottomLeftRadius="10px";
		div.style.boxShadow="1px 1px 15px #ccc";
		khtml.maplib.base.helpers.eventAttach(win,"mouseout",this.hideResult,this,false);
		khtml.maplib.base.helpers.eventAttach(win,"mouseover",this.unhideResult,this,false);

		win.appendChild(div);
		this.map.mapParent.parentNode.appendChild(win);
		return div;	
	}

}
