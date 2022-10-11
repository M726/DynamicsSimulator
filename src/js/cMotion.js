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
    acceleration = -9.81;
    constructor(acceleration) {
        super();
        if (acceleration !== undefined)
            this.acceleration = acceleration;
    }
    forceApplierFunction(p) {
        return (new number2(0, -this.acceleration)).ScalarMultiply(p.massKg);
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
        return p.velocity.ScalarMultiply(-this.kConstant);
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
        let l = this.pA.position.Subtract(this.pB.position);
        let i = this.pA.velocity.Subtract(this.pB.velocity);
        let F = l.Normalize().ScalarMultiply(-this.kConst * (l.Length() - this.restLength) - this.dConst * (i.Dot(l) / l.Length()));
        this.pA.AddForce(F);
        this.pB.AddForce(F.ScalarMultiply(-1));
    }
}
class Particle {
    position;
    velocity;
    massKg = 1;
    forceAcc;
    forceUpdated = true;
    forceCurrent = new number2(0, 0);
    lockPosition = false;
    constructor() {
        this.forceAcc = new Array();
        if (typeOf(arguments[0]) == 'number2') {
            this.position = arguments[0];
            this.velocity = arguments[1];
            this.massKg = arguments[2];
        }
        else {
            this.position = new number2(arguments[0], arguments[1]);
            this.velocity = new number2(arguments[2], arguments[3]);
            this.massKg = arguments[4];
        }
    }
    toString() {
        return this.position.toString() + " " + this.velocity.toString();
    }
    AddForce(force) {
        this.forceUpdated = false;
        this.forceAcc.push(force);
    }
    ClearForces() {
        this.forceAcc = [];
    }
    GetForceTotal() {
        if (this.forceUpdated)
            return this.forceCurrent;
        this.UpdateForceTotal();
        return this.forceCurrent;
    }
    SetForceTotal(total) {
        this.forceCurrent = total;
    }
    UpdateForceTotal() {
        this.forceCurrent = this.forceAcc.reduce((accumulator, current) => {
            return accumulator.Add(current);
        }, new number2(0, 0));
        this.forceUpdated = true;
    }
    LockPosition() {
        this.lockPosition = true;
        this.velocity.set(0, 0);
    }
    UnlockPosition() {
        this.lockPosition = false;
    }
    IsLocked() {
        return this.lockPosition;
    }
    GetPosition() {
        return this.position;
    }
    SetPosition(x) {
        if (this.lockPosition)
            return;
        this.position = x;
    }
    GetVelocity() {
        return this.velocity;
    }
    SetVelocity(x) {
        if (this.lockPosition)
            return;
        this.velocity = x;
    }
}
class ParticleSystem {
    dimension = 2; //2D
    particles = [];
    forces = [];
    clock = 0;
    solver = new EulerODESolver();
    AddParticle(particle) {
        this.particles.push(particle);
    }
    GetParticles() {
        return this.particles;
    }
    FindClosestParticle(position) {
        let returnParticle = this.particles[0];
        let dist = this.particles[0].position.Subtract(position).Length();
        for (let i = 0; i < this.particles.length; i++) {
            let d = this.GetDistanceToParticle(this.particles[i], position);
            if (d < dist) {
                dist = d;
                returnParticle = this.particles[i];
            }
        }
        return returnParticle;
    }
    GetDistanceToParticle(particle, point) {
        return particle.position.Subtract(point).Length();
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
        return 2 * this.particles.length;
    }
    GetStateVector() {
        let r = new Array(this.GetPhaseSpaceDimension());
        for (let i = 0; i < this.particles.length; i++) {
            r[2 * i] = this.particles[i].GetPosition();
            r[2 * i + 1] = this.particles[i].GetVelocity();
        }
        return r;
    }
    SetStateVector(r) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].SetPosition(r[2 * i]);
            this.particles[i].SetVelocity(r[2 * i + 1]);
        }
    }
    GetParticleDerivatives() {
        this.ClearForces();
        this.ComputeForces();
        let r = new Array(this.GetPhaseSpaceDimension());
        for (let i = 0; i < this.particles.length; i++) {
            r[2 * i] = this.particles[i].GetVelocity();
            r[2 * i + 1] = this.particles[i].GetForceTotal().ScalarDivide(this.particles[i].massKg);
        }
        return r;
    }
    RunTimeStep(dt) {
        this.ClearForces;
        this.ComputeForces();
        this.ComputeConstraintForces();
        this.SetStateVector(this.solver.Solve(this.GetPhaseSpaceDimension(), this.GetStateVector(), this.GetParticleDerivatives(), dt));
        this.clock += dt;
    }
    forEach(callbackfn) {
        for (let i = 0; i < this.particles.length; i++) {
            callbackfn(this.particles[i]);
        }
    }
    collisionCheck(pA, pB) {
        return pA.position.Subtract(pB.position).Length() <
            (pA.massKg + pB.massKg);
    }
}
class EulerODESolver {
    Solve(dim, stateVector, derivatives, dt) {
        let result = new Array(stateVector.length);
        for (let i = 0; i < dim; i++) {
            result[i] = stateVector[i].Add(derivatives[i].ScalarMultiply(dt));
        }
        return result;
    }
}
//# sourceMappingURL=cMotion.js.map