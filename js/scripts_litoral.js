
////////////////////////////////////MAPA DE LITORAL/////////////////////////////////////

/////Creación de un mapa de Leaflet/////
var map = L.map("mapid_litoral");
// Centro del mapa y nivel de acercamiento
var guanacaste = L.latLng([10.557188, -85.372099]);
var zoomLevel = 9;

/////Definición de la vista del mapa/////
map.setView(guanacaste, zoomLevel);

/////Adición de capa base/////
esriLayer = L.tileLayer.provider("Esri.WorldImagery",{attribution: false}).addTo(map);
osmLayer = L.tileLayer.provider("OpenStreetMap.Mapnik",{attribution: false}).addTo(map);


var baseMaps = {
	"ESRI World Imagery": esriLayer,
	"OpenStreetMap": osmLayer,   
};

var overlayMaps = {};

/////Adición de control de capas/////
var control_layers = L.control.layers(baseMaps, overlayMaps, {position:'topleft'}).addTo(map);
L.control.scale({position:'bottomleft', imperial:false}).addTo(map);

///// Adición de la capa distritos con datos de cantidad de estructura presente///
$.getJSON("distritos.geojson", function (geojson) {
	var layer_geojson_distritos = L.choropleth(geojson, {
		valueProperty: 'estructura',
		scale: ['gray', 'orange'],
		steps: 5,
		mode: 'q',
		style: {
			color: '#fff',
			weight: 2,
			fillOpacity: 0.8
		},
		onEachFeature: function (feature, layer) {
			layer.bindPopup('distritos ' + feature.properties.distrito + '<br>' + feature.properties.estructura.toLocaleString() + 'estructura')
		}
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_distritos, 'Cantidad de estrucutras por distrito');	
	
	//Adición de la legenda//
    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = layer_geojson_distritos.options.limits
    var colors = layer_geojson_distritos.options.colors
    var labels = []

    //Adición datos minimo sy máximos//
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  legend.addTo(map)
	
});

/////Adición capa de estructuras/////
$.getJSON("geojason/Estructura.geojson", function(geodata) {
	var layer_geojson_Estructura = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#395285", 'weight':1.5}
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_Estructura, 'Estructuras');
});