/**
@class
Feature

Call like this:
var geometry={
	type:"LineString",
	coordinates:[[10,01],[20,20]],
	properties:["name":"Bahnhofstrasse"]
}

khtml.maplib.geometry.Feature(geometry);

or

khtml.maplib.geometry.Feature({type:"LineString",coordinates:[[10,01],[20,20]],properties:["name":"Bahnhofstrasse"]}); //UTF-8!!!!!

or

var feature=khtml.maplib.geometry.Feature("LineString");
feature.geometry.coordinates=khtml.maplib.helpers.parseLine([[10,01],[20,20]]);
feature.properties.name="blabla";

*/


khtml.maplib.geometry.Feature = function(geometry) {
	this.type="Feature";
	this.geometry=new Object;
	this.geometry.coordinates=new Array();
	this.properties=new Object();
	this.events = new Object;
	this.style = new Object;
	this.className = new Object;
	this.className.baseVal = "khtml_vector_line";
	if(typeof(geometry)=="object"){
		if(geometry.type){
			if(geometry.type=="Feature"){
				this.geometry.type=geometry.geometry.type;
				this.geometry.coordinates=khtml.maplib.base.helpers.parseLine(geometry.geometry.coordinates);
				if(geometry.className){
					this.className.baseVal=geometry.className.baseVal;
				};
				if(geometry.geometry.type=="FeatureCollection"){
					var fc=new khtml.maplib.overlay.FeatureCollection();

					for(var i=0;i<geometry.features.length;i++){
						var feature=geometry.features[i];
						fc.appendChild(new khtml.maplib.geometry.Feature(feature));
					}
					return fc;	
				}
			}else{
				this.geometry.type=geometry.type;
				if(geometry.coordinates){
					this.geometry.coordinates=khtml.maplib.base.helpers.parseLine(geometry.coordinates);
				}
			}
		}
	}
	if(typeof(geometry)=="string"){ //ok why not
		this.geometry.type=geometry;
	}
	/**
	depressiated
	*/
	this.setPoints=function(points){
		this.geometry.coordinates=khtml.maplib.base.helpers.parseLine(points);
	}
	this.geojson=function(){
		return khtml.maplib.base.helpers.stringify(this);
	}

}


