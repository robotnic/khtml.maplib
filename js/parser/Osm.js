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
*/


khtml.maplib.parser.Osm=function(){
	this.featureCollection=new khtml.maplib.overlay.FeatureCollection();
	this.nodes=new Array();
	this.ways=new Array();
	this.data=function(){
		return this.featureCollection;
	}
	this.add=function(dom){
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
					var marker=new khtml.maplib.overlay.Marker(point,div);
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
					
					this.featureCollection.appendChild(marker);
				}
			}
		
		}

		var ways= dom.getElementsByTagName("way")
		for(var w=0;w<ways.length;w++){
			var way=ways[w];
			var id=way.getAttribute("id");
			if(this.ways[id]){
				//way already in array
			}else{
				var line=new khtml.maplib.geometry.Feature("Polyline");
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
				}
				this.featureCollection.appendChild(line);
				this.ways[id]=line;
			}
		}

	}
}
