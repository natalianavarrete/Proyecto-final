
////////////////////////////////////MAPA DE LITORAL/////////////////////////////////////

////Funsión de opacidad/////
function updateOpacity() {
	document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
	temperaturaLayer.setOpacity(document.getElementById("sld-opacity").value);
}


/////Creación de un mapa de Leaflet/////
var map = L.map("mapid");
// Centro del mapa y nivel de acercamiento
var guanacaste = L.latLng([10.557188, -85.372099]);
var zoomLevel = 9;

///// Definición de la vista del mapa///
map.setView(guanacaste, zoomLevel);

/////Adición de la imagen raster/////
var temperaturaLayer = L.imageOverlay("bio1_cr.png", 
	[[11.2197734290000000, -85.9790724540000042], 
	[8.0364413690000003, -82.5540738239999996]], 
	{opacity:0.5}
).addTo(map);

///// Adición de capa base/////
esriLayer = L.tileLayer.provider("Esri.WorldImagery",{attribution: false}).addTo(map);
osmLayer = L.tileLayer.provider("OpenStreetMap.Mapnik",{attribution: false}).addTo(map);

var baseMaps = {
	"ESRI World Imagery": esriLayer,
	"OpenStreetMap": osmLayer,   
};

var overlayMaps = {};

///// Adición de control de capas/////
var control_layers = L.control.layers(baseMaps, overlayMaps, {position:'topleft'}).addTo(map);
L.control.scale({position:'bottomleft', imperial:false}).addTo(map);

/////Funsión de definición de colores para las instituciones de las estaciones///// 
function colorPuntos(d) { 
	return d == "SENARA" ? '#4682B4' :
	d == "IMN" ? '#87CEFA' : 
	d == "ICE" ? '#FFD700' : 
		'#000000'; 
};

/////Funsión de estilo para las estaciones///// 
function estilo_estaciones (feature) {
	return{
	radius: 7,
	fillColor: colorPuntos(feature.properties.INSTITUCIO), 
	color: colorPuntos(feature.properties.INSTITUCIO), 
	weight: 1,
	opacity : 1,
	fillOpacity : 0.8};
};

/////Funsión para las ventanas emergen con información de las estaciones///// 
function popup_estaciones (feature, layer) {
	layer.bindPopup("<div style=text-align:ESTACIÓN><h3>"+feature.properties.ESTACION+
	"<h3></div><hr><table><tr><td>CUENCA: "+feature.properties.CUENCA+
	"</td></tr></table>",
	{minWidth: 150, maxWidth: 200});				
};

/////Definisión de los marcadores de las estaciones///// 
var MarkerOptions = {
	radius: 8,
	fillColor: "#ff7800",
	color: "#000",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.8
};

/////Adición de la capa de las estaciones///// 
$.getJSON("geojason/ESTACIONES.geojson", function(geodata) {
	var layer_geojson_ESTACIONES = L.geoJson(geodata, {pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, MarkerOptions);},
									style: estilo_estaciones, onEachFeature: popup_estaciones}).addTo(map);
	control_layers.addOverlay(layer_geojson_ESTACIONES, 'ESTACIONES');
});

/////Funsión para el estilo y filtro de las estaciones///// 
function estiloSelect() {
	
	var miSelect = document.getElementById("estilo").value;
		
	$.getJSON("geojason/ESTACIONES.geojson", function(geodata) {
		var layer_geojson_ESTACIONES = L.geoJson(geodata, {
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, MarkerOptions);},
			filter: function(feature, layer) {
				if(miSelect != "TODOS")
					return (feature.properties.INSTITUCIO == miSelect ); 
				else 
					return true;},
			style: estilo_estaciones, 
			onEachFeature: popup_estaciones});
				map.addLayer(layer_geojson_ESTACIONES);
	});

}

