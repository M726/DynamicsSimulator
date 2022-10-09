class number2 {
    x;
    y;
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
    Add(a) {
        return new number2(this.x + a.x, this.y + a.y);
    }
    Subtract(a) {
        return new number2(this.x - a.x, this.y - a.y);
    }
    Dot(a) {
        return this.x * a.x + this.y * a.y;
    }
    ScalarMultiply(a) {
        return new number2(this.x * a, this.y * a);
    }
    ScalarDivide(a) {
        return new number2(this.x / a, this.y / a);
    }
    Length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    Normalize() {
        return this.ScalarDivide(this.Length());
    }
}
class number3 {
    x;
    y;
    z;
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
    Add(a) {
        return new number3(this.x + a.x, this.y + a.y, this.z + a.z);
    }
    Subtract(a) {
        return new number3(this.x - a.x, this.y - a.y, this.z - a.z);
    }
    Dot(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }
    ScalarMultiply(a) {
        return new number3(this.x * a, this.y * a, this.z * a);
    }
    ScalarDivide(a) {
        return new number3(this.x / a, this.y / a, this.z / a);
    }
    Length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    Normalize() {
        return this.ScalarDivide(this.Length());
    }
}
//# sourceMappingURL=math.js.map