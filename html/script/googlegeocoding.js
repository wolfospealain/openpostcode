function codeaddress() {
/* Google geocoding */
	document.getElementById("errormessage").innerHTML=""
	geocoder = new google.maps.Geocoder();
	var address = document.getElementById("address").value;
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			pin=false; boxes=false;
			mapclick(results[0].geometry.location);
			pin=true; boxes=true;
			} else {showPageElement('error');document.getElementById("errormessage").innerHTML="GOOGLE GEOCODE ERROR: " + status;}
    		});
	}
