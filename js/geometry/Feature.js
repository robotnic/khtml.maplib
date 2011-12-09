/**
	Feature
	
	@example Call like this:
	<pre>
	var geometry={
		type:"LineString",
		coordinates:[[10,01],[20,20]],
	}
	
	khtml.maplib.geometry.Feature(geometry);
	
	or
	
	khtml.maplib.geometry.Feature({type:"LineString",coordinates:[[10,01],[20,20]]});
	</pre>
 * @class
* @see Example: <a href="../../../examples/geometry/feature.html">Vectors</a>
*/


khtml.maplib.geometry.Feature = function(geometry) {
	this.type="Feature";
	this.geometry=new Object;
	this.geometry.coordinates=new Array();
	this.properties=new Object();
	this.events = new Object;
	this.style = new Object;
	this.className = new Object;
	this.events=new Array();

	this.text = new Object;
	this.text.style = new Object;
	this.text.className = new Object;
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
					return;
				}
				if(geometry.type=="FeatureCollection"){
                                        var fc=new khtml.maplib.overlay.FeatureCollection();
					if(geometry.feature){
						for(var i=0;i<geometry.features.length;i++){
							var feature=geometry.features[i];
							fc.appendChild(new khtml.maplib.geometry.Feature(feature));
						}
					}
                                        return fc
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
	/**
	Serialize overlays to json string
	*/
	this.geojson=function(){
		return khtml.maplib.base.helpers.stringify(this);
	}
	/**
	not implemented
	*/
	this.cloneNode=function(){
		return khtml.maplib.base.helpers.cloneObject(this);
	}
	this.eventAttach=function(eventType,method,context,bubble){
		if(this.element){
			var ev=khtml.maplib.base.helpers.eventAttach(this.element,eventType,method,context,bubble);
		}
		this.events.push({"eventType":eventType,"method":method,"context":context,"bubble":bubble});
	}
	this.eventRemove=function(){
		console.log("not implemented");
	}
}


