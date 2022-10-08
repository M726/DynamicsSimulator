class UnaryForce {
    forceApplierFunction(p) {
        return new number2(0, 0);
    }
    ApplyForce(ps) {
        ps.forEach(e => {
            e.AddForce(this.forceApplierFunction(e));
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
    constructor(acceleration) {
        super();
        this.acceleration = 9.81;
        if (acceleration !== undefined)
            this.acceleration = acceleration;
    }
    forceApplierFunction(p) {
        return (new number2(0, -9.81)).ScalarMultiply(p.mass);
    }
}
class ViscousDrag extends UnaryForce {
    constructor(kConstant) {
        super();
        this.kConstant = 0.01;
        if (kConstant !== undefined)
            this.kConstant = kConstant;
    }
    forceApplierFunction(p) {
        return p.velocity.ScalarMultiply(-this.kConstant);
    }
}
class Spring extends NAryForce {
    constructor(pA, pB, springConstant, restLength, dampening) {
        super();
        this.dConst = 0.01;
        this.pA = pA;
        this.pB = pB;
        this.restLength = restLength;
        this.kConst = springConstant;
        if (dampening !== undefined)
            this.dConst = dampening;
    }
    forceApplierFunction() {
        let l = this.pA.position.Subtract(this.pB.position);
        let i = this.pA.velocity.Subtract(this.pB.velocity);
        let F = l.Normalize().ScalarMultiply(-this.kConst * (l.Length() - this.restLength) - this.dConst * (i.Dot(l) / l.Length()));
        this.pA.AddForce(F);
        this.pB.AddForce(F.ScalarMultiply(-1));
    }
}
class Particle {
    constructor() {
        this.mass = 1;
        this.forceAcc = new number2(0, 0);
        if (arguments.length == 4) {
            this.position = new number2(arguments[0], arguments[1]);
            this.velocity = new number2(arguments[2], arguments[3]);
        }
        else {
            this.position = arguments[0];
            this.velocity = arguments[1];
        }
    }
    toString() {
        return this.position.toString() + " " + this.velocity.toString();
    }
    AddForce(force) {
        this.forceAcc = this.forceAcc.Add(force);
    }
    ClearForces() {
        this.forceAcc.set(0, 0);
    }
}
class ParticleSystem {
    constructor() {
        this.dimension = 2; //2D
        this.particles = [];
        this.forces = [];
    }
    GetPhaseSpaceDimension() {
        //2*n*dimension
        return 2 * this.dimension * this.particles.length;
    }
    GetParticles() {
        return this.particles;
    }
    forEach(callbackfn) {
        for (let i = 0; i < this.particles.length; i++) {
            callbackfn(this.particles[i]);
        }
    }
    AddParticle(a, b) {
        if (typeOf(a) === 'Particle') {
            this.particles.push(a);
            return;
        }
        this.particles.push(new Particle(a, b));
    }
    AddForce(force) {
        this.forces.push(force);
    }
    ClearForces() {
        this.forEach(e => {
            e.ClearForces();
        });
    }
    ComputeForces() {
        this.forces.forEach(e => {
            e.ApplyForce(this);
        });
    }
}
//# sourceMappingURL=cMotion.js.map