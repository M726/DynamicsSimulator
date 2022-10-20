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
//# sourceMappingURL=Force.js.map