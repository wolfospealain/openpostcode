// FieldenMaps.info
// Co-ordinate Converter (Web) 'Data Type Definitions' JavaScript Functions
// Version 1.2.003
// Revision Date: 4 May 2009
// Copyright © 2004-2009 Ed Fielden


function geodesic(lat, lon) {
        if (lat) {this.latitude = lat; } else {this.latitude = 0; }
        if (lon) {this.longitude = lon; } else {this.longitude = 0; }
}

function geoextra(geod, extra) {
	if (geod) {this.latitude = geod.latitude; this.longitude = geod.longitude} else {this.latitude = 0; this.longitude = 0;}
	if (extra) {this.extra = extra; } else {this.extra = ''; }
}

function dmsdata(deg, min, sec) {
	if (deg) {this.degrees = deg; } else {this.degrees = 0; }
	if (min) {this.minutes = min; } else {this.minutes = 0; }
	if (sec) {this.seconds = sec; } else {this.seconds = 0; }
}

function coord(east, nrth) {
	if (east) {this.eastings = east; } else {this.eastings = 0; }
	if (nrth) {this.northings = nrth; } else {this.northings = 0; }
}

function coordx(east, nrth, extra) {
	if (east) {this.eastings = east; } else {this.eastings = 0; }
	if (nrth) {this.northings = nrth; } else {this.northings = 0; }
	if (extra) {this.extra = extra; } else {this.extra = ''; }
}

function gridref(sq, eg, ng) {
	if (sq) {this.square = sq; } else {this.square = ''; }
	if (eg) {this.eastings = eg; } else {this.eastings = ''; }
	if (ng) {this.northings = ng; } else {this.northings = ''; }
}

function ellipsoid(a, b, e2, se) {
	if (a) {this.a = a; } else {this.a = 0; }
	if (b) {this.b = b; } else {this.b = 0; }
	if (e2) {this.e2 = e2; } else { if (a && b) {this.e2 = (1-(Math.pow(b/a,2)));} else {this.e2 = 0; } }
	if (se) {this.se = se; } else { if (a && b) {this.se = (Math.pow((a/b)*(a/b)-1,0.5))} else {this.se = 0; } }
}

function datum(name,ellip,dX,dY,dZ,rX,rY,rZ,sf) {
	if (name) {this.name = name; } else {this.name = ''; }
	if (ellip) {this.ellipsoid = ellip; } else {this.ellipsoid = null; }
	if (dX) {this.dX = dX; } else {this.dX = 0; }
	if (dY) {this.dY = dY; } else {this.dY = 0; }
	if (dZ) {this.dZ = dZ; } else {this.dZ = 0; }
	if (rX) {this.rX = rX; } else {this.rX = 0; }
	if (rY) {this.rY = rY; } else {this.rY = 0; }
	if (rZ) {this.rZ = rZ; } else {this.rZ = 0; }
	if (sf) {this.sf = sf; } else {this.sf = 0; }
}

function TMgriddata(el, sf, lt, ln, ut, un, fe, fn, ea, eb, na, nb) {
	if (el) {this.ellip = el; } else {this.ellip = null; }
	if (sf) {this.F0 = sf; } else {this.F0 = 0; }
	if (lt) {this.Lat0 = lt; } else {this.Lat0 = 0; }
	if (ln) {this.Lon0 = ln; } else {this.Lon0 = 0; }
	if (ut) {this.unit = ut; } else {this.unit = 0; }
	if (un) {this.unitname = un; } else {this.unitname = ''; }
	if (fe) {this.FE = fe; } else {this.FE = 0; }
	if (fn) {this.FN = fn; } else {this.FN = 0; }
	if (ea) {this.e_min = ea; } else {this.e_min = 0; }
	if (eb) {this.e_max = eb; } else {this.e_max = 0; }
	if (na) {this.n_min = na; } else {this.n_min = 0; }
	if (nb) {this.n_max = nb; } else {this.n_max = 0; }
}

function CSgriddata(el, sf, lt, ln, ut, un, fe, fn, ea, eb, na, nb) {
	if (el) {this.ellip = el; } else {this.ellip = null; }
	if (sf) {this.F0 = sf; } else {this.F0 = 0; }
	if (lt) {this.Lat0 = lt; } else {this.Lat0 = 0; }
	if (ln) {this.Lon0 = ln; } else {this.Lon0 = 0; }
	if (ut) {this.unit = ut; } else {this.unit = 0; }
	if (un) {this.unitname = un; } else {this.unitname = ''; }
	if (fe) {this.FE = fe; } else {this.FE = 0; }
	if (fn) {this.FN = fn; } else {this.FN = 0; }
	if (ea) {this.e_min = ea; } else {this.e_min = 0; }
	if (eb) {this.e_max = eb; } else {this.e_max = 0; }
	if (na) {this.n_min = na; } else {this.n_min = 0; }
	if (nb) {this.n_max = nb; } else {this.n_max = 0; }
}

function BNgriddata(el, sf, lt, ln, ut, un, fe, fn, ea, eb, na, nb) {
	if (el) {this.ellip = el; } else {this.ellip = null; }
	if (sf) {this.F0 = sf; } else {this.F0 = 0; }
	if (lt) {this.Lat0 = lt; } else {this.Lat0 = 0; }
	if (ln) {this.Lon0 = ln; } else {this.Lon0 = 0; }
	if (ut) {this.unit = ut; } else {this.unit = 0; }
	if (un) {this.unitname = un; } else {this.unitname = ''; }
	if (fe) {this.FE = fe; } else {this.FE = 0; }
	if (fn) {this.FN = fn; } else {this.FN = 0; }
	if (ea) {this.e_min = ea; } else {this.e_min = 0; }
	if (eb) {this.e_max = eb; } else {this.e_max = 0; }
	if (na) {this.n_min = na; } else {this.n_min = 0; }
	if (nb) {this.n_max = nb; } else {this.n_max = 0; }
}

function MeridianData(name, lat0, lon0, emin, emax, nmin, nmax) {
	if (name) {this.Name = name; } else {this.Name = ''; }
	if (lat0) {this.Lat0 = lat0; } else {this.Lat0 = 0; }
	if (lon0) {this.Lon0 = lon0; } else {this.Lon0 = 0; }
	if (emin) {this.e_min = emin; } else {this.e_min = 0; }
	if (emax) {this.e_max = emax; } else {this.e_max = 0; }
	if (nmin) {this.n_min = nmin; } else {this.n_min = 0; }
	if (nmax) {this.n_max = nmax; } else {this.n_max = 0; }
}

function CountyData(name, merd, sdim, cfg) {
	if (name) {this.Name = name; } else {this.Name = ''; }
	if (merd) {this.Meridian = merd; } else {this.Meridian = 0; }
        if (sdim) {this.sdims = sdim; } else {this.sdims = new Sheet_WH(31680, 21120); }
	if (cfg) {this.cfg = cfg; } else {this.cfg = 7;}
	this.Sheets = null;
}

function CountySheet(shn, shw, shs, drv) {
	if (shn) {this.ShtNum = shn; } else {this.ShtNum = ''; }
	if (shw) {this.ShtW = shw; } else {this.ShtW = 0; }
	if (shs) {this.ShtS = shs; } else {this.ShtS = 0; }
	if (drv) {this.deriv = drv; } else {this.deriv = '00000'; }
}

function Sheet_WH(w, h) {
	if (w) {this.width = w; } else {this.width = 0; }
	if (h) {this.height = h; } else {this.height = 0; }
}


function ctyshtres(cty, sht, rwe, rwn) {
	if (cty) {this.cty = cty; } else {this.cty = 0; }
	if (sht) {this.sht = sht; } else {this.sht = 0; }
	if (rwe) {this.rwe = rwe; } else {this.rwe = 0; }
	if (rwn) {this.rwn = rwn; } else {this.rwn = 0; }
}
