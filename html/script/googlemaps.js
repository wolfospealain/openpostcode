/* initialise and redraw Google map */

  var mapzoom=17;
  var geocoder;
  var browserSupportFlag =  new Boolean();
  var map;
  var bluemarker = new google.maps.Marker();
  var blueinfowindow = new google.maps.InfoWindow();

/* Google mapping functons */

function getMaxZoom(point) {
	maxzoom=maxZoomService.getMaxZoomAtLatLng(point, function(response) {
		if (response.status != google.maps.MaxZoomStatus.OK) {
			showPageElement('error');
        		document.getElementById("errormessage").innerHTML='ERROR IN GOOGLE ZOOM';
			return
		}
		if (response.zoom<mapzoom){
			if(response.zoom<18){showPageElement('error');document.getElementById("errormessage").innerHTML='ADJUSTED TO MAXIMUM ZOOM'}
			mapzoom=response.zoom
			map.setZoom(response.zoom)
		}
	})
}

function drawmap(pinpoint,name,information) {
/* draw map */
	var latlng = new google.maps.LatLng(+pinpoint.position.latitude,+pinpoint.position.longitude);
        maxZoomService = new google.maps.MaxZoomService();
	getMaxZoom(latlng)
	var myOptions = {
		zoom: mapzoom,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.HYBRID
		}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	bluemarker.setMap();
	if (bluedot) { placebluedot(latlng,map,name,information) } else
		if (pin) { placepin(latlng,map,name,information) }

	google.maps.event.addListener(map, 'rightclick', function(event) {
	/* right-click map */
		tracklocation=false;
		mapclick(event.latLng);
		});

	google.maps.event.addListener(map, 'dragend', function(event) {
	/* drag map */
		tracklocation=false;
		p=pin; b=boxes;
		pin=false; boxes=false;
		mapclick(map.getCenter());
		pin=p; boxes=b;
	});
  
	google.maps.event.addListener(map, 'dragstart', function(event) {
		//longpress
		clearTimeout(this.pressButtonTimer); 
	});

	google.maps.event.addListener(map, 'mouseup', function() {
		this.mouseDown = false;
		document.getElementById('errormessage').innerHTML="";
		hidePageElement('error');
		//longpress
		clearTimeout(this.pressButtonTimer); 
	});

	google.maps.event.addListener(map, 'mousedown', function(event) {
		this.mouseDown = true;
		showPageElement('error');
		document.getElementById('errormessage').innerHTML="RIGHT-CLICK/LONG-PRESS TO PLACE PIN";
		//longpress
		clearTimeout(this.pressButtonTimer); 
		this.pressButtonTimer = setTimeout(function(){ 
			tracklocation=false;
			mapclick(event.latLng);
		}, 500);               
	});	

	google.maps.event.addListener(map, 'center_changed', function(event) {
	/* drag map */
  		if (this.mouseDown) {
	        //user has clicked the pan button
			p=pin; b=boxes;
			pin=false; boxes=false;
			mapclick(map.getCenter());
			pin=p; boxes=b;
		}
	});
}

function placerectangle(bounds,stroke,opacity,colour) {
/* place a rectangle on the google map */
    	var latLngBounds = new google.maps.LatLngBounds(
	        new google.maps.LatLng(bounds.corner1.latitude,bounds.corner1.longitude),
	        new google.maps.LatLng(bounds.corner2.latitude,bounds.corner2.longitude)
	);
	rectangle = new google.maps.Rectangle({map: map, fillColor: '#ff0000', strokeColor: colour, strokeWeight: stroke, fillOpacity: opacity, clickable: false, bounds: latLngBounds});
}

function placepin(latlng,map,postcode,information){

	/* anonymous beta testing stats collection */
	stats(postcode);

  	var infowindow = new google.maps.InfoWindow({
  		content: information
		});
	var marker = new google.maps.Marker({
		position: latlng, 
		draggable: false,
		animation: google.maps.Animation.DROP,
		map: map, 
		title: postcode
		});
	google.maps.event.addListener(marker, 'click', function() {
	/* click marker */
		//map.setCenter(marker.getPosition());
		infowindow.open(map,marker);
  		});
}

function placebluedot(latlng,map,postcode,information){

	/* anonymous beta testing stats collection */
	stats("("+postcode+")");

  	blueinfowindow = new google.maps.InfoWindow({
  		content: information
		});
	var image = new google.maps.MarkerImage(
		'images/bluedot_retina.png',
		null, // size
		null, // origin
		new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
		new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
		);
	bluemarker = new google.maps.Marker({
		icon: image,
		optimized: false,
		position: latlng, 
		draggable: false,
		animation: google.maps.Animation.DROP,
		map: map, 
		title: 'I am probably here.'
		});
	google.maps.event.addListener(bluemarker, 'click', function() {
	/* click marker */
		//map.setCenter(marker.getPosition());
		blueinfowindow.open(map,bluemarker);
  		});
}
