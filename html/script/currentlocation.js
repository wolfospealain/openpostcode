function geolocate(){

/* http://plebeosaur.us/etc/map/location.html
   http://dev.w3.org/geo/api/spec-source.html */

	document.getElementById("errormessage").innerHTML="AWAITING LOCATION ..."
	document.getElementById("GPSinfo").innerHTML='<strong>NO LOCATION INFORMATION</strong>';

	var geo = navigator.geolocation,
		browsers = [ 'Firefox', 'IEMobile', 'MSIE', 'Android', 'BlackBerry', 'iPhone', 'Chrome', 'Safari', 'Opera Mini', 'Opera' ],
		thisBrowser = ( function getBrowser() {
			for ( var i = 0, bl = browsers.length; i < bl; i++ ) {
				if ( !!~navigator.userAgent.indexOf( browsers[i] ) ) {
					return browsers[i];
				}
			}
		})() || 'unknown';

	function displayLocation( position ){

		document.getElementById("errormessage").innerHTML=""
		hidePageElement('error');
		postcode=mappingOPC(position.coords,region);
		information="<div class='popup'><div style='cursor:hand;cursor:pointer;' onclick=showPageElement('current_location');hidePageElement('GPSaccuracy');document.getElementById('opc').value=this.innerHTML;bluedot=false;boxes=true;pin=true;mapOPC(this.innerHTML)>"+postcode+"</div><p><a href='http://map.google.com/maps?q="+position.coords.latitude+","+position.coords.longitude+"'>("+Math.round(position.coords.latitude*100000)/100000+", "+Math.round(position.coords.longitude*100000)/100000+")</a></div>"
		if (mapcurrentlocation){
			if(typeof map!='undefined'){bluemarker.setMap();}
			mapcurrentlocation=false;
			tracklocation=true;
		} else {
			if(typeof map!='undefined'){
				if(blueinfowindow.content!=information){
					blueinfowindow.content=information;
					if(blueinfowindow.open){blueinfowindow.close();}
				}			
			}
		}
		if(typeof map!='undefined'){
				if (bluemarker.getMap()==null){
					placebluedot(new google.maps.LatLng( position.coords.latitude, position.coords.longitude ),map,postcode,information)
				}
			bluemarker.setPosition( new google.maps.LatLng( position.coords.latitude, position.coords.longitude ) );
		}
		if (tracklocation){
		setGPSinfo(position.coords.latitude, position.coords.longitude, position.timestamp, position.coords.accuracy, position.coords.altitude, position.coords.altitudeAccuracy, position.coords.heading, position.coords.speed);
			if(typeof map!='undefined'){
				map.setCenter(new google.maps.LatLng( position.coords.latitude, position.coords.longitude )) ;
			}
			updatelabels(position.coords, postcode);
			showPageElement('GPSaccuracy');
			hidePageElement('current_location');
		}
	}

	function handleError( error ) {
		var errorMessage = [ 
			'LOCATION?!',
			'LOCATION PERMISSION DENIED',
			'LOCATION NOT DETERMINED',
			'DEVICE LOCATION TIMED OUT'
		];
		document.getElementById("errormessage").innerHTML=errorMessage[error.code];
		document.getElementById("GPSinfo").innerHTML='<h3>'+errorMessage[error.code]+'</h3>';
		showPageElement('error');
	}


	if ( geo ) {
		var options = { enableHighAccuracy: true };
		if (thisBrowser === 'iPhone' || thisBrowser === 'Android') {
			turnoffmouseover=true;
			geo.watchPosition( displayLocation, handleError, options );
			document.getElementById("errormessage").innerHTML='AWAITING '+thisBrowser.toUpperCase()+' GEOLOCATION<br>Ensure GPS is enabled.';
			document.getElementById("GPSerror").innerHTML='AWAITING '+thisBrowser.toUpperCase()+' GEOLOCATION<br>Ensure GPS is enabled.';
			document.getElementById("GPSinfo").innerHTML='';
		} else {
			geo.getCurrentPosition( displayLocation, handleError, options );
			document.getElementById("errormessage").innerHTML='AWAITING '+thisBrowser.toUpperCase()+' GEOLOCATION';
			document.getElementById("GPSerror").innerHTML='AWAITING '+thisBrowser.toUpperCase()+' GEOLOCATION';
			document.getElementById("GPSinfo").innerHTML='';
		}
		document.getElementById("errormessage").innerHTML="AWAITING "+thisBrowser.toUpperCase()+" GEOLOCATION";
		document.getElementById("GPSerror").innerHTML="AWAITING "+thisBrowser.toUpperCase()+" GEOLOCATION";
		document.getElementById("GPSinfo").innerHTML='';
	} else {
		document.getElementById("errormessage").innerHTML=thisBrowser.toUpperCase()+' NOT LOCATION AWARE';
		document.getElementById("GPSerror").innerHTML=thisBrowser.toUpperCase()+' NOT LOCATION AWARE';
		document.getElementById("GPSinfo").innerHTML='';
	}
}
