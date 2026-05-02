import { createCurvedLine } from './curves.js';

export function filterCSV(row, index, columns) {
    if (row.latitude !== '') {
        return row;
    }
}

export function getCurvedLine(data) {
    let points = [];
    let previousLatitude;
    for (let i = 0; i < data.length; i += 1) {
        let d = data[i];
        if (d.latitude !== previousLatitude) {
            points.push([+d.latitude, +d.longitude]);
            previousLatitude = d.latitude;
        }
    }
    return createCurvedLine(points, 0.5);
}

export function processDataToGeoJSON(data) {
    let pointsJson = Array.from(
        d3.rollup(
            data,
            v => ({
                name: v[0].name || v[0].accommodation || v[0].placename,
                placename: v[0].placename,
                country: v[0].country,
                type: v[0].type,
                nights: v.length,
                latitude: +v[0].latitude,
                longitude: +v[0].longitude,
                dates: v.map(e => e.date)
            }),
            d => d.latitude
        ).values()
    );

    let pointsGeojsonFeatures = [];
    pointsJson.forEach(function(point) {
        let feature = {
            type: 'Feature',
            properties: {
                name: point.name,
                placename: point.placename,
                country: point.country,
                type: point.type,
                nights: point.nights,
                dates: point.dates
            },
            geometry: {
                type: 'Point',
                coordinates: [point.longitude, point.latitude]
            }
        };
        pointsGeojsonFeatures.push(feature);
    });

    return {
        type: 'FeatureCollection',
        features: pointsGeojsonFeatures
    };
}

export function splitFeaturesByAccommodation(geojson) {
    return {
        accommodation: geojson.features.filter(f => f.properties.type === 'accommodation'),
        other: geojson.features.filter(f => f.properties.type !== 'accommodation')
    };
}
