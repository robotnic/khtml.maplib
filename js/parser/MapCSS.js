/**
MapCSS is an mapcss parser. 
It directly manipulates css rules.
@class
*/
khtml.maplib.parser.MapCSS=function(){
//icons size
this.size="width:16px;height:16px;";
if(document.styleSheets[0]){
	this.mapcss = document.styleSheets[0];
}else{
	this.mapcss = document.createStyleSheet('dyn css', 'projection,tv,screen');
}

this.parse=function(css){
	var counter=0;
	var ueberhang="";
	var css=removeComments(css);
	var lines=css.split(/\r\n|\r|\n/);
	var parsedLines=new Array();
	//First normalize lines - one CSS one Line
	for(var i=0;i<lines.length;i++){
		var rules=false;
		var line=trim(lines[i]);
		var parts=line.split(/{/);
		if(parts[1]){
			rules=parts[1].split(/}/)[0];
			ueberhang="";
		}else{
			ueberhang=line;
			continue;
		}
		if(rules){
			parsedLines[counter]=ueberhang+lines[i];
			counter++;
			ueberhang="";
		}
	}

	//parse
	for(var i=0;i<parsedLines.length;i++){
		var parsedLine=parsedLines[i];
		var parts=parsedLine.split(/{/);
		if(!parts[1]){
			continue;
		}
		var rules=trim(parts[1].split(/}/)[0]);
		var selector=(parts[0]);
		var newselector=splitSelectors(selector);
		var newrules=doRules(rules);
		//find zoom
		var min=1;
		var max=18;
		var nameAndZoom=selector.split("[")[0];

		if(nameAndZoom.split("|").length >0){
			var zoom=nameAndZoom.split("|")[1];
			if(zoom){
				zoom=zoom.substring(1,zoom.length);
				var zoomsplit=zoom.split("-")[0];
				var min=zoomsplit[0];
				if(zoomsplit[1]){
					var max=zoomsplit[1];
				}
			}
		}



		for(var z=min;z<=max;z++){
			if(newselector!="path" && newselector!="div"){
				var addthis=".z"+z+" "+newselector+" {"+newrules+"}";
				if(min!=1 || max!=18){
					var addthis=".z"+z+" "+newselector+" {"+newrules+"}";
				}else{
					//console.log("else",this.mapcss);
					var addthis=newselector+" {"+newrules+"}";
					this.mapcss.insertRule(addthis , 0);
					break;
				}
				this.mapcss.insertRule(addthis , 0);
				//alert(document.styleSheets[0].cssRules[0].style.backgroundColor);
			}
		}
	}	
}
function splitSelectors(selector){
	selectors=selector.split(",");
	newstring="";
	for(var i=0;i<selectors.length;i++){
		newstring+=doSelectors(selectors[i])+",";
	}
	newstring=newstring.substring(0,newstring.length -1); //cut last ","
	return newstring;

}
function doSelectors(selector){
//		console.log(">>>>"+selector+"<<<<");
	var max=18;
	var min=1;
	var parts=selector.split("[");
	var partsAndZoom=parts[0].split("|");
	if(partsAndZoom[1]){
		var zoom=partsAndZoom[1];
		zoom=zoom.substring(1,zoom.length);
		var min=zoom.split("-")[0];
		if(zoom.split("-")[1]){
			var max=zoom.split("-")[1];
		}
	}
	if(parts[0].substring(0,4)=="node"){
		var newselector="div.osm_marker";
	}else{
		var newselector="path";
	}
	for(var i=1;i<parts.length;i++){
		var part=parts[i];
		var attribute=part.split("]")[0];
		attribute=attribute.split("|")[0];	
		var pseudo=part.split("]")[1].split(":");
		attribute=attribute.replace(":","_");	
		var search=/[0-9a-zA-Z=_]*/;
		var search=/^[0-9a-zA-Z=_]*$/;
		if(search.test(attribute)){
			newselector+="[mapcss_"+attribute+"]";
		}else{
			//console.log("==============",attribute);
		}
	}
	var pseudo=selector.split(":");
	if(pseudo){
	if(pseudo[1]){
		pseudo[1]=trim(pseudo[1]);
		if(pseudo[1]=="hover"){
			newselector+=" :"+pseudo[1];
			console.log(newselector);
		}
	}
	}
	//console.log(selector);
	//console.log(newselector);
	return newselector;
}
function doRules(rules){
	var properties=rules.split(";");
	var newstring="";
	for(var p=0;p<properties.length;p++){
		var size="";
		var property=properties[p];
		if(!property)continue;
		var parts=property.split(":");
		if(parts[1]){
			var name=trim(parts[0]);
			var value=trim(parts[1]);
			if(name=="fill-color"){
				name="fill";
			}
			if(name=="color"){
				name="stroke";
			}
			if(name=="width"){
				name="stroke-width";
			}
			if(name=="icon-image"){
				name="background-image";
				value="url("+value+")";
					size="width:16px;height:16px;";
			}
			//background-image: url(../images/bg.gif);
			//console.log(name,value);
			newstring+=name+":"+value+";"+size;;
		}
		
	}
	return newstring;
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


