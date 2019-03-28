// FieldenMaps.info
// Co-ordinate Converter (Web) 'Transformations' JavaScript Functions
// Version 1.2.003
// Partly ported from original Visual Basic code
// Revision Date: 4 May 2009
// Copyright © 2004-2009 Ed Fielden


function Geo2Geo(lat, lon, datum_a, datum_b)
{
   var N = datum_a.ellipsoid.a/Math.sqrt(1-(datum_a.ellipsoid.e2*Math.pow(Math.sin(lat),2)));
   var Xa = N*Math.cos(lat)*Math.cos(lon);
   var Ya = N*Math.cos(lat)*Math.sin(lon);
   var Za = N*(1-datum_a.ellipsoid.e2)*Math.sin(lat);
   if (datum_a == WGS84) {
      var Xm = Xa; var Ym = Ya; var Zm = Za;
   } else {
      var dX = datum_a.dX; var dY = datum_a.dY; var dZ = datum_a.dZ; var sf = datum_a.sf*1e-6;
      var rX = sec2rad(datum_a.rX); var rY = sec2rad(datum_a.rY); var rZ = sec2rad(datum_a.rZ);
      var Xt = (Xa-dX)/(1+sf); var Yt = (Ya-dY)/(1+sf); var Zt = (Za-dZ)/(1+sf);
      var Xm = (Xt+(rZ*Yt)-(rY*Zt));
      var Ym = (Yt+(rX*Zt)-(rZ*Xt));
      var Zm = (Zt+(rY*Xt)-(rX*Yt));
   }
   if (datum_b == WGS84) {
      var X = Xm; var Y = Ym; var Z = Zm;
   } else {
      var dX2 = datum_b.dX; var dY2 = datum_b.dY; var dZ2 = datum_b.dZ; var sf2 = datum_b.sf*1e-6;
      var rX2 = sec2rad(datum_b.rX); var rY2 = sec2rad(datum_b.rY); var rZ2 = sec2rad(datum_b.rZ);
      var X = dX2 + ((1+sf2)*(Xm-(rZ2*Ym)+(rY2*Zm)));
      var Y = dY2 + ((1+sf2)*((rZ2*Xm)+Ym-(rX2*Zm)));
      var Z = dZ2 + ((1+sf2)*((rX2*Ym)-(rY2*Xm)+Zm));
   }
   var ei2 = (Math.pow(datum_b.ellipsoid.a,2)-Math.pow(datum_b.ellipsoid.b,2))/Math.pow(datum_b.ellipsoid.b,2);
   var p = Math.sqrt(Math.pow(X,2) + Math.pow(Y,2));
   var theta = Math.atan((Z*datum_b.ellipsoid.a)/(p*datum_b.ellipsoid.b));
   var ttop = Z+(ei2*datum_b.ellipsoid.b*Math.pow(Math.sin(theta),3));
   var bbot = p-(datum_b.ellipsoid.e2*datum_b.ellipsoid.a*Math.pow(Math.cos(theta),3));
   return new geodesic(Math.atan(ttop/bbot),Math.atan2(Y,X));
}

function Geo2TM(lat, lon, TMgrid)
{
    var a = TMgrid.ellip.a/TMgrid.unit; var b = TMgrid.ellip.b/TMgrid.unit; var n = ((a-b)/(a+b));
    var e2 = TMgrid.ellip.e2; var ei2 = e2/(1-e2);
    var A1 = a/(1+n)*(n*n*(n*n*((n*n)+4)+64)+256)/256;
    var h1i = n*(n*(n*(n*(n*(31564*n-66675)+34440)+47250)-100800)+75600)/151200;
    var h2i = n*n*(n*(n*((863232-1983433*n)*n+748608)-1161216)+524160)/1935360;
    var h3i = n*n*n*(n*(n*(670412*n+406647)-533952)+184464)/725760;
    var h4i = n*n*n*n*(n*(6601661*n-7732800)+2230245)/7257600;
    var h5i = (3438171-13675556*n)*n*n*n*n*n/7983360;
    var h6i = 212378941*n*n*n*n*n*n/319334400;
    var Qi = arsinh(Math.tan(lat)); var Qii = artanh(Math.sqrt(e2)*Math.sin(lat)); var Q = Qi-(Math.sqrt(e2)*Qii);
    var l = lon-TMgrid.Lon0; var BB = Math.atan(sinh(Q));
    var ni = artanh(Math.cos(BB)*Math.sin(l));
    var Ei = arcsin(Math.sin(BB)/sech(ni));
    var E1 = h1i*Math.sin(2*Ei)*cosh(2*ni);
    var E2 = h2i*Math.sin(4*Ei)*cosh(4*ni);
    var E3 = h3i*Math.sin(6*Ei)*cosh(6*ni);
    var E4 = h4i*Math.sin(8*Ei)*cosh(8*ni);
    var E5 = h5i*Math.sin(10*Ei)*cosh(10*ni);
    var E6 = h6i*Math.sin(12*Ei)*cosh(12*ni);
    var n1 = h1i*Math.cos(2*Ei)*sinh(2*ni);
    var n2 = h2i*Math.cos(4*Ei)*sinh(4*ni);
    var n3 = h3i*Math.cos(6*Ei)*sinh(6*ni);
    var n4 = h4i*Math.cos(8*Ei)*sinh(8*ni);
    var n5 = h5i*Math.cos(10*Ei)*sinh(10*ni);
    var n6 = h6i*Math.cos(12*Ei)*sinh(12*ni);
    var E = Ei+E1+E2+E3+E4+E5+E6;
    var nn = ni+n1+n2+n3+n4+n5+n6;
    var M = calc_M(TMgrid.Lat0,TMgrid.Lat0,n,b,TMgrid.F0);
    var north = (A1*E*TMgrid.F0+TMgrid.FN-M);
    var east = (A1*nn*TMgrid.F0)+TMgrid.FE;
    return new coord(east,north);
}

function TM2Geo(east, north, TMgrid)
{
    var a = TMgrid.ellip.a / TMgrid.unit;
    var b = TMgrid.ellip.b / TMgrid.unit;
    var n = ((a-b)/(a+b));
    var e2 = TMgrid.ellip.e2;
    var A1 = a/(1+n)*(n*n*(n*n*((n*n)+4)+64)+256)/256;
    var h1 = n*(n*(n*(n*(n*(384796*n-382725)-6720)+932400)-1612800)+1209600)/2419200;
    var h2 = n*n*(n*(n*((1695744-1118711*n)*n-1174656)+258048)+80640)/3870720;
    var h3 = n*n*n*(n*(n*(22276*n-16929)-15984)+12852)/362880;
    var h4 = n*n*n*n*((-830251*n-158400)*n+197865)/7257600;
    var h5 = (453717-435388*n)*n*n*n*n*n/15966720;
    var h6 = 20648693*n*n*n*n*n*n/638668800;
    var M = calc_M(TMgrid.Lat0,TMgrid.Lat0,n,b,TMgrid.F0);
    var E = (north-TMgrid.FN+M)/(A1*TMgrid.F0);
    var nn = (east-TMgrid.FE)/(A1*TMgrid.F0);
    var E1i = h1*Math.sin(2*E)*cosh(2*nn);
    var E2i = h2*Math.sin(4*E)*cosh(4*nn);
    var E3i = h3*Math.sin(6*E)*cosh(6*nn);
    var E4i = h4*Math.sin(8*E)*cosh(8*nn);
    var E5i = h5*Math.sin(10*E)*cosh(10*nn);
    var E6i = h6*Math.sin(12*E)*cosh(12*nn);
    var n1i = h1*Math.cos(2*E)*sinh(2*nn);
    var n2i = h2*Math.cos(4*E)*sinh(4*nn);
    var n3i = h3*Math.cos(6*E)*sinh(6*nn);
    var n4i = h4*Math.cos(8*E)*sinh(8*nn);
    var n5i = h5*Math.cos(10*E)*sinh(10*nn);
    var n6i = h6*Math.cos(12*E)*sinh(12*nn);
    var Ei = E-(E1i+E2i+E3i+E4i+E5i+E6i);
    var ni = nn-(n1i+n2i+n3i+n4i+n5i+n6i);
    var B = arcsin(sech(ni)*Math.sin(Ei));
    var l = arcsin(tanh(ni)/Math.cos(B));
    var Q = arsinh(Math.tan(B));
    var Qi = Q+(Math.sqrt(e2)*artanh(Math.sqrt(e2)*tanh(Q)));
    var complete = false;
    do {
       var newv = Q+(Math.sqrt(e2)*artanh(Math.sqrt(e2)*tanh(Qi)));
       if (Math.abs(Qi-newv) < 1e-11) { complete = true; }
       var Qi = newv; 
    } while (complete == false);
    return new geodesic(Math.atan(sinh(Qi)), TMgrid.Lon0+l);
}


function WGS842OSGB36(g_lat, g_lon)
{
   var cootemp=Geo2TM(g_lat,g_lon,OSNGgps);
   if (isvalidcoord(cootemp.eastings,cootemp.northings,OSNGgps)) {
      var shifty=get_osgbshift(cootemp.eastings,cootemp.northings);
      var coofinal=new coord;
      if (shifty.eastings==0 || shifty.northings==0) { return new geoextra(Geo2Geo(g_lat,g_lon,WGS84,OSGB36),shifty.extra); }
      else {
         coofinal.eastings=cootemp.eastings+shifty.eastings; coofinal.northings=cootemp.northings+shifty.northings;
         return new geoextra(TM2Geo(coofinal.eastings,coofinal.northings,OSNG),shifty.extra);
      }
   } else { return new geoextra(Geo2Geo(g_lat,g_lon,WGS84,OSGB36),'Helmert'); }
}


function OSGB362WGS84(g_lat, g_lon)
{
   var oldshifty; var coointer=Geo2TM(g_lat,g_lon,OSNG);
   var g_east=coointer.eastings; var g_north=coointer.northings;
   if (isvalidcoord(g_east,g_north,OSNG)) {
      var shifty=get_osgbshift(g_east,g_north);
      var new_e=g_east-shifty.eastings;
      var new_n=g_north-shifty.northings;
      var complete=false;
      do {
         oldshifty=shifty; shifty=get_osgbshift(new_e,new_n);
         if (shifty.eastings==0 || shifty.northings==0) { complete=true; }
         else {
            if (Math.abs(shifty.eastings-oldshifty.eastings<0.0001) && Math.abs(shifty.northings-oldshifty.northings<0.0001)) { complete=true; }
            else { new_e=g_east-shifty.eastings; new_n=g_north-shifty.northings; }
         }
      } while (complete==false);
      if (shifty.eastings==0 || shifty.northings==0) { return new geoextra(Geo2Geo(g_lat,g_lon,OSGB36,WGS84),shifty.extra); 
        } else { return new geoextra(TM2Geo(new_e,new_n,OSNGgps),shifty.extra); }
   } else { return new geoextra(Geo2Geo(g_lat,g_lon,OSGB36,WGS84),'Helmert'); }
}


function get_osgbshift(eeeeee, nnnnnn)
{
   var e_in=Math.floor(eeeeee/ostnres/1000);
   var n_in=Math.floor(nnnnnn/ostnres/1000);
   if (eeeeee<OSNG.e_min || eeeeee>OSNG.e_max || nnnnnn<OSNG.n_min || nnnnnn>OSNG.n_max) {
      return new coordx(0,0,'Helmert');
   } else {
     var x0=e_in*ostnres*1000;
     var y0=n_in*ostnres*1000;
     var dx=eeeeee-x0;
     var dy=nnnnnn-y0;
     var t=dx/ostnres/1000;
     var u=dy/ostnres/1000;
     if (typeof(ostn02e[e_in][n_in])=='undefined') { var se0=0; } else { var se0=ostn02e[e_in][n_in]; }
     if (typeof(ostn02e[e_in+1][n_in])=='undefined') { var se1=0; } else { var se1=ostn02e[e_in+1][n_in]; }
     if (typeof(ostn02e[e_in+1][n_in+1])=='undefined') { var se2=0; } else { var se2=ostn02e[e_in+1][n_in+1]; }
     if (typeof(ostn02e[e_in][n_in+1])=='undefined') { var se3=0; } else { var se3=ostn02e[e_in][n_in+1]; }
     if (typeof(ostn02n[e_in][n_in])=='undefined') { var sn0=0; } else { var sn0=ostn02n[e_in][n_in]; }
     if (typeof(ostn02n[e_in+1][n_in])=='undefined') { var sn1=0; } else { var sn1=ostn02n[e_in+1][n_in]; }
     if (typeof(ostn02n[e_in+1][n_in+1])=='undefined') { var sn2=0; } else { var sn2=ostn02n[e_in+1][n_in+1]; }
     if (typeof(ostn02n[e_in][n_in+1])=='undefined') { var sn3=0; } else { var sn3=ostn02n[e_in][n_in+1]; }
     if (se0==0 && se1==0 && se2==0 && se3==0 && sn0==0 && sn1==0 && sn2==0 && sn3==0) {
        return new coordx(0,0,'Helmert');
     } else {
        var extra='OSTN02';
        if (se0==0 || sn0==0) {var gpsgeo=TM2Geo(x0,y0,OSNGgps); var osgeo=Geo2Geo(gpsgeo.latitude,gpsgeo.longitude,WGS84,OSGB36); var ng=Geo2TM(osgeo.latitude,osgeo.longitude,OSNG); se0=(ng.eastings-x0)*1000; sn0=(ng.northings-y0)*1000; extra='OSTN02/Helmert'; }
        if (se1==0 || sn1==0) {var xxx=((e_in+1)*ostnres*1000); var gpsgeo=TM2Geo(xxx,y0,OSNGgps); var osgeo=Geo2Geo(gpsgeo.latitude,gpsgeo.longitude,WGS84,OSGB36); var ng=Geo2TM(osgeo.latitude,osgeo.longitude,OSNG); se1=(ng.eastings-xxx)*1000; sn1=(ng.northings-y0)*1000; extra='OSTN02/Helmert'; }
        if (se2==0 || sn2==0) {var xxx=((e_in+1)*ostnres*1000); var yyy=((n_in+1)*ostnres*1000); var gpsgeo=TM2Geo(xxx,yyy,OSNGgps); var osgeo=Geo2Geo(gpsgeo.latitude,gpsgeo.longitude,WGS84,OSGB36); var ng = Geo2TM(osgeo.latitude,osgeo.longitude,OSNG); se2=(ng.eastings-xxx)*1000; sn2=(ng.northings-yyy)*1000; extra='OSTN02/Helmert'; }
        if (se3==0 || sn3==0) {var yyy=((n_in+1)*ostnres*1000); var gpsgeo=TM2Geo(x0,yyy,OSNGgps); var osgeo=Geo2Geo(gpsgeo.latitude,gpsgeo.longitude,WGS84,OSGB36); var ng=Geo2TM(osgeo.latitude,osgeo.longitude,OSNG); se3=(ng.eastings-x0)*1000; sn3=(ng.northings-yyy)*1000; extra='OSTN02/Helmert'; }
     }
     var se=((1-t)*(1-u)*se0)+(t*(1-u)*se1)+(t*u*se2)+((1-t)*u*se3);
     var sn=((1-t)*(1-u)*sn0)+(t*(1-u)*sn1)+(t*u*sn2)+((1-t)*u*sn3);
     return new coordx(se/1000,sn/1000,extra);
   }
}


function OSI652WGS84(g_lat, g_lon) 
{
   var dgeo=get_osishift(g_lat,g_lon);
   return new geodesic((g_lat+dgeo.latitude),(g_lon+dgeo.longitude));
}


function WGS842OSI65(g_lat, g_lon)
{
   var oldshifty;
   var shifty=get_osishift(g_lat,g_lon);
   var new_lat=g_lat-shifty.latitude; var new_lon=g_lon-shifty.longitude;
   var complete=false;
   do {
      oldshifty=shifty; shifty=get_osishift(new_lat,new_lon);
      if (Math.abs(shifty.longitude-oldshifty.longitude<1e-10) && Math.abs(shifty.latitude-oldshifty.latitude<1e-10)) { complete=true; }
        else { new_lat=g_lat-shifty.latitude; new_lon=g_lon-shifty.longitude; }
   } while (complete==false);
   return new geodesic(new_lat,new_lon);
}


function get_osishift(q_lat, q_lon)
{
   var n_U=osik0*(rad2deg(q_lat)-osilatm); var n_V=osik0*(rad2deg(q_lon)-osilonm);
   var dlat=0; var dlon=0; var coeff=1;
   for(xx=0;xx<=3;xx++) { for(yy=0;yy<=3;yy++) { coeff=Math.pow(n_U,xx)*Math.pow(n_V,yy); dlat+=(osiA[xx][yy]*coeff); dlon+=(osiB[xx][yy]*coeff); } }
   dlat=deg2rad(dlat/3600); dlon=deg2rad(dlon/3600);
   return new geodesic(dlat,dlon);
}


function conv_EN2GR(input_eastings, input_northings, squaresarray)
{    
    var ng2grresult = new gridref;

    input_eastings = RoundDec((input_eastings),0);
    var input_eastings2 = input_eastings;
    input_eastings = Math.abs(input_eastings-(Math.floor(input_eastings/100000)*100000));
    ng2grresult.eastings = "";
    for (z=4;z>0;z--) { 
        if (Math.floor(input_eastings/(Math.pow(10,z)))< 1)
        { ng2grresult.eastings += "0"; }
    }
    ng2grresult.eastings += input_eastings;
    
    input_northings = RoundDec(input_northings,0);
    var input_northings2 = input_northings;
    input_northings = Math.abs(input_northings-(Math.floor(input_northings/100000)*100000));
    ng2grresult.northings = "";
    for (z=4;z>0;z--) {
        if (Math.floor(input_northings/(Math.pow(10,z)))< 1) 
        { ng2grresult.northings += "0"; }
    }
    ng2grresult.northings += input_northings;

    var tempe = Math.floor(input_eastings2/Math.pow(10,5));
    var tempn = Math.floor(input_northings2/Math.pow(10,5));
    if (tempe>squaresarray.length-1 || tempe<0 || tempn>squaresarray[tempe].length-1 || tempn<0) {
       ng2grresult.square = "-"; ng2grresult.eastings = "-"; ng2grresult.northings = "-";
    } else {
       ng2grresult.square = squaresarray[tempe][tempn];
    }
    return ng2grresult;
}


function conv_GR2EN(square, Easting, Northing, squaresarray) 
{
    var east = fivefig(Easting.toString());
    var north = fivefig(Northing.toString());
    
    var conv_NGSq2NGr = new coord;
    conv_NGSq2NGr.eastings = parseFloat(east);
    conv_NGSq2NGr.northings = parseFloat(north);

    var eastadd = 0; var northadd = 0;
    for (z=0;z<squaresarray.length;z++) {
        for (zz=0;zz<squaresarray[z].length;zz++) {
            if (squaresarray[z][zz] == square.toString()) { eastadd = z*100000; northadd = zz*100000;}
        }
    }

    conv_NGSq2NGr.eastings += eastadd;
    conv_NGSq2NGr.northings += northadd;

    return conv_NGSq2NGr;
}


function Geo2CS(lat, lon, CSgrid)
{
    var CSsimple = Geo2CSsimple(lat,lon,CSgrid);
    var Geonew = CS2Geosimple(CSsimple.eastings,CSsimple.northings,CSgrid);
    if (lat - Geonew.latitude < 0) { var latsgn = -1; } else { var latsgn = 1; }
    if (lon - Geonew.longitude < 0) { var lonsgn = -1; } else { var lonsgn = 1; }
    var GeofinLat = lat + (Math.abs((lat-Geonew.latitude)/2) * latsgn);
    var GeofinLon = lon + (Math.abs((lon-Geonew.longitude)/2) * lonsgn);
    return Geo2CSsimple(GeofinLat,GeofinLon,CSgrid);
}

function CS2Geo(east, north, CSgrid)
{
    var Geosimple = CS2Geosimple(east,north,CSgrid);
    var CSnew = Geo2CSsimple(Geosimple.latitude,Geosimple.longitude,CSgrid);
    if (east - CSnew.eastings < 0) { var eastsgn = -1; } else { var eastsgn = 1; }
    if (north - CSnew.northings < 0) { var northsgn = -1; } else { var northsgn = 1; }
    var CSfinE = east + (Math.abs((east-CSnew.eastings)/2) * eastsgn);
    var CSfinN = north + (Math.abs((north-CSnew.northings)/2) * northsgn);
    return CS2Geosimple(CSfinE,CSfinN,CSgrid);
}


function Geo2CSsimple(lat, lon, CSgrid)
{
    var a = CSgrid.ellip.a / CSgrid.unit;
    var b = CSgrid.ellip.b / CSgrid.unit;
    var v = (a / Math.sqrt((1 - (CSgrid.ellip.e2 * Math.pow(Math.sin(lat), 2)))));
    var T = Math.pow(Math.tan(lat), 2);
    var AA = ((lon - CSgrid.Lon0) * Math.cos(lat));
    var C = ((CSgrid.ellip.e2 * Math.pow(Math.cos(lat), 2) / (1 - CSgrid.ellip.e2)));
    var GG = (AA - (T * Math.pow(AA, 3) / 6) - ((8 - T + (8 * C)) * T * Math.pow(AA, 5) / 120));
    var N = ((a - b) / (a + b));
    var M0 = calc_M(CSgrid.Lat0, CSgrid.Lat0, N, b, CSgrid.F0);
    var M = calc_M(lat, lat, N, b, CSgrid.F0);
    var FF = ((Math.pow(AA, 2) / 2) + ((5 - T + (6 * C)) * Math.pow(AA, 4) / 24));

    return new coord((CSgrid.FE + (v * GG)), (CSgrid.FN + M - M0 + (v * Math.tan(lat) * FF)));
}


function CS2Geosimple(east, north, CSgrid)
{
    var a = CSgrid.ellip.a / CSgrid.unit;
    var b = CSgrid.ellip.b / CSgrid.unit;
    var QQ = (1 - (CSgrid.ellip.e2 / 4) - (3 / 64 * Math.pow(CSgrid.ellip.e2, 2)) - (5 / 256 * Math.pow(CSgrid.ellip.e2, 3)));
    var N = ((a - b) / (a + b));
    var lat_ = ((north - CSgrid.FN) / (a * CSgrid.F0)) + CSgrid.Lat0;
    var iter_complete = false;
    while (iter_complete == false) {
        var M = calc_M(lat_ - CSgrid.Lat0, lat_ + CSgrid.Lat0, N, b, CSgrid.F0);
        if (Math.abs(north - CSgrid.FN - M) >= 0.00000001) { lat_ = (((north - CSgrid.FN - M) / (a * CSgrid.F0)) + lat_); }
          else { iter_complete = true; }
    }
    var M0 = calc_M(CSgrid.Lat0, CSgrid.Lat0, N, b, CSgrid.F0);
    var M1 = M0 + north - CSgrid.FN;
    var u1 = M1 / (a * QQ);
    var e1 = (1-(Math.sqrt(1-CSgrid.ellip.e2))) / (1+(Math.sqrt(1-CSgrid.ellip.e2)));
    var w1 = lat_;
    var w1a = ((3*e1/2) - (27*e1*e1*e1/32)) * Math.sin(2*u1);
    var w1b = ((21*e1*e1/16) - (55*e1*e1*e1*e1/32)) * Math.sin(4*u1);
    var w1c = (151*e1*e1*e1/96) * Math.sin(6*u1);
    var w1d = (1097*e1*e1*e1*e1/512) * Math.sin(8*u1);
    var w1 = u1+w1a+w1b+w1c+w1d;
    var T1 = Math.pow(Math.tan(w1), 2);
    var v1 = a / Math.sqrt(1 - (CSgrid.ellip.e2 * Math.pow(Math.sin(w1), 2)));
    var r1 = (a * (1 - CSgrid.ellip.e2)) / Math.pow((1 - (CSgrid.ellip.e2 * Math.pow(Math.sin(w1), 2))), 1.5);
    var D = (east - CSgrid.FE) / v1;
    var KK = ((1 + (3 * T1)) * (Math.pow(D, 4) / 24));
    var LL = (v1 * Math.tan(w1)) / r1;
    var MM = w1 - (LL * ((Math.pow(D, 2) / 2) - KK));
    var RR = (T1 * (Math.pow(D, 3) / 3));
    var SS = ((1 + (3 * T1)) * T1 * (Math.pow(D, 5) / 15));
    var TT = ((D - RR + SS) / Math.cos(w1));

    
    return new geodesic(MM, CSgrid.Lon0 + TT);
}

function Geo2BN(lat, lon, BNgrid)
{
    var BNsimple = Geo2BNsimple(lat,lon,BNgrid);
    var Geonew = BN2Geosimple(BNsimple.eastings,BNsimple.northings,BNgrid);
    if (lat - Geonew.latitude < 0) { var latsgn = -1; } else { var latsgn = 1; }
    if (lon - Geonew.longitude < 0) { var lonsgn = -1; } else { var lonsgn = 1; }
    var GeofinLat = lat + (Math.abs((lat-Geonew.latitude)/2) * latsgn);
    var GeofinLon = lon + (Math.abs((lon-Geonew.longitude)/2) * lonsgn);
    return Geo2BNsimple(GeofinLat,GeofinLon,BNgrid);
}

function BN2Geo(east, north, BNgrid)
{
    var Geosimple = BN2Geosimple(east,north,BNgrid);
    var BNnew = Geo2BNsimple(Geosimple.latitude,Geosimple.longitude,BNgrid);
    if (east - BNnew.eastings < 0) { var eastsgn = -1; } else { var eastsgn = 1; }
    if (north - BNnew.northings < 0) { var northsgn = -1; } else { var northsgn = 1; }
    var BNfinE = east + (Math.abs((east-BNnew.eastings)/2) * eastsgn);
    var BNfinN = north + (Math.abs((north-BNnew.northings)/2) * northsgn);
    return BN2Geosimple(BNfinE,BNfinN,BNgrid);
}


function Geo2BNsimple(lat, lon, BNgrid)
{
    var a = BNgrid.ellip.a / BNgrid.unit;
    var b = BNgrid.ellip.b / BNgrid.unit;
    var h = (Math.cos(lat) / Math.sqrt(1 - (BNgrid.ellip.e2 * Math.pow(Math.sin(lat), 2))));
    var h0 = (Math.cos(BNgrid.Lat0) / Math.sqrt(1 - (BNgrid.ellip.e2 * Math.pow(Math.sin(BNgrid.Lat0), 2))));
    var QQ = (1 - (BNgrid.ellip.e2 / 4) - ((3 * Math.pow(BNgrid.ellip.e2, 2)) / 64) - ((5 * Math.pow(BNgrid.ellip.e2, 3)) / 256));
    var RR = (((3 * BNgrid.ellip.e2) / 8) + ((3 * Math.pow(BNgrid.ellip.e2, 2)) / 32) + ((45 * Math.pow(BNgrid.ellip.e2, 3)) / 1024));
    var SS = (((15 * Math.pow(BNgrid.ellip.e2, 2)) / 256) + ((45 * Math.pow(BNgrid.ellip.e2, 3)) / 1024));
    var TT = (((35 * Math.pow(BNgrid.ellip.e2, 3)) / 3072));
    var M0 = (a * ((QQ * BNgrid.Lat0) - (RR * (Math.sin(2 * BNgrid.Lat0))) + (SS * (Math.sin(4 * BNgrid.Lat0))) - (TT * (Math.sin(6 * BNgrid.Lat0)))));
    var M = (a * ((QQ * lat) - (RR * (Math.sin(2 * lat))) + (SS * (Math.sin(4 * lat))) - (TT * (Math.sin(6 * lat)))));
    var p = (((a * h0) / Math.sin(BNgrid.Lat0)) + M0 - M);
    var T = ((a * h * (lon - BNgrid.Lon0)) / p);
    var X = ((a * h0) / Math.sin(BNgrid.Lat0)) - (p * Math.cos(T)) + BNgrid.FN;
    
    return new coord(((p * Math.sin(T)) + BNgrid.FE), X);
}


function BN2Geosimple(east, north, BNgrid)
{
    var a = BNgrid.ellip.a / BNgrid.unit;
    var b = BNgrid.ellip.b / BNgrid.unit;
    var X = east - BNgrid.FE;
    var Y = north - BNgrid.FN;
    var h0 = (Math.cos(BNgrid.Lat0) / Math.sqrt(1 - (BNgrid.ellip.e2 * Math.pow(Math.sin(BNgrid.Lat0), 2))));
    var QQ = (1 - (BNgrid.ellip.e2 / 4) - ((3 * Math.pow(BNgrid.ellip.e2, 2)) / 64) - ((5 * Math.pow(BNgrid.ellip.e2, 3)) / 256));
    var RR = (((3 * BNgrid.ellip.e2) / 8) + ((3 * Math.pow(BNgrid.ellip.e2, 2)) / 32) + ((45 * Math.pow(BNgrid.ellip.e2, 3)) / 1024));
    var SS = (((15 * Math.pow(BNgrid.ellip.e2, 2)) / 256) + ((45 * Math.pow(BNgrid.ellip.e2, 3)) / 1024));
    var TT = (((35 * Math.pow(BNgrid.ellip.e2, 3)) / 3072));
    var M0 = (a * ((QQ * BNgrid.Lat0) - (RR * (Math.sin(2 * BNgrid.Lat0))) + (SS * (Math.sin(4 * BNgrid.Lat0))) - (TT * (Math.sin(6 * BNgrid.Lat0)))));
    
    var p = Math.sqrt(Math.pow(X, 2) + Math.pow((((a * h0) / Math.sin(BNgrid.Lat0)) - Y), 2));
    if (BNgrid.Lat0 >= 0) { p = Math.abs(p); }
    if (BNgrid.Lat0 < 0) { p = Math.abs(p) * -1; }
    var M = ((a * h0) / Math.sin(BNgrid.Lat0)) + M0 - p;
    var u = M / (a * (1 - (BNgrid.ellip.e2 / 4) - ((3 * Math.pow(BNgrid.ellip.e2, 2)) / 64) - ((5 * Math.pow(BNgrid.ellip.e2, 3)) / 256)));
    var FF = (1 - Math.sqrt(1 - BNgrid.ellip.e2));
    var GG = (1 + Math.sqrt(1 - BNgrid.ellip.e2));
    var e1 = (FF / GG);
    var inter1 = ((((3 * e1) / 2) - ((27 * Math.pow(e1, 3)) / 32)) * Math.sin(2 * u));
    var inter2 = ((((21 * Math.pow(e1, 2)) / 16) - ((55 * Math.pow(e1, 4)) / 32)) * Math.sin(4 * u));
    var inter3 = ((((151 * Math.pow(e1, 3)) / 96)) * Math.sin(6 * u));
    var inter4 = ((((1097 * Math.pow(e1, 4)) / 512)) * Math.sin(8 * u));
    var BN2GeoR = new geodesic;
    BN2GeoR.latitude = (u + inter1 + inter2 + inter3 + inter4);
    if (Math.abs(rad2deg(BN2GeoR.latitude)) < 89.99999999 || Math.abs(rad2deg(BN2GeoR.latitude)) > 90.00000001)
    {   var h = Math.cos(BN2GeoR.latitude) / Math.sqrt(1 - (BNgrid.ellip.e2 * Math.pow(Math.sin(BN2GeoR.latitude), 2)));
        var QQ = BNgrid.Lon0 + (p * (Math.atan(X / (((a * h0) / Math.sin(BNgrid.Lat0)) - Y))) / (a * h));
        var RR = BNgrid.Lon0 + (p * (Math.atan((X * -1) / (Y - ((a * h0) / Math.sin(BNgrid.Lat0))))) / (a * h));
        if (BNgrid.Lat0 >= 0) { BN2GeoR.longitude = QQ; }
        if (BNgrid.Lat0 < 0) { BN2GeoR.longitude = RR; }
    } else { BN2GeoR.longitude = BNgrid.Lon0; }
    
    return BN2GeoR;    
}


function Geo2Cty(lat, lon)
{
    var tempCSgrid;
    var ctyresult = new Array;
    var rescount = 0;
    for (ic=0; ic<=CtyList.length-1; ic++)
    {
        tempCSgrid = new CSgriddata(Airy, 1, MeridList[CtyList[ic].Meridian].Lat0, MeridList[CtyList[ic].Meridian].Lon0, FO1, 'ft', 0, 0, 0, 0, 0, 0);
        tempCtyCoo = Geo2CS(lat, lon, tempCSgrid);
        tempCtyCoo.eastings = RoundDec(tempCtyCoo.eastings, 2);
        tempCtyCoo.northings = RoundDec(tempCtyCoo.northings, 2);
        for (ics=0; ics<=CtyList[ic].Sheets.length-1; ics++)
        {
            if (tempCtyCoo.eastings >= CtyList[ic].Sheets[ics].ShtW && tempCtyCoo.eastings < CtyList[ic].Sheets[ics].ShtW + CtyList[ic].sdims.width && tempCtyCoo.northings >= CtyList[ic].Sheets[ics].ShtS && tempCtyCoo.northings < CtyList[ic].Sheets[ics].ShtS + CtyList[ic].sdims.height)
            {
                ctyresult[rescount] = new ctyshtres(ic, ics, tempCtyCoo.eastings, tempCtyCoo.northings);
                rescount++;
            }
        }
    }
    return ctyresult;
}


function Geo2CtyString(latin, lonin)
{
    var refresultarray = Geo2Cty(latin, lonin);
    var stringresultarray = new Array;
    for (ix=0; ix<refresultarray.length; ix++)
      { stringresultarray[ix] = CtyList[refresultarray[ix].cty].Name + ': Sheet ' + CtyList[refresultarray[ix].cty].Sheets[refresultarray[ix].sht].ShtNum; }
    return stringresultarray;
}


function Geo2CtyRaw(lat, lon, cty)
{
   tempCSgrid = new CSgriddata(Airy, 1, MeridList[CtyList[cty].Meridian].Lat0, MeridList[CtyList[cty].Meridian].Lon0, FO1, 'ft', 0, 0, 0, 0, 0, 0);
   return Geo2CS(lat, lon, tempCSgrid);
}


function CtyRaw2Geo(east, north, cty)
{
   tempCSgrid = new CSgriddata(Airy, 1, MeridList[CtyList[cty].Meridian].Lat0, MeridList[CtyList[cty].Meridian].Lon0, FO1, 'ft', 0, 0, 0, 0, 0, 0);
   return CS2Geo(east, north, tempCSgrid);
}


function NG2YG(east, nrth)
{ var k=FO1*3*OSNG.F0/OSYG.F0; return new coord(((east-OSNG.FE)/k)+OSYG.FE,((nrth-OSNG.FN)/k)+OSYG.FN); }


function YG2NG(east, nrth)
{ var k=FO1*3*OSNG.F0/OSYG.F0; return new coord(((east-OSYG.FE)*k)+OSNG.FE,((nrth-OSYG.FN)*k)+OSNG.FN); }


function calc_M(latdiff, latsum, nn, eb, F0) {
    var n2 = Math.pow(nn,2);
    var n3 = Math.pow(nn,3);
    var BB = (1+nn+((5/4)*n2)+((5/4)*n3))*latdiff;
    var CC = ((3*nn)+(3*n2)+((21/8)*n3))*Math.sin(latdiff)*Math.cos(latsum);
    var DD = (((15/8)*n2)+((15/8)*n3))*Math.sin(2*latdiff)*Math.cos(2*latsum);
    var EE = ((35/24)*n3)*Math.sin(3*latdiff)*Math.cos(3*latsum);
    return (eb*F0*(BB-CC+DD-EE));
}