/* Google Analytics */
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-24456203-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

/* utility functions */

function callback(){
var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://jsonip.appspot.com/?callback=DisplayIP";
        document.head.appendChild(script);
}

function DisplayIP(response) {
	ipsource=response.ip;
}

function stats(place) {
	/* anonymous stats collection via dummyimage.src */

	source=document.referrer
	dummyimage = new Image();
	dummyimage.src='https://docs.google.com/spreadsheet/formResponse?formkey=dE9DLTd6dllUSlpSb1NXS2YyYU5xNGc6MQ&entry.7.single='+place+'&entry.8.single='+source+'&entry.9.single='+navigator.appName+'-'+navigator.platform+'&entry.10.single='+document.URL+'&entry.11.single='+ipsource;
}

function getQueryVariable(variable) {
/* parse URL queries */
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return ""
}

function reverse(string){
/* reverse a string */
	gnirts=""
	for (t=string.length;t>=0;t--){
		gnirts=gnirts+string.substr(t,1)
	}
	return gnirts
}

function proper(string){
/* http://www.codeproject.com/Articles/11009/Proper-Case-JavaScript-Function */
  return string.toLowerCase().replace(/^(.)|\s(.)/g, 
          function($1) { return $1.toUpperCase(); });
}

function showPageElement(what){
/* show part of page */  
    var obj = typeof what == 'object'  
        ? what : document.getElementById(what);   
    obj.style.display = 'block';  
    return false;  
}  
  
function hidePageElement(what){
/* hide part of page */  
    var obj = typeof what == 'object'  
        ? what : document.getElementById(what);  
    obj.style.display = 'none';  
    return false;  
}
