/* global interface variables */

var pin=true, boxes=true, auto=true, bluedot=false, zooming=0, geolatitude=0, geolongitude=0, curlatitude=""; curlongitude=""; curaccuracy=0; lastcheckedlatitude="", lastcheckedlongitude="", irishpostcode="", mapcurrentlocation=false, tracklocation=false, turnoffmouseover=false, region="Ireland", pincolor="yellow", googlesearch=""; ipsource="0.0.0.0";

/* interface functions */

function cachebust(){
	var t=new Date;
	if(decodeURIComponent(getQueryVariable("t")).length==0){
		if(window.location.search.length==0){
			window.location=window.location+"?t="+t.getTime();
		}
		else window.location=window.location+"&t="+t.getTime();
	};
}

function welcome(){
	showPageElement('mainmenu');
	hidePageElement('menu');
	showdetailedabout=true;
}

function getquery(){
/* get OPC query */
	query=decodeURIComponent(getQueryVariable("opc"))
	query=query.replace(/;/g,",")	
	p=decodeURIComponent(getQueryVariable("p"))
	b=decodeURIComponent(getQueryVariable("b"))
	z=decodeURIComponent(getQueryVariable("z"))
	if (query.length>0){
		boxes=true; pin=true;
		if (query.substring(0,1)=="/"){
			/* remove leading slash */
			document.getElementById('opc').value=query.substring(1,query.length)
		} else document.getElementById('opc').value=query
		if(regionparameters(checksumregion(document.getElementById('opc').value)).casesensitive==false){document.getElementById('opc').value=document.getElementById('opc').value.toUpperCase()}
		if((query.search(",")>0)||(query.search(":")>0)){document.getElementById('checkpinoption').checked=false; pin=false}
		geolocate();
	} else {findlocation();welcome();}
	if(p==1){document.getElementById('checkpinoption').checked=true; pin=true} else if(p=="0"){document.getElementById('checkpinoption').checked=false; pin=false}
	if(b==1){document.getElementById('checkboxoption').checked=true; boxes=true} else if(b=="0"){document.getElementById('checkboxoption').checked=false; boxes=false}
	if(z>0){zooming=z}
}

function populateregions(){
/* populate select element for regions */
	boxes=false; pin=false;
	for(i=0;i<parameter.length;i++){
		document.getElementById('regions')[document.getElementById('regions').length] = new Option(parameter[i].region,parameter[i].start);
		document.getElementById('links_regions')[document.getElementById('links_regions').length] = new Option(parameter[i].region,parameter[i].start);
		document.getElementById('otherregions').innerHTML+="<a href='http://"+parameter[i].url+parameter[i].start+"' target='_system'>"+parameter[i].region+"</a> ";
		if(region==parameter[i].region){document.getElementById('regions').selectedIndex=i;document.getElementById('links_regions').selectedIndex=i;document.getElementById('opc').value=parameter[i].start;}
		}
}

function updateregion(newregion){
	for(i=0;i<parameter.length;i++){
		if(newregion==parameter[i].region){
			document.getElementById('regions').selectedIndex=i;
			document.getElementById('links_regions').selectedIndex=i;
			region=newregion;
		}
	}
}

function updateTM(){
/* convert from GPS to ITM */
	if(document.getElementById("ITM").style.display=='block'){
		document.coords.lt.value=document.coords.lt2.value;
		document.coords.lg.value=document.coords.lg2.value;
	}
	var coords=Geo2TM(deg2rad(document.coords.lt.value),deg2rad(document.coords.lg.value),ITMG);
	document.coords.ITMN.value=Math.round(coords.northings*1000)/1000;
	document.coords.ITME.value=Math.round(coords.eastings*1000)/1000;
}

function updateGPS(){
/* convert from ITM to GPS */
	var coords=TM2Geo(document.getElementById('ITME').value,document.getElementById('ITMN').value,ITMG)
	document.coords.lt.value=document.coords.lt2.value=Math.round(rad2deg(coords.latitude)*100000)/100000;
	document.coords.lg.value=document.coords.lg2.value=Math.round(rad2deg(coords.longitude)*100000)/100000;
}


function mapcoordinates(){
	tracklocation=false;
	mapcurrentlocation=false;
	position=new COORDINATES(document.coords.lt.value,document.coords.lg.value)
	updateregion(coordinateregion(position,region))
	document.getElementById('opc').value=mappingOPC(position,region)
	mapOPCs(document.getElementById('opc').value)
}

function findlocation(){
/* geolocation */
	mapcurrentlocation=true; tracklocation=true;
	geolocate();
}

function setGPSinfo(latitude, longitude, timestamp, accuracy, altitude, altitudeaccuracy, heading, speed){
	curlatitude=parseFloat(latitude).toFixed(6);
	curlongitude=parseFloat(longitude).toFixed(6);
	curaltitude=parseFloat(altitude).toFixed(2);
	curheading=parseFloat(heading).toFixed(2);
	curspeed=parseFloat(speed).toFixed(2);
	curaccuracy=parseFloat(accuracy).toFixed(2);
	humandate=new Date(timestamp)
	document.getElementById("GPSinfo").innerHTML='<strong>Current Device Geolocation Readings</strong><small><br>Latitude '+curlatitude+', Longitude '+curlongitude+' <font color=red>+/-'+accuracy+'m</font>.<br>Altitude '+curaltitude+'m (+/-'+altitudeaccuracy+'m); Heading '+curheading+', Speed '+curspeed+'.<br>'+humandate+'.</small>';
	document.getElementById("GPSaccuracy").innerHTML='GPS +/-'+accuracy+'m';
}

function updatelabels(position,postcode){
	/* update page title */
	document.title="Open Postcode: "+postcode
	/* headline */
	document.getElementById('headline').innerHTML="<h2><a href=http://www.openpostcode.org target='_system'>Open Postcode</a> "+region+"</h2><strong>"+regionparameters(region).tagline+"</strong>";
	document.getElementById('details_region').innerHTML="<strong>Open Postcode "+region+"</strong>: "+regionparameters(region).tagline;
	/* lookup address */
	geolongitude=parseFloat(position.longitude).toFixed(6);
	geolatitude=parseFloat(position.latitude).toFixed(6);	
	nameplace(geolongitude,geolatitude);
	/* checksum message */
	showPageElement('check_message');
	document.getElementById('check_message').innerHTML=postcode+" "+region+ " OK";
	document.getElementById('search_check_message').innerHTML=postcode+" "+region+ " OK";
	document.getElementById('details_check_message').innerHTML=postcode+" "+region+ " OK";
	document.getElementById('coordinates_check_message').innerHTML=postcode+" "+region+ " OK";
	/* irish postcodes */
	irishpostcode="";
	hidePageElement("ITM")
	showPageElement("ITM-off")
	if(region=="Ireland"){
		showPageElement('details_showprecisiontext');
		showPageElement("ITM")
		hidePageElement("ITM-off")
		precisiontext="<p><table cellspacing=0 cellpadding=2>";
		for(t=1;t<=8;t++){
			if(tidy(postcode).postcode.length>=t){
				precisiontext+="<tr><td valign=top align=left bgcolor=lightgray><a href='http://iemap.org/"+tidy(postcode).postcode.substr(0,t)+"' target='_system'>"+tidy(postcode).postcode.substr(0,t)+"</td><td valign=top align=left bgcolor=lightgray>"+precision[t]+"</td></tr>";
			if(t<8){irishpostcode="<a href='http://iemap.org/"+parsearea(tidy(postcode).postcode.substr(0,t))+"' target='_system'>"+parsearea(tidy(postcode).postcode.substr(0,t))+"</a>"}
			}
		}
		document.getElementById('details_precisiontext').innerHTML=precisiontext+"</table>";
	} else hidePageElement('details_showprecisiontext');
	/* kml */
	heading="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n<Document>\n";
	footer="</description></Placemark>\n</Document>\n</kml>";
	kmltext=document.getElementById('KMLtext').value
	currentkml=kmltext.substring(heading.length,kmltext.length-footer.length);
	document.getElementById('KMLtext').value=heading+currentkml+"<Placemark><name>"+postcode+"</name><Point><coordinates>"+geolongitude+","+geolatitude+"</coordinates></Point><description>"+checkcode(postcode).substring(0,2)+footer;
	/* display coordinates */
	document.coords.lt.value=geolatitude;
	document.coords.lg.value=geolongitude;
	document.coords.lt2.value=geolatitude;
	document.coords.lg2.value=geolongitude;
	/* ITM conversion */
	updateTM();
	/* open postcode links */
	originalauto=auto;auto=false;originalregion=region;
	geohash=mappingOPC(position,'Geohash-36');
	document.getElementById('geohashcode').innerHTML="<strong>Geohash-36:</strong> "+geohash+"<br><small><a href='http://geo36.org/"+tidy(geohash).postcode+"' target='_system'>geo36.org/"+tidy(geohash).postcode+"</a></small><p>";
	auto=originalauto;region=originalregion;
	originalauto=auto;auto=false;originalregion=region;
	world=mappingOPC(position,'World');
	document.getElementById('worldcode').innerHTML="<strong>World Postcode</strong>: "+world+"<br><small><a href='http://mapplot.org/"+tidy(world).postcode+"' target='_system'>mapplot.org/"+tidy(world).postcode+"</a></small><p>";
	auto=originalauto;region=originalregion;
	if(region=='Ireland' || region=='Geohash-36' || region=='World' ){maplink=opcmap+tidy(document.getElementById('opc').value).postcode;}
		else maplink=opcmap+postcode;
	document.getElementById('localcode').innerHTML="<strong>"+region+" Code</strong>: "+document.getElementById('opc').value+"<br><small><a href='http://"+maplink+"' target='_system'>"+maplink+"</a></small><p>";
	/* update labels */
	document.getElementById('details_coordinates').innerHTML="Coordinates: Latitude "+geolatitude+", Longitude "+geolongitude+"<br><a href='http://"+maplink+"' target='_system'>"+maplink+"</a></small>";
	document.getElementById('links_coordinates').innerHTML="Coordinates: Latitude "+geolatitude+", Longitude "+geolongitude+"";
	document.getElementById('place_coordinates').innerHTML="<a href='http://"+maplink+"' target='_system'>"+maplink+"</a></small> <strong>"+geolatitude+", "+geolongitude+"</strong>"
	document.getElementById('search_opc').innerHTML=tidy(postcode).postcode;
	document.getElementById('opc').value=tidy(postcode).postcode;
	document.getElementById('details_opc').value=tidy(postcode).postcode;
	document.getElementById('coordinates_opc').innerHTML=tidy(postcode).postcode;
	document.getElementById('emergency').innerHTML='Tell someone that they can find you at the following link: '+(( region=='Ireland' ) ? opcmap+tidy(postcode).postcode : opcmap+postcode );
}

function addresssearch(){
/* response to search address button */
	mapcurrentlocation=false;
	tracklocation=false;
	codeaddress();
}

function mapclick(googlelatlng){
/* respond to map click */
	mapcurrentlocation=false;
	position = new COORDINATES()
  	position.latitude=googlelatlng.lat()
	position.longitude=googlelatlng.lng()
	updateregion(coordinateregion(position,region))
	var postcode=mappingOPC(position,region)
	document.getElementById('opc').value=postcode
	if(boxes){drawboundaries(OPCmapping(tidy(postcode).postcode),tidy(postcode).postcode)}
	validcode=document.getElementById('opc').value
	opcmap=regionparameters(region).url;

// also need to edit * mapOPC() * and * geolocate() *
	information="<div class='popup'><div style='cursor:hand;cursor:pointer;' onclick=showPageElement('current_location');hidePageElement('GPSaccuracy');document.getElementById('opc').value=this.innerHTML;bluedot=false;mapOPC(this.innerHTML)>"+validcode+"</div><p><a href='http://map.google.com/maps?q="+position.latitude+","+position.longitude+"' target='_system'>("+Math.round(position.latitude*100000)/100000+", "+Math.round(position.longitude*100000)/100000+")</a></div>"
	if(pin){placepin(googlelatlng,map,validcode,information) }

	/* hide menu */
	showPageElement('current_location');
	hidePageElement('GPSaccuracy');
	hidePageElement('options');
	hidePageElement('mainmenu');
	showPageElement('menu');
	hidePageElement('send');
	hidePageElement('explore');
	hidePageElement('maps');
	hidePageElement('directions');

	if(document.getElementById('place').style.display=="none" && document.getElementById('search').style.display=="none"){showPageElement('showplace');}

	updatelabels(position,validcode);
}

function zoomout(opc){
	tracklocation=false;
	region=checksumregion(opc)
	code=tidy(opc).postcode
	if(code.length>1){code=code.substr(0,code.length-1)}
	document.getElementById('opc').value=code
	mapOPC(code)
}

function mapOPCs(opcstring){
	/* start map */
	opcstring=expand(opcstring)
	comma=opcstring.search(",")
	if((comma+1<opcstring.length)&&(comma>-1)){
		opc=opcstring.substring(0,comma)
		mapOPC(opc)
		opcstring=opcstring.substring(opc.length+1,opcstring.length)

		/* parse comma delimited codes */

		while (opcstring.length>0){
			comma=opcstring.search(",")
			if(comma>0){opc=opcstring.substring(0,comma)
			} else opc=opcstring
			pinpoint=OPCmapping(tidy(opc).postcode)
			var latlng = new google.maps.LatLng(+pinpoint.position.latitude,+pinpoint.position.longitude);
			if(boxes){drawboundaries(OPCmapping(tidy(opc).postcode),tidy(opc).postcode)}
			information="<div class='popup'><div style='cursor:hand;cursor:pointer;' onclick=showPageElement('current_location');hidePageElement('GPSaccuracy');document.getElementById('opc').value=this.innerHTML;bluedot=false;mapOPC(this.innerHTML)>"+validcode+"</div><p><a href='http://map.google.com/maps?q="+pinpoint.position.latitude+","+pinpoint.position.longitude+"'  target='_system'>("+Math.round(pinpoint.position.latitude*100000)/100000+", "+Math.round(pinpoint.position.longitude*100000)/100000+")</a></div>"
			if(pin){placepin(latlng,map,opc,information) }
			opcstring=opcstring.substring(opc.length+1,opcstring.length)
		}
	} else mapOPC(opcstring);
}

function mapOPC(postcode){
	
	updateregion(checksumregion(postcode));
	opcmap=regionparameters(region).url;

	/* check postcode */
	check=checkcode(postcode);

	/* messages */
	showPageElement('check_message');
	if(check=="!!"){
		document.getElementById('check_message').innerHTML="Invalid code!";
	}else{
		if(check.substring(0,1)=="="){
			document.getElementById('check_message').innerHTML="/"+check.substring(1,2)+" Optional Check"
			postcode=postcode+"/"+check.substring(1,2)
		}else{
		if(check.substring(0,1)=="!"){
			document.getElementById('check_message').innerHTML="ERROR. Check is /"+check.substring(1,2);
			}else{
				document.getElementById('check_message').innerHTML="/"+tidy(postcode).checksum+" OK for "+region
			}
		}
	}
	document.getElementById('details_check_message').innerHTML=document.getElementById('check_message').innerHTML;
	document.getElementById('search_check_message').innerHTML=document.getElementById('check_message').innerHTML;
	document.getElementById('coordinates_check_message').innerHTML=document.getElementById('check_message').innerHTML;

	/* get coordinates */
	if(check.substring(0,1)!='!'){
		pinpoint=OPCmapping(postcode)

	/* update labels */
	updatelabels(pinpoint.position,postcode);

	/* setup map */
		if(zooming>0){mapzoom=+zooming} else mapzoom=2+tidy(postcode).postcode.length*3
		validcode=tidy(postcode).postcode+"/"+calculatechecksum(tidy(postcode).postcode,region)
		information="<div class='popup'><div style='cursor:hand;cursor:pointer;' onclick=showPageElement('current_location');hidePageElement('GPSaccuracy');document.getElementById('opc').value=this.innerHTML;bluedot=false;mapOPC(this.innerHTML)>"+validcode+"</div><p><a href='http://map.google.com/maps?q="+pinpoint.position.latitude+","+pinpoint.position.longitude+"' target='_system'>("+Math.round(pinpoint.position.latitude*100000)/100000+", "+Math.round(pinpoint.position.longitude*100000)/100000+")</a></div>"
		drawmap(pinpoint,validcode,information)
	}
	/* boundaries */
	if(boxes){drawboundaries(pinpoint,postcode)}

}
