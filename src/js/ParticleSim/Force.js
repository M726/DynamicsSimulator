class RopeBreakable {
    pA;
    pB;
    restLength;
    kConst;
    dConst;
    maxForce;
    dx = 0;
    dy = 0;
    dL = 0;
    magnitude = 0;
    constructor(pA, pB, kConstNewtonPerMeter, restLength, dampening, breakingForce) {
        this.pA = pA;
        this.pB = pB;
        this.restLength = restLength;
        this.kConst = kConstNewtonPerMeter;
        this.maxForce = breakingForce;
        if (dampening !== undefined)
            this.dConst = dampening;
    }
    ApplyForce() {
        //This get EXTREMELY SLOW if you assign variables within.
        this.dx = this.pA.x - this.pB.x;
        this.dy = this.pA.y - this.pB.y;
        if (this.dx == 0 && this.dy == 0) {
            return;
        }
        this.dL = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.magnitude = (this.kConst * (this.dL - this.restLength) + this.dConst * ((dot(this.pA.u - this.pB.u, this.pA.v - this.pB.v, this.dx, this.dy)) / this.dL)) / this.dL;
        if (this.magnitude <= 0)
            return; // Adds Rope behavior when length is smaller than restlength
        this.pA.AddForce(-this.magnitude * this.dx, -this.magnitude * this.dy);
        this.pB.AddForce(this.magnitude * this.dx, this.magnitude * this.dy);
        if (this.magnitude > this.maxForce) {
            this.kConst = 0;
            this.dConst = 0;
        }
    }
}
class Spring extends RopeBreakable {
    constructor(pA, pB, kConstNewtonPerMeter, restLength, dampening) {
        super(pA, pB, kConstNewtonPerMeter, 0, dampening, Number.MAX_SAFE_INTEGER);
    }
}
//# sourceMappingURL=Force.js.map