// --------------------------------------------------------------------------------------------
// khtml javascript library
// --------------------------------------------------------------------------------------------
// (C) Copyright 2010-2011 by Bernhard Zwischenbrugger, Florian Hengartner, Stefan Kemper
//
// Project Info:  http://www.khtml.org
//                                http://www.khtml.org/iphonemap/help.php
//
// This library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
// 
// You should have received a copy of the GNU Lesser General Public License
// along with this library.  If not, see <http://www.gnu.org/licenses/>.
// --------------------------------------------------------------------------------------------

/**
 * This class understands the OSM-XML Format
 *
 *
 * @class
 * @see Example: <a href="../../../examples/parser/osm/start.html">osm with php proxy</a>
 * 
*/


khtml.maplib.parser.Osm=function(){
	this.nodes=new Array();
	this.ways=new Array();
	this.mapcssjson=new Object();
	this.data=function(){
		return this.featureCollection;
	}
	this.style=function(dom){
		console.log(dom,this.mapcssjson);
		var zArray=new Array();
		for(var z in this.mapcssjson){
			zArray.push(z);
		}
		zArray.sort(function(a,b){return parseFloat(a) - parseFloat(b)});
		//for(var z in this.mapcssjson){
		for(var i=0;i< zArray.length;i++){
			var z=zArray[i];
			var fc=new khtml.maplib.overlay.FeatureCollection();
			this.add(dom,fc,z);
			map.featureCollection.appendChild(fc);
		}
	}
	this.lineStyle=function(line,zindex){
//		line.style.stroke="green";
		for(var p in line.properties){
//			console.log(p,line.properties[p]);
			for(var i=0;i< this.mapcssjson[zindex].length;i++){
				var style=this.mapcssjson[zindex][i];
				//console.log(style.selector.properties,line.properties);
				if(style.selector.properties && (style.selector.properties[p]==line.properties[p] || style.selector.properties[p]===true)){
					//console.log("gefunden",style.selector.properties[p],style);
					for(var s in style.rules){
						//console.log(s,style.rules[s]);
						//if(!line.style)line.style=new Object;
						if(style.rules[s]){
						line.style[s]=style.rules[s];
						}
						//console.log(line.style[s]);
						
					}
					if(style.selector.special){
						line.geometry.type="MultiPolygon";
						//console.log(style.selector.special);
					}
				}else{
					line.style.opacity=1;
				}
				
			}
		}
	}
	this.add=function(dom,fc,zindex){
		var nodes= dom.getElementsByTagName("node")
		for(var i=0;i<nodes.length;i++){
			var node=nodes[i];
			var id=node.getAttribute("id");
			if(this.nodes[id]){
				//node is already in the array
			}else{
				var tags=node.getElementsByTagName("tag");
				var point=new khtml.maplib.LatLng(node.getAttribute("lat"),node.getAttribute("lon"));
				this.nodes[id]=point;
				var div=document.createElement("div");
				if(tags.length >0){
					var marker=new khtml.maplib.overlay.SimpleMarker(point,div);
					marker.properties=new Object;
					for(var t=0;t<tags.length;t++){
						var tag=tags[t];
						var k=tag.getAttribute("k");
						var v=tag.getAttribute("v");
						div.setAttribute("mapcss_"+k,v);
						marker.properties[k]=v;
						//div.style.width="16px";
						//div.style.height="16px";
					}
					div.className="osm_marker";
					
					//this.featureCollection.appendChild(marker);
					marker.moveable(true);
					//map.addOverlay(marker);
				}
			}
		
		}

		var ways= dom.getElementsByTagName("way")
		for(var w=0;w<ways.length;w++){
			var way=ways[w];
			var id=zindex+"_"+way.getAttribute("id");
			if(this.ways[id]){
				//way already in array
			}else{
				var line=new khtml.maplib.geometry.Feature("MultiLineString");
				line.close=true;
				line.id=id;
				var nds=way.getElementsByTagName("nd");
				for(var d=0;d<nds.length;d++){
					var nd=nds[d];
					var ref=nd.getAttribute("ref");
					if(this.nodes[ref]!=undefined){
						line.geometry.coordinates.push(this.nodes[ref]);
					}
				}
				var tags=way.getElementsByTagName("tag");
				for(var t=0;t<tags.length;t++){
					var tag=tags[t];
					var k=tag.getAttribute("k");
					var v=tag.getAttribute("v");
					line.properties[k]=v;
					/*
					if(k=="name"){
						line.text.value=v;
						line.text.style.fill="black";
						line.text.style.fontSize="12";
						line.text.style.textAnchor="middle";
					}
					*/
				}
				this.lineStyle(line,zindex);
				if(line.style.stroke || line.style.fill){
					//console.log(zindex,line.style.stroke);
					fc.appendChild(line);
				}
				this.ways[id]=line;
			}
		}
	}

	this.mapcss=function(css){


        cssjson=new Array();
        console.log("parse");
        var counter=0;
        var ueberhang="";
        var css=removeComments(css);
        var css=css.replace(/@.*\n/g,"");
        var css=css.replace(/[ \t\n]+/g," ");
        var lines=css.split(/\}/);
        for(var i=0;i<lines.length;i++){
                //console.log(lines[i]);
                var parts=lines[i].split(/\{/);
                //console.log(parts[0],parts[1]);
//              console.log(parts[0]);
                var selectors=parts[0].split(/,/);
                for(var s=0;s<selectors.length;s++){
                        if(!parts[1])continue;
                        var rules=new Object;
                        var rulesStrings=parts[1].split(";");
                        for(var r=0;r<rulesStrings.length;r++){
                                var namevalue=trim(rulesStrings[r]).split(":");

                                var name=namevalue[0];
                                var value=namevalue[1];
                                if(name!=""){
                                        rules[name]=trim(value);
                                }
                        }
                        var selector=new Object;
                        var sp=selectors[s].split("[");
                        if(sp[0].indexOf("|")==-1){
                                var type=sp[0];
                        }else{
                                var types=sp[0].split("|");
                                var type=trim(types[0]);
                                var zoom=types[1];
                                var min=0;
                                var max=25;
                                if(zoom){
                                        zoom=zoom.substring(1,zoom.length);
                                        var zoomsplit=zoom.split("-")[0];
                                        var min=zoomsplit[0];
                                        if(zoomsplit[1]){
                                                var max=zoomsplit[1];
                                        }
                                        selector.zoom=new Object;
                                        selector.zoom.min=min;
                                        selector.zoom.max=max;
                                }

                        }
                        if(sp[1]){
                                for(var n=1;n<sp.length;n++){
                                        if(!selector.properties){
                                                selector.properties=new Object;
                                        }
                                        if(sp[n].indexOf("=")==-1){
                                                var n=sp[n];
                                                var nnn=n.split("]");
                                                selector.properties[nnn[0]]=true;
                                        }else{
                                                var nn=sp[n].split("=");
                                                var nnn=trim(nn[1]).split("]");

                                                selector.properties[nn[0]]=nnn[0];
                                        }
                                //selector.properties=next;
                                }
                        }
                        if(nnn && nnn[1]){
                                var dada=nnn[1];
                                if(nnn[1].indexOf("::")!=-1){
                                        var nnnn=trim(nnn[1]).split("::");
                                        selector.subpart=nnnn[1];
                                        if(nnnn.length>0){
                                                dada=nnnn[0];
                                        }

                                }
                                var nnnn=trim(dada).split("/:/");
                                selector.special=new Object();
                                for(var m=0;m<nnnn.length;m++){
                                        if(nnnn[m]){
                                        selector.special[nnnn[m]]=true;
                                        }
                                }
                        }
                        selector.type=type;
                        cssjson.push({"selectororig":selectors[s],"rules":rules,"selector":selector});
                        //cssjson.push({"selectororig":selectors[s],"selector":selector});
                }
        }

        cssjson=translateToSVG(cssjson);
        cssjsonz=this.zindex(cssjson);
        console.log(cssjsonz);
	this.mapcssjson=cssjsonz;


}
this.zindex=function(data){
        for(var i=0;i<data.length;i++){
                var z=0;
                if(data[i].rules["z-index"]){
                        z=data[i].rules["z-index"];
                }
                //z="z"+z;

                        if(!this.mapcssjson[z]){
                                console.log("---"+z);
                                this.mapcssjson[z]=new Array();
                        }
                        this.mapcssjson[z].push(data[i]);

        }
        return this.mapcssjson;
}

function test(data){
        var c=0;
        for(var i=0;i<data.length;i++){
                if(data[i].selector.properties.aeroway){
                        c++;
                }
        }
//      console.log(c);
}

function translateToSVG(data){
        for(var i=0;i<data.length;i++){
                for(s in data[i].rules){
                        switch(s){
                                case "color":data[i].rules["stroke"]=data[i].rules[s];
                                        break;
                                case "fill-color":data[i].rules["fill"]=data[i].rules[s];
                                        break;
                                case "dashes":data[i].rules["stroke-dasharray"]=data[i].rules[s];
                                        break;
                                case "width":data[i].rules["stroke-width"]=data[i].rules[s];
                                        break;
                        }
                }
        }
        return(data);
}
/* 
    This function is loosely based on the one found here:
    http://www.weanswer.it/blog/optimize-css-javascript-remove-comments-php/

code from
http://james.padolsey.com/javascript/removing-comments-in-javascript/
*/


function removeComments(str) {
    str = ('__' + str + '__').split('');
    var mode = {
        singleQuote: false,
        doubleQuote: false,
        regex: false,
        blockComment: false,
        lineComment: false,
        condComp: false
    };
    for (var i = 0, l = str.length; i < l; i++) {

        if (mode.regex) {
            if (str[i] === '/' && str[i-1] !== '\\') {
                mode.regex = false;
            }
            continue;
        }

        if (mode.singleQuote) {
            if (str[i] === "'" && str[i-1] !== '\\') {
                mode.singleQuote = false;
            }
            continue;
        }

        if (mode.doubleQuote) {
            if (str[i] === '"' && str[i-1] !== '\\') {
                mode.doubleQuote = false;
            }
            continue;
        }

        if (mode.blockComment) {
            if (str[i] === '*' && str[i+1] === '/') {
                str[i+1] = '';
                mode.blockComment = false;
            }
            str[i] = '';
            continue;
        }

        if (mode.lineComment) {
            if (str[i+1] === '\n' || str[i+1] === '\r') {
                mode.lineComment = false;
            }
            str[i] = '';
            continue;
        }

        if (mode.condComp) {
            if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
                mode.condComp = false;
            }
            continue;
        }

        mode.doubleQuote = str[i] === '"';
        mode.singleQuote = str[i] === "'";

        if (str[i] === '/') {

            if (str[i+1] === '*' && str[i+2] === '@') {
                mode.condComp = true;
                continue;
            }
            if (str[i+1] === '*') {
                str[i] = '';
                mode.blockComment = true;
                continue;
            }
            if (str[i+1] === '/') {
                str[i] = '';
                mode.lineComment = true;
                continue;
            }
            mode.regex = true;

        }

    }
    return str.join('').slice(2, -2);
}


function trim (zeichenkette) {
  // Erst führende, dann Abschließende Whitespaces entfernen
  // und das Ergebnis dieser Operationen zurückliefern
  return zeichenkette.replace (/^\s+/, '').replace (/\s+$/, '');
}



}
