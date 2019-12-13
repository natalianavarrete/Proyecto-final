
////////////////////////////////////MAPA DE Áreas Protegidas/////////////////////////////////////

///// Creación de un mapa de Leaflet/////
var map = L.map("mapid");

/////Centro del mapa y nivel de acercamiento/////
var ACG = L.latLng([10.557188, -85.372099]);
var zoomLevel = 9;

/////Definición de la vista del mapa/////
map.setView(ACG, zoomLevel);

/////Adición de capa base/////
esriLayer = L.tileLayer.provider("Esri.WorldImagery",{attribution: false}).addTo(map);
osmLayer = L.tileLayer.provider("OpenStreetMap.Mapnik",{attribution: false}).addTo(map);

var baseMaps = {
	"ESRI World Imagery": esriLayer,
	"OpenStreetMap": osmLayer,   
};

var Overlay = {};

///// Adición de control de capas/////
var control_layers = L.control.layers(baseMaps, Overlay, {position:'topleft'}).addTo(map);
L.control.scale({position:'bottomleft', imperial:false}).addTo(map);

///// Adición de capa de áreas protegidas/////
$.getJSON("geojason/areas_protegidas.geojson", function(geodata) {
	var layer_geojson_ap= L.geoJson(geodata, {
		style: function(feature) {return {'color': "#0E6655"}},onEachFeature: function(feature, layer) {
			var popupText = "Área protegida: " + feature.properties.NOMBRE;
			layer.bindPopup(popupText);
		} }).addTo(map);
	control_layers.addOverlay(layer_geojson_ap, 'ap');
});

///// Adición de capa de senderos/////
$.getJSON("geojason/senderos_84.geojson", function(geodata) {
	var layer_geojson_senderos= L.geoJson(geodata, {
		style: function(feature) {return {'color': "#B7950B"}}}).addTo(map);
	control_layers.addOverlay(layer_geojson_senderos, 'Senderos');
});


