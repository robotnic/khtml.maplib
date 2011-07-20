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
 * Event: Key is pressed.
 * Prefer 'keypress' over 'keydown' because 'keypress' allows to check which character was typed.
 * Because 'a' != 'A'.
 * We need this for the '-' and '+' signs (evt.which or evt.charCode).
 * For the arrow keys it does not matter - thus there is 'evt.keyCode' used.
 * 
 * @see http://www.brain4.de/programmierecke/js/tastatur.php
 * @see http://www.quirksmode.org/js/keys.html
 */
khtml.maplib.base.Map.prototype.keypress = function(evt) {
	var handled = true;
	
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
	default:
		handled = false;
		break;
	}
	if(handled) return true;
	
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
	case 43: // plus '+'
		var dz = Math.ceil(this.getZoom() + 0.01) - this.getZoom();
		this.autoZoomIn(this.mapsize.width / 2, this.mapsize.height / 2, dz);
		break;
	case 45: // minus '-'
		var dz = Math.floor(this.getZoom() - 0.01) - this.getZoom();
		this.autoZoomIn(this.mapsize.width / 2, this.mapsize.height / 2, dz);
		break;
	}
	
	return true;
}
/**
 * Does nothing
*/
khtml.maplib.base.Map.prototype.keyup = function(evt) {
	//	alert(77);
}
/**
 * Call moveitexec 20 times to prepare the timeout's.
 */
khtml.maplib.base.Map.prototype.moveit = function(x, y) {
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
khtml.maplib.base.Map.prototype.moveitexec = function(dx, dy, i) {
	var that = this;
	var tempFunc = function() {
		that.moveXY(dx, dy);
	}
	setTimeout(tempFunc, 20 * i);
}
