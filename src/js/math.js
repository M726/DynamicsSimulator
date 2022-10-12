function dot(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}
function distanceParticles(pA, pB) {
    return distanceBetweenPoints(pA.x, pA.y, pB.x, pB.y);
}
function distanceBetweenPoints(x1, y1, x2, y2) {
    return distance(x2 - x1, y2 - y1);
}
function distance(x, y) {
    return Math.sqrt(x * x + y * y);
}
//# sourceMappingURL=math.js.map