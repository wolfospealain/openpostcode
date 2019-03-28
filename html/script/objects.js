/* objects */

function parameters(r,w,n,e,s,d,o,a,c,u,x,f,t,v,b){ /* parameters object */
	this.region=r; this.west=w; this.north=n; this.wide=e; this.high=s; this.digits=d; this.areacode=o; this.alphabet=a; this.checkalphabet=c; this.url=u; this.start=x; this.filename=f; this.casesensitive=v; this.base=b; this.tagline=t
}
function OPC(p,c){ /* openpostcode object */
	this.postcode=p; this.checksum=c
}
function COORDINATES(x,y){ /* coordinates object */
	this.longitude=y; this.latitude=x
}
function BOUNDARY(a,b){ /* box object */
	this.corner1=a; this.corner2=b	
}
function MAPPING(c,b){ /* mapping object, coordinates & box */
	this.position=c; this.bounds=b
}
