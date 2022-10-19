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
class Particle {
    x;
    y;
    u;
    v;
    massKg = 1;
    radius;
    forceX;
    forceY;
    lockPosition = false;
    constructor(x, y, u, v, massKg, radius) {
        this.x = x;
        this.y = y;
        this.u = u;
        this.v = v;
        this.massKg = massKg;
        if (radius != undefined)
            this.radius = radius;
        else
            this.radius = massKg;
        this.forceX = 0;
        this.forceY = 0;
    }
    toString() {
        return `(${this.x},${this.y})`;
    }
    AddForce(x, y) {
        this.forceX += x;
        this.forceY += y;
    }
    ClearForces() {
        this.forceX = 0;
        this.forceY = 0;
    }
    LockPosition() {
        this.lockPosition = true;
        this.u = 0;
        this.v = 0;
    }
    UnlockPosition() {
        this.lockPosition = false;
    }
    IsLocked() {
        return this.lockPosition;
    }
}
class ParticleSystem {
    dimension = 2; //2D
    particles = [];
    forces = [];
    clock = 0;
    solver = new ODESolverRK4();
    AddParticle(particle) {
        this.particles.push(particle);
    }
    GetParticles() {
        return this.particles;
    }
    FindClosestParticle(x, y) {
        let returnParticle = this.particles[0];
        let dist = this.GetDistanceToParticle(this.particles[0], x, y);
        for (let i = 0; i < this.particles.length; i++) {
            let d = this.GetDistanceToParticle(this.particles[i], x, y);
            if (d < dist) {
                dist = d;
                returnParticle = this.particles[i];
            }
        }
        return returnParticle;
    }
    GetDistanceToParticle(particle, x, y) {
        return distanceBetweenPoints(particle.x, particle.y, x, y);
    }
    AddForce(force) {
        this.forces.push(force);
    }
    GetForces() {
        return this.forces;
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
    ComputeConstraintForces() {
        for (let i = 0; i < this.particles.length - 1; i++) {
            //Find Collisions with other Particles
            for (let j = i + 1; j < this.particles.length; j++) {
                if (this.collisionCheck(this.particles[i], this.particles[j])) {
                    //console.log("Collision: " + this.particles[i].toString() + ", " + this.particles[j].toString())
                    //Collision Found
                    //coefficientOfRestitution = delta_v_f/delta_v_i
                }
            }
        }
    }
    GetPhaseSpaceDimension() {
        //2*n*dimension
        return 4 * this.particles.length;
    }
    GetStateVector() {
        let r = new Array(this.GetPhaseSpaceDimension());
        for (let i = 0; i < this.particles.length; i++) {
            r[4 * i] = this.particles[i].x;
            r[4 * i + 1] = this.particles[i].y;
            r[4 * i + 2] = this.particles[i].u;
            r[4 * i + 3] = this.particles[i].v;
        }
        return r;
    }
    SetStateVector(r) {
        for (let i = 0; i < this.particles.length; i++) {
            if (!this.particles[i].IsLocked()) {
                this.particles[i].x = (r[4 * i]);
                this.particles[i].y = (r[4 * i + 1]);
                this.particles[i].u = (r[4 * i + 2]);
                this.particles[i].v = (r[4 * i + 3]);
            }
        }
    }
    GetParticleDerivatives() {
        this.ClearForces();
        this.ComputeForces();
        let r = new Array(this.GetPhaseSpaceDimension());
        for (let i = 0; i < this.particles.length; i++) {
            r[4 * i] = this.particles[i].u;
            r[4 * i + 1] = this.particles[i].v;
            r[4 * i + 2] = this.particles[i].forceX / this.particles[i].massKg;
            r[4 * i + 3] = this.particles[i].forceY / this.particles[i].massKg;
        }
        return r;
    }
    AddVectors(a, b) {
        let result = new Array(a.length);
        for (let i = 0; i < a.length; i++) {
            result[i] = a[i] + b[i];
        }
        return result;
    }
    AddVectors4(a, b, c, d) {
        let result = new Array(a.length);
        for (let i = 0; i < a.length; i++) {
            result[i] = a[i] + b[i] + c[i] + d[i];
        }
        return result;
    }
    ScaleVectors(derivs, factor) {
        let result = new Array(derivs.length);
        for (let i = 0; i < derivs.length; i++) {
            result[i] = derivs[i] * factor;
        }
        return result;
    }
    RunTimeStep(dt) {
        this.solver.Solve(this, dt);
        this.clock += dt;
    }
    forEach(callbackfn) {
        for (let i = 0; i < this.particles.length; i++) {
            callbackfn(this.particles[i]);
        }
    }
    collisionCheck(pA, pB) {
        return distanceParticles(pA, pB) < (pA.radius + pB.radius);
    }
}
class ODESolverEuler {
    Solve(ps, dt) {
        let statev = ps.GetStateVector();
        //x(t_0+h) = x(t_0) + deriv(t_0) * dt
        //result = statev + deriv * dt
        ps.SetStateVector(ps.AddVectors(statev, ps.ScaleVectors(ps.GetParticleDerivatives(), dt)));
    }
}
class ODESolverMidpoint {
    Solve(ps, dt) {
        let statev = ps.GetStateVector();
        let result = new Array(statev.length);
        //x(t_0+h) = x(t_0) + deriv(t_0) * dt + 
        //result = statev + deriv * dt
        ps.SetStateVector(ps.AddVectors(statev, ps.ScaleVectors(ps.GetParticleDerivatives(), dt * 0.5)));
        ps.SetStateVector(ps.AddVectors(statev, ps.ScaleVectors(ps.GetParticleDerivatives(), dt)));
    }
}
class ODESolverRK4 {
    Solve(ps, dt) {
        let statev = ps.GetStateVector();
        let k1 = ps.GetParticleDerivatives();
        ps.SetStateVector(ps.AddVectors(statev, ps.ScaleVectors(k1, dt / 2)));
        let k2 = ps.GetParticleDerivatives();
        ps.SetStateVector(ps.AddVectors(statev, ps.ScaleVectors(k2, dt / 2)));
        let k3 = ps.GetParticleDerivatives();
        ps.SetStateVector(ps.AddVectors(statev, ps.ScaleVectors(k3, dt)));
        let k4 = ps.GetParticleDerivatives();
        //ps.SetStateVector(ps.AddVectors(statev,ps.ScaleVectors(k1,0.5)));
        ps.SetStateVector(ps.AddVectors(statev, ps.ScaleVectors(ps.AddVectors4(k1, ps.ScaleVectors(k2, 2), ps.ScaleVectors(k3, 2), k4), dt / 6)));
        //console.log(ps.AddVectorArray([k1, ps.ScaleVectors(k2,2), ps.ScaleVectors(k3,2), k4]));
    }
}
//# sourceMappingURL=cMotion.js.map