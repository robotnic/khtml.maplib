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

/**
 * Keyboard Handling
 * Usage: 
 *  var keyboardHandler=new khtml.maplib.ui.KeyBoard();	
 *  map.addOverlay(keyboardHandler);
 *
 * Cursur Keys for move the map
 * Page Up, Page Down, Pos1, End for fast moveing the map
 * "+" zoom in
 * "-" zoom out
 *
 * For Firefox don't forget to set "tabIndex" (html);
 * @see Example: <a href="../../../examples/ui/keyboard/start.html">keyboard in action</a>
 * @class
 */

khtml.maplib.ui.KeyBoard = function() {
	this.zoomtime=400;
	
	this.init=function(map){
		this.map=map;
		khtml.maplib.base.helpers.eventAttach(map.mapParent,"keydown",this.keydown,this,false);
	}

	this.keydown=function(evt){
		//console.log(evt.keyCode);
		switch (evt.keyCode) {
			// arrow left
			case 37:
				this.moveit(30, 0);
				break;
			// arrow up
			case 38:
				this.moveit(0, 30);
				break;
			// arrow right
			case 39:
				this.moveit(-30, 0);
				break;
			// arrow down
			case 40:
				this.moveit(0, -30);
				break;

			//page down
			case 35:
				this.moveit(this.map.size.width *0.4,0);
				break;
			//page up
			case 36:
				this.moveit(-this.map.size.width *0.4,0);
				break;
			//pos1
			case 33:
				this.moveit(0,this.map.size.height *0.4);
				break;
			//end
			case 34:
				this.moveit(0,-this.map.size.height *0.4);
				break;
			case 187:
			case 61:
			case 43: // plus '+'
				this.zoomin();
				break;
			case 189:
			case 190:
			case 109:
			case 45: // minus '-'
				this.zoomout();
				break;

			default:
				//normal event handling
				return;
		}
                if (evt.preventDefault) {
                        evt.preventDefault(); // The W3C DOM way
                } else {
                        evt.returnValue = false; // The IE way
                }
		return;

		/*
		//if(handled) return true;
		
		var characterCode;	
		if(typeof(evt.which)!='undefined') {
			characterCode = evt.which;
		} else {
			characterCode = evt.charCode;
		}
		// Tested on IE8
		if(this.internetExplorer) {
			characterCode = evt.keyCode;
		}
		
		switch (characterCode) {
		case 187:
		case 43: // plus '+'
			this.map.animatedGoto(map.center(),Math.ceil(map.zoom()+0.01));
			break;
		case 189:
		case 45: // minus '-'
			this.map.animatedGoto(map.center(),Math.floor(map.zoom()-0.01));
			break;
		}
		
		return true;
		*/
	}

this.render=function(){
//nothing to render
}

this.zoomingIn=false;
this.zoomin=function(){
	var newzoom=Math.ceil(this.map.zoom()+0.1)
	if(this.zoomingIn){
		newzoom++;
	}
	this.map.animatedGoto(this.map.center(),newzoom,this.zoomtime);
	var that=this;
	var tempFunction=function(){
		that.zoomingIn=false;
	}
	setTimeout(tempFunction,this.zoomtime);
	this.zoomingIn=true;
}

this.zoomout=function(){
	var newzoom=Math.floor(this.map.zoom()-0.1);
        if(this.zoomingOut){
                newzoom--;
        }
	this.map.animatedGoto(this.map.center(),newzoom,this.zoomtime);
	        var that=this;
        var tempFunction=function(){
                that.zoomingOut=false;
        }
        setTimeout(tempFunction,this.zoomtime);
        this.zoomingOut=true;

}



/**
 * Does nothing
*/
this.keyup = function(evt) {
	//	alert(77);
}
/**
 * Call moveitexec 20 times to prepare the timeout's.
 */
this.moveit = function(x, y) {
	var steps = 20;
	var dx = x / steps;
	var dy = y / steps;
	for ( var i = 0; i < steps; i++) {
		var f = Math.cos(3 * (-steps / 2 + i) / steps) * 5;
		this.moveitexec(dx * f, dy * f, i);
	}
}
/**
 * Execute "moveXY" delayed by a timeout.
 */
this.moveitexec = function(dx, dy, i) {
	var that = this;
	var tempFunc = function() {
		this.map.moveXY(dx, dy);
	}
	setTimeout(tempFunc, 20 * i);
}



} //end class
