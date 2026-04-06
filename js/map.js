import { MAP_CONFIG, TILE_LAYER_CONFIG, POLYLINE_OPTIONS } from './config.js';
import { filterCSV, getCurvedLine, processDataToGeoJSON } from './data-utils.js';
import { createPopupContent, createMarker } from './markers.js';

let map = L.map('map', MAP_CONFIG);

L.tileLayer(TILE_LAYER_CONFIG.url, TILE_LAYER_CONFIG.options).addTo(map);

const tripSelector = document.getElementById('trip-selector');

tripSelector.addEventListener('change', function() {
    const selectedTrip = tripSelector.value;
    loadTripData(`./data/${selectedTrip}`);
});

function loadTripData(url) {
    d3.csv(url, filterCSV).then(function(data) {
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });

        L.polyline(getCurvedLine(data), POLYLINE_OPTIONS).addTo(map);

        const pointsGeojson = processDataToGeoJSON(data);

        L.geoJSON(pointsGeojson, {
            onEachFeature: createPopupContent,
            pointToLayer: createMarker
        }).addTo(map);

        let bounds = L.geoJSON(pointsGeojson).getBounds();
        map.fitBounds(bounds);
    });
}

window.loadTripData = loadTripData;
