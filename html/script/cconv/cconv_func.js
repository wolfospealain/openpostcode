// FieldenMaps.info
// Co-ordinate Converter (Web) 'Functions' JavaScript Functions
// Version 1.2.003
// Ported from original Visual Basic code
// Revision Date: 4 May 2009
// Copyright © 2004-2009 Ed Fielden


function deg2rad(degree_in) { return ((Math.PI/180)*degree_in); }
function rad2deg(radian_in) { return ((180/Math.PI)*radian_in); }
function sec2rad(value_in) { return ((Math.PI*value_in)/648000); }
function rad2sec(radian_in) { return ((648000*radian_in)/Math.PI); }

function sec2dms(seconds) {
    var sec2dmsR = new dmsdata;
    var abssecs = Math.abs(seconds);
    sec2dmsR.seconds = RoundDec(abssecs,4);
    sec2dmsR.minutes = sec2dmsR.seconds/60;
    sec2dmsR.degrees = Math.floor(sec2dmsR.minutes/60);
    sec2dmsR.minutes = Math.floor(sec2dmsR.minutes)-((sec2dmsR.degrees)*60);
    sec2dmsR.seconds = sec2dmsR.seconds-((sec2dmsR.minutes)*60)-((sec2dmsR.degrees)*3600);
    sec2dmsR.seconds = RoundDec(sec2dmsR.seconds,4);
    return sec2dmsR;
}

function Sec(x) { return (1/Math.cos(x)); }
function sinh(x) { return (Math.pow(Math.E,x)-Math.pow(Math.E,(-x)))/2; }
function cosh(x) { return (Math.pow(Math.E,x)+Math.pow(Math.E,(-x)))/2; }
function tanh(x) { return (sinh(x)/cosh(x)); }
function sech(x) { return (1/cosh(x)); }
function arsinh(x) { return Math.log(x + Math.sqrt((x*x)+1)); }
function artanh(x) { return Math.log((1+x)/(1-x))/2; }
function arsech(x) { return Math.log((1+Math.sqrt(1-(x*x)))/x); }
function arcsin(x) { return Math.asin(x); }

function RoundDec(numbr,dp) { return (Math.round(numbr*(Math.pow(10,dp))))/(Math.pow(10,dp)); }

function stringmask(input_string, mask) {
   var outstring=''; var Char;
   for (i=0; i<input_string.length; i++) { Char = input_string.charAt(i); if (mask.indexOf(Char) != -1) { outstring += Char; } }
   return outstring;
}


function fivefig(st_in) {
    var sttt = st_in.toString();
    if (sttt.length > 5) { sttt = sttt.substring(0,5); }
    if (sttt.length < 5) { for (z=sttt.length; z<=4; z++) { sttt = sttt + "0"; } }
    return sttt;
}

function smallnum2string(in_num) {
  if (in_num >= 1) { return in_num.toString(); }
  var U, Obj = { E : 0, M : in_num==U?U:Math.abs(in_num) }
  with (Obj) { if (M==0 || !isFinite(M)) return in_num.toString();
    var T=M;
    while (M>=10) { E++; M=T/Math.pow(10,+E); }
    while (M<1.0) { E--; M=T*Math.pow(10,-E); }
    var retstr = "0.";
    for (i=-1; i>E; i--) { retstr=retstr+"0"; }
    return retstr + stringmask(RoundDec(M,7).toString(), numerics); }
}


function isvalidgridref(sq, eg, ng, projdata, squaresarray) {
   var sqfound = false;
   var validg = false;
    for (z=0; z<squaresarray.length; z++) {
        for (zz=0; zz<squaresarray[z].length; zz++) {
            if (squaresarray[z][zz] == sq.toString()) { sqfound = true; }
        }
    }
   if (sqfound == true) {
      var convres = conv_GR2EN(sq, eg, ng, squaresarray);
      if (convres.eastings < projdata.e_min || convres.eastings >= projdata.e_max || convres.northings < projdata.n_min || convres.northings >= projdata.n_max) {
         return false;
      } else { return true; }
   } else { return false; }   
}


function isvalidcoord(eg, ng, projdata) {
   if (eg < projdata.e_min || eg >= projdata.e_max || ng < projdata.n_min || ng >= projdata.n_max) {
      return false;
   } else { return true; }
}


function isvalidgeodms(latd, latm, lats, lond, lonm, lons, lonb) {
   if (latm >= 60 || lats >= 60 || lonm >= 60 || lons >= 60 || latd < 49 || latd > 61 || lond * lonb < -9 || lond * lonb > 3) {
      return false;
   } else { return true; }
}

function isvalidgeo(lat1, lon1, lonb) {
   if (lat1 < 49 || lat1 >= 62 || lon1 * lonb <= -10 || lon1 * lonb >= 4) {
      return false;
   } else { return true; }
}


function isvalidigeodms(latd, latm, lats, lond, lonm, lons) {
   if (latm >= 60 || lats >= 60 || lonm >= 60 || lons >= 60 || latd < 51 || latd > 55 || lond < 4 || lond > 11) {
      return false;
   } else { return true; }
}

function isvalidigeo(lat1, lon1) {
   if (lat1 < 51 || lat1 >= 56 || lon1  <= -12 || lon1  > -4) {
      return false;
   } else { return true; }
}
