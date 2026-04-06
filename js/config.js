export const MAP_CONFIG = {
    zoomSnap: 0.5,
    worldCopyJump: true
};

export const TILE_LAYER_CONFIG = {
    url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    options: {
        attribution: '&copy; <a href="http://mapbox.com">Mapbox</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
        id: 'mapbox/light-v10',
        accessToken: 'pk.eyJ1IjoiYWpnZWVycyIsImEiOiJjaWs5cHZmMWswZDJ6dmhrdTg3YnNidW44In0.QPU_FxLe89puMPjldiaFCg',
        tileSize: 512,
        zoomOffset: -1
    }
};

export const POLYLINE_OPTIONS = {
    color: 'black',
    weight: 1
};

export const MARKER_COLORS = {
    accommodation: '#D9534F',
    other: '#FFA94D'
};
