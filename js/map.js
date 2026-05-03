import { MAP_CONFIG, TILE_LAYER_CONFIG, POLYLINE_OPTIONS, ARROW_DECORATOR_CONFIG } from './config.js';
import { filterCSV, getCurvedLine, processDataToGeoJSON, splitFeaturesByAccommodation } from './data-utils.js';
import { createPopupContent, createMarker } from './markers.js';

let map = L.map('map', MAP_CONFIG);

L.tileLayer(TILE_LAYER_CONFIG.url, TILE_LAYER_CONFIG.options).addTo(map);

const tripSelector = document.getElementById('trip-selector');
const showSightsCheckbox = document.getElementById('show-sights');
let currentData = [];
let polylineLayer;
let decoratorLayer;
let nonAccommodationLayer;
let accommodationLayer;

tripSelector.addEventListener('change', function() {
    const selectedTrip = tripSelector.value;
    loadTripData(`./data/${selectedTrip}`);
});

showSightsCheckbox.addEventListener('change', function() {
    renderMap();
});

function clearMapLayers() {
    if (polylineLayer) map.removeLayer(polylineLayer);
    if (decoratorLayer) map.removeLayer(decoratorLayer);
    if (nonAccommodationLayer) map.removeLayer(nonAccommodationLayer);
    if (accommodationLayer) map.removeLayer(accommodationLayer);
}

function createArrowDecorator(polyline) {
    return L.polylineDecorator(polyline, {
        patterns: [
            {
                offset: ARROW_DECORATOR_CONFIG.offset,
                repeat: ARROW_DECORATOR_CONFIG.repeat,
                symbol: L.Symbol.arrowHead({
                    pixelSize: ARROW_DECORATOR_CONFIG.pixelSize,
                    pathOptions: {
                        fillOpacity: 1,
                        weight: 0,
                        color: ARROW_DECORATOR_CONFIG.color
                    }
                })
            }
        ]
    });
}

function drawPolyline(data) {
    polylineLayer = L.polyline(getCurvedLine(data), POLYLINE_OPTIONS).addTo(map);
    decoratorLayer = createArrowDecorator(polylineLayer).addTo(map);
}

function drawMarkers(geojson) {
    const { accommodation, other } = splitFeaturesByAccommodation(geojson);

    if (other.length > 0) {
        nonAccommodationLayer = L.geoJSON({ type: 'FeatureCollection', features: other }, {
            onEachFeature: createPopupContent,
            pointToLayer: createMarker
        }).addTo(map);
    }

    // Draw accommodation markers last so they appear on top when overlapping with other markers
    accommodationLayer = L.geoJSON({ type: 'FeatureCollection', features: accommodation }, {
        onEachFeature: createPopupContent,
        pointToLayer: createMarker
    }).addTo(map);
}

function fitMapBounds(geojson) {
    let bounds = L.geoJSON(geojson).getBounds();
    map.fitBounds(bounds);
}

function renderMap() {
    clearMapLayers();

    const dataToShow = showSightsCheckbox.checked
        ? currentData
        : currentData.filter(d => d.type === 'accommodation');

    drawPolyline(dataToShow);

    const pointsGeojson = processDataToGeoJSON(dataToShow);
    drawMarkers(pointsGeojson);
    fitMapBounds(pointsGeojson);
}

function loadTripData(url) {
    d3.csv(url, filterCSV).then(function(data) {
        currentData = data;

        const hasSights = data.some(d => d.type !== 'accommodation');
        showSightsCheckbox.disabled = !hasSights;
        if (!hasSights) {
            showSightsCheckbox.checked = false;
        }

        renderMap();
    });
}

window.loadTripData = loadTripData;
