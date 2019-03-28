/* OpenPostcode - Ian Spillane, July 2011 - June 2012 - http://openpostcode.org */

var parameter=new Array
var precision=new Array

// region, west, north, wide, high, digits, dash, alphabet, checkalphabet, url, start, filename, tagline

parameter[0]=new parameters("Geohash-36",-180,90,360,180,10,5,"23456789bBCdDFgGhHjJKlLMnNPqQrRtTVWX","abcdefghijklmnopqrstuvwxyz","geo36.org/","bdrd5-tb4Md/n","geohash","High Precision Open-Source Global Coordinates URL/DB Encoding - Use World Postcode instead for a more human code.") //tinyurl.com/opcworld/
parameter[1]=new parameters("World",-180,90,360,180,10,5,"23456789CDFGHJKLMNPQRTVWX","0123456789ACDEFGHJKLMNPQRTUVWXY","mapplot.org/","4WMXJ-P5CC/X","world","Global, Free, Open-Source Geolocation PostCode") //tinyurl.com/opcworld/
parameter[2]=new parameters("Ireland",-10.75,55.5,5.4,4.2,8,3,"6789B5NPQC4MXRD3LWTF2KJHG","0123456789ACDEFGHJKLMNPQRTUVWXY","iemap.org/","D4TG-HK5C/5","html","Ireland's Most Precise Geolocation Postcode: smart, free & open-source; covering the island of Ireland. Version 2015.")

// Ireland change in 2015 version:
// 2 3 4 5 6 7 8 9 C D F G H J K L M N P Q R T V W X
// 6 7 8 9 B 5 N P Q C 4 M X R D 3 L W T F 2 K J H G

parameter[3]=new parameters("Hong Kong",113.8,22.6,0.7,0.5,7,4,"23456789BCDFGHJKLMNPQRTWX","0123456789ACDEFGHJKLMNPQRTUVWXY","mapplot.org/","M962-65/J","hongkong","Open-Source Geolocation Postcode for Hong Kong (beta)") //tinyurl.com/opchongkong/
//parameter[8]=new parameters("Benin",0.7,12.41,3.2,6.2,8,4,"23456789CDFGHJKLMNPQRTVWX","0123456789ACDEFGHJKLMNPQRTUVWXY","mapplot.org/","VWH6-6R/0","benin","Open-Source Geolocation Postcode for Benin (beta 0.1)")
parameter[4]=new parameters("Yemen",42.53,19.01,12.01,6.9,8,4,"123456789FSPGYLMNRATWKHXZ","ACDEFGHJKLMNPQRTUVWXY0123456789","mapplot.org/","SA87-YA67/W","html","National Address Code Yemen (Beta)")
parameter[5]=new parameters("India",68,35.6,29.4,28.9,9,4,"23456789BCDFGHJKLMNPQRTWX","0123456789ACDEFGHJKLMNPQRTUVWXY","mapplot.org/","896755BP5/0","html","भारतीय गणराज्य India Open Postcodes<br><i>avg. accuracy < 1m (beta 0.2)</i>")
//parameter[6]=new parameters("USA 48",-124.8,49.4,57.9,24.9,9,4,"23456789CDFGHJKLMNPQRTVWX","0123456789ACDEFGHJKLMNPQRTUVWXY","mapplot.org/","K2JLV6K/Q","html","U.S.A. Contiguous 48 States (beta 0.1)")
//parameter[7]=new parameters("Alaska",172.4,71.4,57.6,20.3,9,4,"23456789CDFGHJKLMNPQRTVWX","0123456789ACDEFGHJKLMNPQRTUVWXY","mapplot.org/","QC2N7CH/Q","html","AK U.S.A. (beta 0.1)")

/* Irish postcodes */

precision[8]="1.2m x .9m (avg. offset ~0.58m), geolocation for inventory & infrastructure (signage, fittings, poles, meters, etc.)."
precision[7]="5.98m x 4.6m (avg. offset <3m), postcodes for individual buildings, entrances; infrastructure (bridges, junctions, etc.)."
precision[6]="30m x 23m, postcodes for many sites and campuses."
precision[5]="150m x 115m, large campus, street segments."
precision[4]=".75km x .57km, neighbourhood areas."
precision[3]="3.7km x 2.9km, small area statistics, private address, service calculations."
precision[2]="19km x 14km, statistical regions, marketing, etc."
precision[1]="93km x 72km, coarse geographical statistics."

/* Other Settings */

colour1="#FFFFFF"
colour2="#DDDDDD"
colour3="#AAAAAA"






