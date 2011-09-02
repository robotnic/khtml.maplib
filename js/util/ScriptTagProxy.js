//from
//http://jaybyjayfresh.com/2007/09/17/using-script-tags-to-do-remote-http-calls-in-javascript/

// adapted from http://www.hunlock.com/blogs/Howto_Dynamically_Insert_Javascript_And_CSS
khtml.maplib.util.scriptTagProxy=function(url,callbackMethod){
	var headID = document.getElementsByTagName("head")[0];
	var scriptLoaded = function() {
		headID.removeChild(newScript);
	};
	var newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.onload=scriptLoaded;
	newScript.src = url;
	headID.appendChild(newScript);
	//eh a global not good!!!
	searchResult=callbackMethod;

}
