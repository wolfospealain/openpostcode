/* OpenPostcode - Ian Spillane, July 2011 - June 2012 - http://openpostcode.org */

/* OpenPostcode functions */

function regionparameters(region){
/* return region specific parameters */
	region = region || "World"
	i=parameter.length
	do{i--} while (parameter[i].region!=region)
	parameter[i].base=parseInt(Math.sqrt((parameter[i].alphabet).length))
	if(parameter[i].alphabet!=parameter[i].alphabet.toUpperCase()){
		parameter[i].casesensitive=true
	} else parameter[i].casesensitive=false
	return parameter[i]
}

function coordinateregion(coordinates, currentregion){
/* return coordinate specific parameters */
	currentregion = currentregion || region
	currentregionparameters=regionparameters(currentregion)	
	lon=eval(coordinates.longitude)
	lat=eval(coordinates.latitude)
	north=currentregionparameters.north
	west=currentregionparameters.west
	wide=currentregionparameters.wide
	high=currentregionparameters.high
	if((west+wide)>180){ // Alaska crosses the 180 longitude
		lon=lon+(180-west)
		if(lon>180){lon-=360}
		west=-180
	}
	i=parameter.length
	if(lon>west && lon<(west+wide) && lat<north && lat>(north-high) && !auto){
		return currentregion
	} else {
		do{
			i--
			regionwest=parameter[i].west  // Alaska crosses the 180 longitude
			lon=eval(coordinates.longitude)
			if(regionwest+parameter[i].wide >180){
				lon+=(180-regionwest)
				if(lon>180){lon-=360}
				regionwest=-180
			}
		} while (lon<regionwest || lon>(regionwest+parameter[i].wide) || coordinates.latitude>parameter[i].north || coordinates.latitude<(parameter[i].north-parameter[i].high))
		parameter[i].base=parseInt(Math.sqrt((parameter[i].alphabet).length))
		if(parameter[i].north==north && parameter[i].west==west && parameter[i].wide==wide && parameter[i].high==high)
		{
			return currentregion
		} else 	return parameter[i].region
	}
}

function checksumregion(openpostcode){
/* return checksum specific region */
	char=tidy(openpostcode).checksum
	coderegion=region
	if(char!=""){
		var postcode=tidy(openpostcode).postcode
		if(char==calculatechecksum(postcode,"Geohash-36")){
			coderegion="Geohash-36"
		} else {
			char=char.toUpperCase();
			postcode=postcode.toUpperCase();
			for(i=0;i<parameter.length;i++){
				if ((char==calculatechecksum(postcode,parameter[i].region)) && (regionparameters(parameter[i].region).casesensitive==false)){
					coderegion=parameter[i].region
				}
			}
		}
	}
	return coderegion
}

function expand(string){
/* expand postcode contractions */

	string=","+string+","
	string=string.replace(/,/g,", ")
	string=string.replace(/::/g,": :")
	string=string.replace(/\~/g,":~")
	do{
	/* expand simple contractions */
		var place=string.search(" :")
		if (place>0){
			start=string.substring(0,place)
			start=start.replace(/\+/g,"")
			rest=string.substring(place+2,string.length)
			comma=rest.search(",")
			colon=rest.search(":")
			if((comma<colon)||(colon<0)){delimiter=comma}else delimiter=colon
			code=rest.substring(0,delimiter)			
			if(code.search(/\~/)>-1){plus=1;code=code.replace(/\~/,"")} else plus=0
			rest=rest.substring(delimiter,rest.length)
			reversed=reverse(start)
			space=reversed.substring(1,reversed.length).search(" ")+1
			colon=reversed.substring(1,reversed.length).search(":")+1
			if((space<colon)||(colon<1)){delimiter=space}else delimiter=colon		
			lastcode=reverse(reversed.substring(1,delimiter+1))
			code=lastcode.substring(0,(lastcode.length-code.length)+plus)+code
			string=start+" "+code+rest		
		}
	}
	while (place>0)
	do{
	/* expand ranges */
		place=string.search(":")
		if (place>0){
			start=string.substring(0,place)
			rest=string.substring(place+1,string.length)		
			comma=rest.search(",")
			secondcode=rest.substring(0,comma).replace(/ /g,"")
			rest=rest.substring(comma,rest.length)
			reversed=reverse(start)
			firstcode=reverse(reversed.substring(0,reversed.search(" "))).replace(/ /g,"")
			start=reverse(reversed.substring(reversed.search(" "),reversed.length))			
			string=start+expandrange(firstcode,secondcode)+rest
		}
	}
	while (place>0)
	string=string.substring(1,string.length-2).replace(/ /g,"")
	return string
}

function expandrange(firstcode, secondcode){
/* calculate range of postcodes */
	len=firstcode.length
	alphabet=regionparameters(region).alphabet
	base=regionparameters(region).base
	scale=Math.pow(base,len)
	range="";firstlatitude="";secondlatitude="";firstlongitude="";secondlongitude=""
	for (t=0;t<len;t++){
		LL=alphabet.search(firstcode.substr(t,1))
		firstlatitude=firstlatitude+parseInt(LL/base)
		firstlongitude=firstlongitude+LL%base
		}
	firstlatitude=parseInt(firstlatitude,base)
	firstlongitude=parseInt(firstlongitude,base)
	for (t=0;t<len;t++){
		LL=alphabet.search(secondcode.substr(t,1))
		secondlatitude=secondlatitude+parseInt(LL/base)
		secondlongitude=secondlongitude+LL%base
		}
	secondlatitude=parseInt(secondlatitude,base)
	secondlongitude=parseInt(secondlongitude,base)
	for (lat=firstlatitude;lat<=secondlatitude;lat++){
		for (lon=firstlongitude;lon<=secondlongitude;lon++){
			for(i=0;i<len;i++){
				lat5=lat.toString(5)
				lon5=lon.toString(5)
				lat5len=(""+lat5).length
				lon5len=(""+lon5).length
				for(n=0;n<(len-lat5len);n++){lat5="0"+lat5}
				for(n=0;n<(len-lon5len);n++){lon5="0"+lon5}
				range=range+alphabet.substr((parseInt((""+lat5).substr(i,1))*base)+parseInt((""+lon5).substr(i,1)),1)
			}
			range=range+","
		}
	}
	return range.substring(0,range.length-1)
}

function calculatechecksum(postcode,coderegion){
/* calculate checksum from postcode */
	modulus=regionparameters(coderegion).checkalphabet.length
	alphabet=regionparameters(coderegion).alphabet
	len=postcode.length
	checksum=0
	for (i=0;i<len;i++){
		checksum = checksum+alphabet.search(postcode.substr(i,1))*(i+1)
		}
	checksum = checksum+Math.floor(regionparameters(coderegion).west*regionparameters(coderegion).north-regionparameters(coderegion).wide*regionparameters(coderegion).high) // link checksum to map parameters
	checksum = checksum%modulus
	if(checksum<0){checksum+=modulus}
	checksum = regionparameters(coderegion).checkalphabet.substr(checksum,1)
	return checksum
	}

function checkcode(openpostcode){
/* verify characters and checksum from openpostcode */
	var status="";
	coderegion=checksumregion(openpostcode)
	checkchar=tidy(openpostcode).checksum
	var postcode=tidy(openpostcode).postcode
	codealphabet=regionparameters(coderegion).alphabet
	for (t=0;t<postcode.length;t++){
		if(codealphabet.indexOf(postcode.substr(t,1))<0){
			status="!!";
		}
	}
	if(status!="!!"){
		calculated=calculatechecksum(postcode,coderegion)
		if (checkchar!=""){
			if (checkchar==calculated){status="OK"}	
			else {status="!"+calculated}	
		}
		else status="="+calculated
	}
	return status
}
	
function tidy(openpostcode){
/* parse postcode and checksum characters */
	parsed = new OPC()
	/* allow for old dash separator at end */
		openpostcode=(openpostcode.substr(0,openpostcode.length-2).replace(/-/g,"")+openpostcode.substr(openpostcode.length-2,2))
		openpostcode=openpostcode.replace(/-/g,"\/")
	openpostcode=openpostcode.replace(/" "/g,"")
	separator=openpostcode.search("/")
	if(separator>0){
		parsed.checksum=openpostcode.substr(separator+1,1)
		openpostcode=openpostcode.substring(0,separator)
	}
	else{parsed.checksum=""}
	parsed.postcode = openpostcode
	return parsed
}

function parsearea(postcode){
	areacode=regionparameters(region).areacode;
	if(areacode>0 && postcode.length>areacode){
			postcode=postcode.substr(0,areacode)+"-"+postcode.substr(areacode)
	}
	else postcode=postcode
	return postcode
}

function OPCmapping(postcode){
/* create coordinates from postcode (6 decimal places) */

	base=regionparameters(region).base; west=regionparameters(region).west; north=regionparameters(region).north; wide=regionparameters(region).wide; high=regionparameters(region).high; alphabet=regionparameters(region).alphabet

	postcode=tidy(postcode).postcode
	len=postcode.length
	scale=Math.pow(base,len)
	decoded = new COORDINATES("","")
	latlon1 = new COORDINATES("","")
	latlon2 = new COORDINATES("","")
	latlon3 = new COORDINATES("","")
	for (t=0;t<len;t++){
		LL=alphabet.search(postcode.substr(t,1))
		decoded.latitude=decoded.latitude+parseInt(LL/base)
		decoded.longitude=decoded.longitude+LL%base
		}
	latlon1.latitude=Math.round((north-(parseInt(decoded.latitude,base)+.5)/scale*high)*1000000)/1000000
	latlon1.longitude=Math.round(((parseInt(decoded.longitude,base)+.5)/scale*wide+west)*1000000)/1000000
	if(latlon1.longitude>180){latlon1.longitude-=360}
	latlon2.latitude=north-(parseInt(decoded.latitude,base))/scale*high
	latlon2.longitude=(parseInt(decoded.longitude,base))/scale*wide+west
	if(latlon2.longitude>180){latlon2.longitude-=360}
	latlon3.latitude=north-(parseInt(decoded.latitude,base)+1)/scale*high
	latlon3.longitude=(parseInt(decoded.longitude,base)+1)/scale*wide+west
	if(latlon3.longitude>180){latlon3.longitude-=360}
	box = new BOUNDARY(latlon2,latlon3);
	mappoint = new MAPPING(latlon1,box)
	return mappoint
	}

function mappingOPC(coordinates, currentregion){
/* create postcode from latitude and longitude */
	region=coordinateregion(coordinates, currentregion)
	currentregionparameters=regionparameters(region)
	base=currentregionparameters.base; west=currentregionparameters.west; north=currentregionparameters.north; wide=currentregionparameters.wide; high=currentregionparameters.high; alphabet=currentregionparameters.alphabet; digits=currentregionparameters.digits; areacode=currentregionparameters.areacode;
	long=coordinates.longitude
	if(west+wide>180){ // Alaska crosses the 180 longitude
		long=coordinates.longitude+(180-west)
		if(long>180){long-=360}
		west=-180
	}

	scale=Math.pow(base,digits)
	var postcode=""
	leadingzeros="0"
	for(t=1;t<digits;t++){leadingzeros=leadingzeros+"0"}
	latitude=leadingzeros+parseInt((north-coordinates.latitude)/high*scale,0).toString(base)
	longitude=leadingzeros+parseInt((long-west)/wide*scale,0).toString(base)
	latitude=latitude.substr(latitude.length-digits,digits)	
	longitude=longitude.substr(longitude.length-digits,digits)
	for(t=0;t<digits;t++){
		postcode=postcode+alphabet.substr((parseInt(latitude.substr(t,1))*base)+parseInt(longitude.substr(t,1)),1)
		}
	postcode=postcode+"/"+calculatechecksum(postcode,region)
	return postcode	
}

function drawboundaries(pinpoint,openpostcode){
	var postcode=tidy(openpostcode).postcode
	placerectangle(pinpoint.bounds,1,.1,colour1)
	for(t=1;t<postcode.length;t++){
		pinpoint=OPCmapping(postcode.substr(0,t),region)
		if(t%2==0){colour=colour2} else colour=colour1
		stroke=(postcode.length-t)/2
		placerectangle(pinpoint.bounds,stroke,0,colour)
	}
}
