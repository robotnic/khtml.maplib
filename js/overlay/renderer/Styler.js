// --------------------------------------------------------------------------------------------
// khtml javascript library
// --------------------------------------------------------------------------------------------
// (C) Copyright 2010-2011 by Bernhard Zwischenbrugger, Florian Hengartner, Stefan Kemper
//
// Project Info:  http://www.khtml.org
//				  http://www.khtml.org/iphonemap/help.php
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

// Inspiration: http://michaux.ca/articles/transitioning-from-java-classes-to-javascript-prototypes
/**
 * CSS to Canvas and VML style converting.
 * Colors are not easy to do for Canvas.
 * The "Canscading" of SVG is not easy.
 *
 * Features:
 * - find style information in css and apply it to the canvas
 * - ...
 *
 * @class
*/

khtml.maplib.overlay.renderer.Styler=function(){

	this.classes=new Array();

	/**
	This method is directly called from Vector.js
	*/

	this.makeCanvasStyle=function(feature){
		//var style=feature.style;
		if(feature.canvasStyle && !feature.owner.map.finalDraw){
			return feature.canvasStyle;
		}
		var feature2=feature;
		var cssStyle=null;
		var ancestors_or_self=new Array();
		var style=feature.style;

		while(feature2.owner){
			ancestors_or_self.push(feature2);
			feature2=feature2.owner;
		}
		for(var i=ancestors_or_self.length -1;i>=0;i--){
			var f=ancestors_or_self[i];
		
			if(f.className){
				if(!this.classes[f.className.baseVal]){
					this.classes[f.className.baseVal]=this.getCssStyles(f.className.baseVal);
				}
				var tmpStyle=this.classes[f.className.baseVal];
				
				if(cssStyle){
					cssStyle=this.mergeStyles(tmpStyle,cssStyle);
				}else{
					cssStyle=tmpStyle;
				}
				if(f.style){
					//cssStyle=this.mergeStyles(cssStyle,f.style);
					cssStyle=this.mergeStyles(f.style,cssStyle);
				}
			}
		}
		

		
		if(cssStyle){
			cssStyle=this.mergeStyles(style,cssStyle);
		}
	

		if(feature.geometry.type!="Polygon" && feature.geometry.type!="MultiPolygon"){
			cssStyle.fillOpacity=0;
		}
		var canvasStyle=this.cssToCanvas(cssStyle);
		feature.canvasStyle=canvasStyle;
		return canvasStyle;
}


/**
Merge styles. First parameter overrules second parameter
*/
this.mergeStyles=function(origstyle,cssStyle){  
			
                var style=new Object();
                for(var p in origstyle){
                        style[p]=origstyle[p];
                }

                if (!style.opacity) {
                        style.opacity = cssStyle.opacity;
                }else{
			if(cssStyle.opacity!=undefined){
				style.opacity=style.opacity*cssStyle.opacity;
			}
		}
                if (!style.fillOpacity) {
                        style.fillOpacity = cssStyle.fillOpacity;
                }else{
                        if(cssStyle.fillOpacity!=undefined){
                                style.fillOpacity=style.fillOpacity*cssStyle.fillOpacity;
                        }
                }
                if (!style.strokeOpacity) {
                        style.strokeOpacity = cssStyle.strokeOpacity;
                }else{
                        if(cssStyle.strokeOpacity!=undefined){
                                style.strokeOpacity=style.strokeOpacity*cssStyle.strokeOpacity;
                        }
                }
                if (!style.stroke) {
                        style.stroke = cssStyle.stroke;
                }
                if (!style.fill) {
                        style.fill = cssStyle.fill;
                }
                if (!style.strokeWidth) {
                        style.strokeWidth = parseFloat(cssStyle.strokeWidth);
                }
		style.strokeWidth = parseFloat(style.strokeWidth);
		return style;
}

this.rgba=new Array();
this.cssToCanvas=function(style){
		if(!style.stroke)style.stroke="none";
		if(!style.fill)style.fill="black";
		if(style.opacity == undefined)style.opacity=1;
		if(style.strokeOpacity == undefined)style.strokeOpacity=1;
		if(style.fillOpacity == undefined)style.fillOpacity=1;
		if(!style.strokeWidth)style.strokeWidth=1;
                if (style.stroke) {
			var alpha=style.opacity * style.strokeOpacity;
			var name=style.stroke+"X"+alpha;
			if(!this.rgba[name]){
				this.rgba[name] = hex2rgba(style.stroke, alpha);
			}else{
			}
			var strokeRGB=style.stroke;
			var strokeOpacity=alpha;
			var index=style.stroke+"_"+alpha;
			var stroke=this.rgba[style.stroke+"_"+alpha];
		}
                if (style.fill) {
			var alpha=style.opacity * style.fillOpacity;
			if(!this.rgba[style.fill+"_"+alpha]){
				this.rgba[style.fill+"_"+alpha] = hex2rgba(style.fill, alpha);
			}
			var fillRGB=style.fill;
			var fillOpacity=alpha;
			var fill=this.rgba[style.fill+"_"+alpha]
                }else{
			var fillRGB=0;
			var fillOpacity=1;
			var fill=0;
		}
		return {strokeStyle:stroke,fillStyle:fill,lineWidth:style.strokeWidth,fillRGB:fillRGB,strokeRGB:strokeRGB,fillOpacity:fillOpacity,strokeOpacity:strokeOpacity};

}



	this.getCssStyles=function(klass){
                var styleObj = new Object;

                // Loop throught all css styles
                for (var i = 0; i < document.styleSheets.length; i++) {
                        var list = document.styleSheets[i];
                        if (list.cssRules) {
                                var rules = list.cssRules;
                        } else {
                                var rules = list.rules;
                        }

                        // Loop through all rules in current style
                        for (r = 0; r < rules.length; r++) {
                                var csstext = rules[r].style.cssText;
                                selectorText = rules[r].selectorText;

                                if (selectorText != "." + klass) {
                                        continue;
                                }

                                var cssAr = csstext.split(";");
                                for (var j = 0; j < cssAr.length; j++) {
                                        var stAr = cssAr[j].split(":");
                                        if (stAr.length > 1) {
                                                var name = stAr[0].replace(/^\s/, '');
                                                var value = stAr[1].replace(/^\s/, '');

                                                if (name == "stroke") {
                                                        styleObj.stroke = value;
                                                }
                                                if (name == "fill") {
                                                        styleObj.fill = value;
                                                }
                                                if (name == "stroke-width") {
                                                        styleObj.strokeWidth = parseFloat(value);
                                                }
                                                if (name == "opacity") {
                                                        styleObj.opacity = parseFloat(value);
                                                }
                                                if (name == "fill-opacity") {
                                                        styleObj.fillOpacity = parseFloat(value);
                                                }
                                                if (name == "stroke-opacity") {
                                                        styleObj.strokeOpacity = parseFloat(value);
                                                }

                                        } // end: stAr
                                } // end: cssAr
                        } // end: rules
                }

                return styleObj;
        }

 var colors= {
		aliceblue : 'f0f8ff',
		antiquewhite : 'faebd7',
		aqua : '00ffff',
		aquamarine : '7fffd4',
		azure : 'f0ffff',
		beige : 'f5f5dc',
		bisque : 'ffe4c4',
		black : '000000',
		blanchedalmond : 'ffebcd',
		blue : '0000ff',
		blueviolet : '8a2be2',
		brown : 'a52a2a',
		burlywood : 'deb887',
		cadetblue : '5f9ea0',
		chartreuse : '7fff00',
		chocolate : 'd2691e',
		coral : 'ff7f50',
		cornflowerblue : '6495ed',
		cornsilk : 'fff8dc',
		crimson : 'dc143c',
		cyan : '00ffff',
		darkblue : '00008b',
		darkcyan : '008b8b',
		darkgoldenrod : 'b8860b',
		darkgray : 'a9a9a9',
		darkgreen : '006400',
		darkkhaki : 'bdb76b',
		darkmagenta : '8b008b',
		darkolivegreen : '556b2f',
		darkorange : 'ff8c00',
		darkorchid : '9932cc',
		darkred : '8b0000',
		darksalmon : 'e9967a',
		darkseagreen : '8fbc8f',
		darkslateblue : '483d8b',
		darkslategray : '2f4f4f',
		darkturquoise : '00ced1',
		darkviolet : '9400d3',
		deeppink : 'ff1493',
		deepskyblue : '00bfff',
		dimgray : '696969',
		dodgerblue : '1e90ff',
		feldspar : 'd19275',
		firebrick : 'b22222',
		floralwhite : 'fffaf0',
		forestgreen : '228b22',
		fuchsia : 'ff00ff',
		gainsboro : 'dcdcdc',
		ghostwhite : 'f8f8ff',
		gold : 'ffd700',
		goldenrod : 'daa520',
		gray : '808080',
		green : '008000',
		greenyellow : 'adff2f',
		honeydew : 'f0fff0',
		hotpink : 'ff69b4',
		indianred : 'cd5c5c',
		indigo : '4b0082',
		ivory : 'fffff0',
		khaki : 'f0e68c',
		lavender : 'e6e6fa',
		lavenderblush : 'fff0f5',
		lawngreen : '7cfc00',
		lemonchiffon : 'fffacd',
		lightblue : 'add8e6',
		lightcoral : 'f08080',
		lightcyan : 'e0ffff',
		lightgoldenrodyellow : 'fafad2',
		lightgrey : 'd3d3d3',
		lightgreen : '90ee90',
		lightpink : 'ffb6c1',
		lightsalmon : 'ffa07a',
		lightseagreen : '20b2aa',
		lightskyblue : '87cefa',
		lightslateblue : '8470ff',
		lightslategray : '778899',
		lightsteelblue : 'b0c4de',
		lightyellow : 'ffffe0',
		lime : '00ff00',
		limegreen : '32cd32',
		linen : 'faf0e6',
		magenta : 'ff00ff',
		maroon : '800000',
		mediumaquamarine : '66cdaa',
		mediumblue : '0000cd',
		mediumorchid : 'ba55d3',
		mediumpurple : '9370d8',
		mediumseagreen : '3cb371',
		mediumslateblue : '7b68ee',
		mediumspringgreen : '00fa9a',
		mediumturquoise : '48d1cc',
		mediumvioletred : 'c71585',
		midnightblue : '191970',
		mintcream : 'f5fffa',
		mistyrose : 'ffe4e1',
		moccasin : 'ffe4b5',
		navajowhite : 'ffdead',
		navy : '000080',
		oldlace : 'fdf5e6',
		olive : '808000',
		olivedrab : '6b8e23',
		orange : 'ffa500',
		orangered : 'ff4500',
		orchid : 'da70d6',
		palegoldenrod : 'eee8aa',
		palegreen : '98fb98',
		paleturquoise : 'afeeee',
		palevioletred : 'd87093',
		papayawhip : 'ffefd5',
		peachpuff : 'ffdab9',
		peru : 'cd853f',
		pink : 'ffc0cb',
		plum : 'dda0dd',
		powderblue : 'b0e0e6',
		purple : '800080',
		red : 'ff0000',
		rosybrown : 'bc8f8f',
		royalblue : '4169e1',
		saddlebrown : '8b4513',
		salmon : 'fa8072',
		sandybrown : 'f4a460',
		seagreen : '2e8b57',
		seashell : 'fff5ee',
		sienna : 'a0522d',
		silver : 'c0c0c0',
		skyblue : '87ceeb',
		slateblue : '6a5acd',
		slategray : '708090',
		snow : 'fffafa',
		springgreen : '00ff7f',
		steelblue : '4682b4',
		tan : 'd2b48c',
		teal : '008080',
		thistle : 'd8bfd8',
		tomato : 'ff6347',
		turquoise : '40e0d0',
		violet : 'ee82ee',
		violetred : 'd02090',
		wheat : 'f5deb3',
		white : 'ffffff',
		whitesmoke : 'f5f5f5',
		yellow : 'ffff00',
		yellowgreen : '9acd32'
	};
	


        var hexArr= [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B","C", "D", "E", "F" ];

        function hex2rgba(color, opacity) {
                // Add opacity to "rgb(0,0,0)"
                // Result: "rgba(0,0,0,0)"
                if(color.search(/^rgb\(/) != -1) {
                        khtml.maplib.base.Log.log('test1');
                        // Value is not hex but already like "rgb(0,0,0)" !
                        // Happens if you force canvas backend in firefox.
                        var return_rgbval = color;
                        return_rgbval = return_rgbval.replace('rgb(','rgba(');
                        return_rgbval = return_rgbval.replace(')',','+opacity+')');

                        return return_rgbval;
                }

                // Get hex value for color name
                if (color[0] != "#") {
                        if (color == "none") {
                                //return "none";
				color="000000";
				opacity=0;
                        } else {
                                color = "#" + colors[color];
                        }
                }

                // Make "rgba(..)"
                var return_rgbval = "rgba(";
                if (color.charAt(0) == "#")
                        color = color.substr(1); // Removes the '#' at the start if it's present
                // Originally color.charAt(0) was written color[0], however this didn't work out in IE
                if (color.length == 3)
                        color = color.charAt(0) + color.charAt(0) + color.charAt(1)
                                        + color.charAt(1) + color.charAt(2) + color.charAt(2);
                color = color.toUpperCase(); // To be compared with the _hexArr array the color string have to be in uppercase
                var temp_val = 0;
                for (i = 0; i < color.length; i++) {
                        var temp_val2;
                        for (j = 0; j < hexArr.length; j++) {
                                if (color.charAt(i) == hexArr[j]) {
                                        temp_val2 = j;
                                        break;
                                }
                        }
                        if (i % 2 == 0) {
                                temp_val = temp_val2 * 16
                        } else {
                                temp_val += temp_val2;
                                return_rgbval += (i == (color.length - 1)) ? temp_val + ","
                                                + opacity + ")" : temp_val + ", ";
                        }

                }
                return return_rgbval;
        }

}

