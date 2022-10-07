class number2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `(${this.x},${this.y})`;
    }
    Length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
class number3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}
function dotn2(a, b) {
    return a.x * b.x + a.y * b.y;
}
function dotn3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}
function addn2(a, b) {
    return new number2(a.x + b.x, a.y + b.y);
}
function addn3(a, b) {
    return new number3(a.x + b.x, a.y + b.y, a.z + b.z);
}
//# sourceMappingURL=math.js.map