function VectorEditor(featureCollection){
	//this.line=makeLine();
	this.editLines=new Array();
	this.editMarkers=new Array();
	var that=this;
	this.featureCollection=featureCollection;
	this.mode="none";

	this.init=function(map){
		this.map=map;
		this.mapdiv=this.map.mapParent;

		this.editlayer=map.featureCollection.appendChild({type:"FeatureCollection"});
		this.downEvent=khtml.maplib.base.helpers.eventAttach(this.mapdiv, "mousedown", this.down, this, false);
		this.moveEvent=khtml.maplib.base.helpers.eventAttach(this.mapdiv, "mousemove", this.move, this, false);
		this.upEvent=khtml.maplib.base.helpers.eventAttach(this.mapdiv, "mouseup", this.up, this, true);
		this.keyEvent=khtml.maplib.base.helpers.eventAttach(window,"keydown",this.keydown,this,true);
	}
	this.render=function(){


	}
	this.keydown=function(evt){
		if(evt.keyCode==27){
			this.mode="none";
			this.stopedit();
		}
		if(evt.keyCode==46){
			this.stopedit();
			this.mode="none";
			this.line.parentNode.removeChild(this.line);
		}
	}

	this.down=function(evt){
		switch(this.mode){

			case "none":
				if(evt.target.feature){
					this.line=evt.target.feature;
					this.mode="edit";
					this.startedit(this.line.geometry.coordinates,this.line.geometry.type);
				}else{
					this.line=this.createLine(evt);
					this.mode="append";
					this.addPoint();
				}
				break;
			case "edit":
				if(evt.target.feature){
					if(evt.target.feature && evt.target.feature.editline){
						this.insertPoint(evt);
					}else if(evt.target.feature.mmarker){

					}else{
						this.stopedit();
						this.line=evt.target.feature;
						
						this.startedit(this.line.geometry.coordinates,this.line.geometry.type);
					}
				}else{
					this.stopedit();
					this.mode="none";
				
				}
				break;
			case "append":
				if(this.stopAppend(evt)){
					this.mode="none";
				}else{	
					this.addPoint();
				}
				break;
		}	
	}
	this.move=function(evt){

	}
	this.up=function(evt){

	}
/*
	this.lineOnCursor=function(evt){
		if(this.mode=="append"){
			var p=this.map.mouseToLatLng(evt);
			if(this.editMarkers.length >0){
				var end=this.editMarkers[this.editMarkers.length -1];
				end.point.lat(p.lat());
				end.point.lng(p.lng());
				end.render();
				this.line.render();
			}
		}
	}
*/

	this.addPoint=function(evt){
		var p2=map.mouseToLatLng(evt);
		if(this.line.geometry.coordinates.length >0){
			var p1=this.line.geometry.coordinates[this.line.geometry.coordinates.length -1];
			this.line.geometry.coordinates.push(p2);
			var l=this.makeLine(p1,p2,this.line.geometry.coordinates.length);
			l.style.stroke="green";
			if(!line.parentNode){
				this.editlayer.appendChild(line);
			}
			this.line.render();
		}
		this.doMarker(p2,true);
		
	}

	
	this.draw=function(){
		//that.line.repairBBox(true);
		that.line.render();
	}
	this.insertPoint=function(evt){
		var p=that.map.mouseToLatLng(evt);
		var editline=evt.target.feature;
		var editindex=editline.editindex;
		that.line.geometry.coordinates.splice(editindex+1,0,p);

		editline.geometry.coordinates[0]=p;
		editline.render();
		p.addCallbackFunction(editline.render);
		that.doMarker(p,true);

		var addedLine=that.makeLine(that.line.geometry.coordinates[editindex],p,editindex );
		
	}
	this.showNum=function(){
	}
	this.makeLine=function(p1,p2,i){
		var editline=this.editlayer.appendChild({type:"LineString",coordinates:[p1,p2]});
		editline.style.stroke="yellow";
		editline.style.strokeWidth="5px";
		editline.style.opacity=0.5;
		editline.style.cursor="crosshair";
		editline.editline=true;

		p1.addCallbackFunction(editline.render);
		p2.addCallbackFunction(editline.render);
		//this.pathDownEvent=khtml.maplib.base.helpers.eventAttach(editline.element, "mousedown", this.insertPoint, editline, false);
		//this.overEvent=khtml.maplib.base.helpers.eventAttach(editline.element, "mouseover", this.showNum, editline, false);
		//this.editLines.push(editline);
		this.editLines.splice(i,0,editline);
		for(var j=0;j<this.editLines.length;j++){
			this.editLines[j].editindex=j;
		}
		return editline;
	}	
	var that=this;
	this.oldX=null;
	this.oldY=null;
	this.stopAppend=function(evt){
		var ret=false;
		var ding=evt.target.marker;
		if(evt.target.marker && evt.target.marker==that.lastMarker && that.mode=="append"){
			if(this.oldX && Math.abs(this.oldX - evt.clientX) < 2);
			if(this.oldY && Math.abs(this.oldY - evt.clientY) < 2);
			that.stopedit();
			that.line=null;
			ret=true;
		}
		this.oldX=evt.clientX;
		this.oldY=evt.clientY;
		return ret;	
	}


	this.createLine=function(evt){
		//line=new khtml.maplib.geometry.Feature({type:"LineString",coordinates:[[15.6,48.2],[15.657,48.1],[15.65,48.23],[15.55,48.19]]});
		var p=map.mouseToLatLng(evt);
		line=new khtml.maplib.geometry.Feature({type:"LineString",coordinates:[p]});
		line.className.baseVal="line";
		return line;
	}



	this.doMarker=function(p,moving){
			var div=document.createElement("div");
			div.style.width="6px";
			div.style.height="6px";
			div.style.backgroundColor="yellow";
			div.style.border="1px solid black";
			div.style.opacity=0.8;
			div.style.cursor="crosshair";
			/*
			var marker=new khtml.maplib.overlay.SimpleMarker(p,div,{dx:-3,dy:-3});
			this.editMarkers.push(marker);
			marker.moveable(true);
			div.marker=marker;
			if(moving){
				marker.moving=true;
			}
			*/
			var marker={type:"Feature",geometry:{type:"Point",coordinates:p},marker:{icon:{url:div,"size": {"width": 8, "height": 8},"anchor":{x:-4,y:-4}}},draggable:true,raiseOnDrag:false};
			//this.map.addOverlay(marker);
			div.feature=this.editlayer.appendChild(marker);
			p.addCallbackFunction(this.draw);
	//		var editline=this.editline;
			this.lastMarker=marker;
	}


	this.startedit=function(coords,type){
		if(!coords[0].lat){   //not a LatLng object
			for(var i=0;i<coords.length;i++){
				this.startedit(coords[i],type);
			}
		}else{
			for(var i=1;i<coords.length;i++){
				this.makeLine(coords[i-1],coords[i],i);
			}
			if(type=="Polygon" || type=="LinearRing" || type=="MultiPolygon"){
				this.makeLine(coords[coords.length -1],coords[0],coords.length);
			}
			for(var i=0;i<coords.length;i++){
				this.doMarker(coords[i]);
			}
		}
		this.editlayer.documentElement.render();
	}
	this.stopedit=function(mode){
		while(this.editlayer.lastChild){
			this.editlayer.removeChild(this.editlayer.lastChild);
		}
	}
	this.destroy=function(){
		this.stopedit();
		khtml.maplib.base.helpers.eventRemove(this.downEvent);
		khtml.maplib.base.helpers.eventRemove(this.moveEvent);
		khtml.maplib.base.helpers.eventRemove(this.upEvent);
		khtml.maplib.base.helpers.eventRemove(this.keyEvent);
	}		

}

