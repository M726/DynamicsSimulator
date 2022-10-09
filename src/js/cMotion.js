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
        return (new number2(0, this.acceleration)).ScalarMultiply(p.mass);
    }
}
class ViscousDrag extends UnaryForce {
    kConstant = 0.01;
    constructor(kConstant) {
        super();
        if (kConstant !== undefined)
            this.kConstant = kConstant;
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
    constructor(pA, pB, springConstant, restLength, dampening) {
        super();
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
    position;
    velocity;
    mass = 1;
    forceAcc;
    forceUpdated = true;
    forceCurrent = new number2(0, 0);
    constructor() {
        this.forceAcc = new Array();
        if (typeOf(arguments[0]) == 'number2') {
            this.position = arguments[0];
            this.velocity = arguments[1];
            this.mass = arguments[2];
        }
        else {
            this.position = new number2(arguments[0], arguments[1]);
            this.velocity = new number2(arguments[2], arguments[3]);
            this.mass = arguments[4];
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
}
class ParticleSystem {
    dimension = 2; //2D
    particles = [];
    forces = [];
    clock = 0;
    solver = new EulerODESolver();
    GetParticles() {
        return this.particles;
    }
    GetForces() {
        return this.forces;
    }
    AddParticle(particle) {
        this.particles.push(particle);
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
    ComputeConstraintForces() {
        for (let i = 0; i < this.particles.length - 1; i++) {
            //Find Collisions with other Particles
            for (let j = i + 1; j < this.particles.length; j++) {
                if (this.particles[i].position.Subtract(this.particles[j].position).Length() <
                    (this.particles[i].mass + this.particles[j].mass)) {
                    //Collision Found
                    //let f:number2 = this.particles[i]
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
            r[4 * i] = this.particles[i].position.x;
            r[4 * i + 1] = this.particles[i].position.y;
            r[4 * i + 2] = this.particles[i].velocity.x;
            r[4 * i + 3] = this.particles[i].velocity.y;
        }
        return r;
    }
    SetStateVector(r) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].position.x = r[4 * i];
            this.particles[i].position.y = r[4 * i + 1];
            this.particles[i].velocity.x = r[4 * i + 2];
            this.particles[i].velocity.y = r[4 * i + 3];
        }
    }
    GetParticleDerivatives() {
        this.ClearForces();
        this.ComputeForces();
        let r = new Array(this.GetPhaseSpaceDimension());
        for (let i = 0; i < this.particles.length; i++) {
            r[4 * i] = this.particles[i].velocity.x;
            r[4 * i + 1] = this.particles[i].velocity.y;
            r[4 * i + 2] = this.particles[i].GetForceTotal().x / this.particles[i].mass;
            r[4 * i + 3] = this.particles[i].GetForceTotal().y / this.particles[i].mass;
        }
        return r;
    }
    RunTimeStep(dt) {
        this.ClearForces;
        this.ComputeForces();
        this.SetStateVector(this.solver.Solve(this.GetPhaseSpaceDimension(), this.GetStateVector(), this.GetParticleDerivatives(), dt));
    }
    forEach(callbackfn) {
        for (let i = 0; i < this.particles.length; i++) {
            callbackfn(this.particles[i]);
        }
    }
}
class EulerODESolver {
    Solve(dim, stateVector, derivatives, dt) {
        let result = new Array(stateVector.length);
        for (let i = 0; i < dim; i++) {
            result[i] = stateVector[i] + derivatives[i] * dt;
        }
        return result;
    }
}
//# sourceMappingURL=cMotion.js.map