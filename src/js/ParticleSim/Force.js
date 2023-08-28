class UnaryForce {
    forceApplierFunction(p) {
    }
    ApplyForce(ps) {
        ps.forEach(e => {
            this.forceApplierFunction(e);
        });
    }
}
class NAryForce {
    forceApplierFunction() { }
    ApplyForce(_ps) {
        this.forceApplierFunction();
    }
}
class Gravity extends UnaryForce {
    acceleration = -9.81;
    constructor(acceleration) {
        super();
        if (acceleration !== undefined)
            this.acceleration = acceleration;
    }
    forceApplierFunction(p) {
        p.AddForce(0, -this.acceleration * p.massKg);
    }
}
class ViscousDrag extends UnaryForce {
    kConstant = 0.01;
    constructor(kConstNewtonSecondPerMeter2) {
        super();
        if (kConstNewtonSecondPerMeter2 !== undefined)
            this.kConstant = kConstNewtonSecondPerMeter2;
    }
    forceApplierFunction(p) {
        p.AddForce(-this.kConstant * p.u, -this.kConstant * p.v);
    }
}
class Spring extends NAryForce {
    pA;
    pB;
    restLength;
    kConst;
    dConst = 0.01;
    constructor(pA, pB, kConstNewtonPerMeter, restLength, dampening) {
        super();
        this.pA = pA;
        this.pB = pB;
        this.restLength = restLength;
        this.kConst = kConstNewtonPerMeter;
        if (dampening !== undefined)
            this.dConst = dampening;
    }
    forceApplierFunction() {
        let dx = this.pA.x - this.pB.x;
        let dy = this.pA.y - this.pB.y;
        let dPos = Math.sqrt(dx * dx + dy * dy);
        let magnitude = -(this.kConst * (dPos - this.restLength) + this.dConst * ((dot(this.pA.u - this.pB.u, this.pA.v - this.pB.v, dx, dy)) / dPos)) / dPos;
        this.pA.AddForce(magnitude * dx, magnitude * dy);
        this.pB.AddForce(-magnitude * dx, -magnitude * dy);
    }
}
class Rope extends NAryForce {
    pA;
    pB;
    restLength;
    kConst;
    dConst = 0.01;
    constructor(pA, pB, kConstNewtonPerMeter, restLength, dampening) {
        super();
        this.pA = pA;
        this.pB = pB;
        this.restLength = restLength;
        this.kConst = kConstNewtonPerMeter;
        if (dampening !== undefined)
            this.dConst = dampening;
    }
    forceApplierFunction() {
        let dx = this.pA.x - this.pB.x;
        let dy = this.pA.y - this.pB.y;
        let dPos = Math.sqrt(dx * dx + dy * dy);
        let magnitude = -(this.kConst * (dPos - this.restLength) + this.dConst * ((dot(this.pA.u - this.pB.u, this.pA.v - this.pB.v, dx, dy)) / dPos)) / dPos;
        if (magnitude > 0)
            return;
        this.pA.AddForce(magnitude * dx, magnitude * dy);
        this.pB.AddForce(-magnitude * dx, -magnitude * dy);
    }
}
class RopeBreakable extends NAryForce {
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
        super();
        this.pA = pA;
        this.pB = pB;
        this.restLength = restLength;
        this.kConst = kConstNewtonPerMeter;
        this.maxForce = breakingForce;
        if (dampening !== undefined)
            this.dConst = dampening;
    }
    forceApplierFunction() {
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
class GravityN extends NAryForce {
    pA;
    pB;
    g = 6.6743e-11;
    constructor(pA, pB, gravitationalConstant) {
        super();
        this.pA = pA;
        this.pB = pB;
        if (gravitationalConstant !== undefined)
            this.g = gravitationalConstant;
    }
    forceApplierFunction() {
        let dx = this.pA.x - this.pB.x;
        let dy = this.pA.y - this.pB.y;
        let dPos = Math.sqrt(dx * dx + dy * dy);
        let r = distanceParticles(this.pA, this.pB);
        let force = this.g * this.pA.massKg * this.pB.massKg / (r * r * dPos);
        this.pA.AddForce(-force * dx, -force * dy);
        this.pB.AddForce(force * dx, force * dy);
    }
}
//# sourceMappingURL=Force.js.map