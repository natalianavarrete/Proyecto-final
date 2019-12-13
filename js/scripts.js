
////////////////////////////////////MAPA DE UBICACIÓN/////////////////////////////////////

// Creación de un mapa de Leaflet
var map = L.map("mapid");
// Centro del mapa y nivel de acercamiento
var guanacaste = L.latLng([10.557188, -85.372099]);
var zoomLevel = 9;

// Definición de la vista del mapa
map.setView(guanacaste, zoomLevel);

// Adición de capa base
esriLayer = L.tileLayer.provider("Esri.WorldImagery",{attribution: false}).addTo(map);
osmLayer = L.tileLayer.provider("OpenStreetMap.Mapnik",{attribution: false}).addTo(map);


var baseMaps = {
	"ESRI World Imagery": esriLayer,
	"OpenStreetMap": osmLayer,   
};

var overlayMaps = {};

/////CONTROLES/////

var control_layers = L.control.layers(baseMaps, overlayMaps, {position:'topleft'}).addTo(map);
L.control.scale({position:'bottomleft', imperial:false}).addTo(map);

// Marcador para la Catedral Metropolitana de San José  //claseL.marker([lat, long],{opcion:valor deseado, opcion:valor deseado}).addTo(map);
var guanacasteMarker = L.marker([10.557188, -85.372099], {draggable:true, opacity:0.5}).addTo(map);
guanacasteMarker.bindTooltip("Provincia de Guanacaste").openTooltip();	// Enseña la información al pasar el cursol x encima dle punto, sin darle click	

$.getJSON("geojason/guanacaste.geojson", function(geodata) {
	var layer_geojson_guanacaste = L.geoJson(geodata, {
		style: function(feature) {return {'color': "#943126", 'weight': 5}}}).addTo(map);
	control_layers.addOverlay(layer_geojson_guanacaste, 'guanacaste');
});

