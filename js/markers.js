import { MARKER_COLORS } from './config.js';

function formatDateRange(dates) {
    if (!dates || dates.length === 0) return '';

    const sortedDates = dates.map(d => new Date(d)).sort((a, b) => a - b);
    const ranges = [];
    let rangeStart = sortedDates[0];
    let rangeEnd = sortedDates[0];

    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = sortedDates[i - 1];
        const currDate = sortedDates[i];
        const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
            rangeEnd = currDate;
        } else {
            ranges.push([rangeStart, rangeEnd]);
            rangeStart = currDate;
            rangeEnd = currDate;
        }
    }
    ranges.push([rangeStart, rangeEnd]);

    const formatted = ranges.map(([start, end]) => {
        const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
        const startDay = start.getDate();
        const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
        const endDay = end.getDate();
        const year = start.getFullYear();

        if (start.getTime() === end.getTime()) {
            return `${startMonth} ${startDay}, ${year}`;
        } else if (startMonth === endMonth) {
            return `${startMonth} ${startDay}-${endDay}, ${year}`;
        } else {
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
        }
    });

    if (formatted.length === 1) {
        return formatted[0];
    } else if (formatted.length === 2) {
        return formatted.join(' and ');
    } else {
        return formatted.slice(0, -1).join(', ') + ', and ' + formatted[formatted.length - 1];
    }
}

export function createPopupContent(feature, layer) {
    let content = `<div style="font-family: sans-serif; min-width: 150px; font-size: 14px;">`;

    if (feature.properties.country) {
        content += `<div style="color: #666; margin-bottom: 4px; font-size: 12px;">${feature.properties.country}</div>`;
    }

    if (feature.properties.placename) {
        content += `<div style="font-weight: bold; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
            ${feature.properties.placename}
        </div>`;
    }

    if (feature.properties.type) {
        content += `<div style="color: #888; font-size: 12px; margin-bottom: 4px; text-transform: capitalize;">${feature.properties.type}</div>`;
    }

    if (feature.properties.name) {
        content += `<div style="margin-bottom: 8px;">${feature.properties.name}</div>`;
    }

    if (feature.properties.dates && feature.properties.dates.length > 0) {
        const dateText = formatDateRange(feature.properties.dates);
        content += `<div style="padding-top: 8px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            ${dateText}
        </div>`;
    }

    content += '</div>';
    layer.bindPopup(content);
}

export function createMarker(feature, latlng) {
    const isAccommodation = feature.properties.type === 'accommodation';
    return L.circleMarker(latlng, {
        radius: 8,
        fillColor: isAccommodation ? MARKER_COLORS.accommodation : MARKER_COLORS.other,
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    });
}
