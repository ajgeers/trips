function distance(p1, p2) {
    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
}

// Centripetal Catmull-Rom spline prevents overshooting by using distance-based parameterization
// alpha: 0 = uniform, 0.5 = centripetal, 1.0 = chordal
export function createCurvedLine(points, alpha = 1.0) {
    if (points.length < 2) return points;

    let curvePoints = [];
    let steps = 20;

    for (let i = 0; i < points.length - 1; i++) {
        let p0 = i > 0 ? points[i - 1] : points[i];
        let p1 = points[i];
        let p2 = points[i + 1];
        let p3 = i + 2 < points.length ? points[i + 2] : points[i + 1];

        let t0 = 0;
        let t1 = Math.pow(distance(p0, p1), alpha) + t0;
        let t2 = Math.pow(distance(p1, p2), alpha) + t1;
        let t3 = Math.pow(distance(p2, p3), alpha) + t2;

        if (t1 - t0 < 0.0001) t1 = t0 + 0.0001;
        if (t2 - t1 < 0.0001) t2 = t1 + 0.0001;
        if (t3 - t2 < 0.0001) t3 = t2 + 0.0001;

        for (let step = 0; step <= steps; step++) {
            let t = t1 + (step / steps) * (t2 - t1);

            let A1_lat = (t1 - t) / (t1 - t0) * p0[0] + (t - t0) / (t1 - t0) * p1[0];
            let A1_lng = (t1 - t) / (t1 - t0) * p0[1] + (t - t0) / (t1 - t0) * p1[1];
            let A2_lat = (t2 - t) / (t2 - t1) * p1[0] + (t - t1) / (t2 - t1) * p2[0];
            let A2_lng = (t2 - t) / (t2 - t1) * p1[1] + (t - t1) / (t2 - t1) * p2[1];
            let A3_lat = (t3 - t) / (t3 - t2) * p2[0] + (t - t2) / (t3 - t2) * p3[0];
            let A3_lng = (t3 - t) / (t3 - t2) * p2[1] + (t - t2) / (t3 - t2) * p3[1];

            let B1_lat = (t2 - t) / (t2 - t0) * A1_lat + (t - t0) / (t2 - t0) * A2_lat;
            let B1_lng = (t2 - t) / (t2 - t0) * A1_lng + (t - t0) / (t2 - t0) * A2_lng;
            let B2_lat = (t3 - t) / (t3 - t1) * A2_lat + (t - t1) / (t3 - t1) * A3_lat;
            let B2_lng = (t3 - t) / (t3 - t1) * A2_lng + (t - t1) / (t3 - t1) * A3_lng;

            let C_lat = (t2 - t) / (t2 - t1) * B1_lat + (t - t1) / (t2 - t1) * B2_lat;
            let C_lng = (t2 - t) / (t2 - t1) * B1_lng + (t - t1) / (t2 - t1) * B2_lng;

            if (step === 0 && i > 0) continue;
            curvePoints.push([C_lat, C_lng]);
        }
    }

    return curvePoints;
}
