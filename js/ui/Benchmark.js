khtml.maplib.ui.Benchmark=function(target){
	this.target=target;
	this.valueTds=new Array();
	this.parameter=["allLines","totalTime","iterationTime","points","lines","vectorPointsPerIteration"];
	this.init=function(map){
		this.map=map;
		//createTableRows
		for(var i=0;i<this.parameter.length;i++){
			var tr=document.createElement("tr");
			//name
			var td=document.createElement("td");
			var tn=document.createTextNode(this.parameter[i]);
			td.appendChild(tn);
			tr.appendChild(td);

			//value
			var td=document.createElement("td");
			this.valueTds[this.parameter[i]]=td;
			var tn=document.createTextNode("0");
			td.appendChild(tn);
			tr.appendChild(td);
			this.target.appendChild(tr);
		}
		for(var i=0;i<map.featureCollection.features.length;i++){
		}
		this.timinger(map.featureCollection);	
		//this.timinger(map.featureCollection);	
	}

	this.timinger=function(fc){

		var totalTime=fc.vectorLayer.timestamp - fc.vectorLayer.starttimestamp;
		var linecount=fc.features.length;
		//if(linecount > 0)document.getElementById("vectorTable").style.display="";
		var points=fc.vectorLayer.totalPoints;
		var lines=fc.vectorLayer.totalLines;
		this.valueTds["lines"].innerHTML=lines;
		this.valueTds["totalTime"].innerHTML=totalTime/1000 ;
		this.valueTds["iterationTime"].innerHTML=fc.vectorLayer.iterationTime/1000 ;
		this.valueTds["points"].innerHTML=points;
		this.valueTds["allLines"].innerHTML=linecount;
		this.valueTds["vectorPointsPerIteration"].innerHTML=fc.vectorLayer.vectorPointsPerIteration;

		var that=this;
		var tempFunc=function(){
			that.timinger(fc);
		}
		setTimeout(tempFunc,500);
	}

	this.render=function(){


	}
	this.remove=function(){

	}


}
