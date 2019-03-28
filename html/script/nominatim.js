/* http://open.mapquestapi.com/nominatim/ */

function nameplace(geolongitude,geolatitude) {
	if(!tracklocation){
		document.getElementById("placeresults").innerHTML = "loading ...";
		document.getElementById('details_placeresults').innerHTML = "loading ...";
	}
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "http://nominatim.openstreetmap.org/reverse?format=json&json_callback=renderCallback&lat=" + geolatitude + "&lon=" + geolongitude;
	document.body.appendChild(script);
};

function renderCallback(response) {
	if(response.address){
		var html = "", websearch=""; i=0;
		for (var obj in response.address){
			var f = response.address[obj];
			if(obj=="postcode"){
				html += "<b>Postcode: " + f + "</b>. ";	
			} else html += proper(obj) + ": " + f + ". ";	
			if(++i<3 || obj=="country"){websearch += f +"%20"}			
		}
		if(irishpostcode!=""){
			html+=" <b>Postcode: "+irishpostcode+"</b>"
		}
		html += " <i>&copy; <a href=http://osm.org/?lat="+geolatitude+"&lon="+geolongitude+"&zoom=13>OpenStreetMap</a></i>."
	}
	googlesearch = websearch;
	document.getElementById('details_placeresults').innerHTML = html;
	document.getElementById('placeresults').innerHTML = html;
}

