interface Force{
    ApplyForce(ps:ParticleSystem);
}

class UnaryForce implements Force{
    forceApplierFunction(p: Particle):number2{
        return new number2(0,0);
    }

    ApplyForce(ps: ParticleSystem) {
        ps.forEach(e => {
            e.AddForce(this.forceApplierFunction(e));
        });
    }
}

class NAryForce implements Force{
    forceApplierFunction():void{}

    ApplyForce(_ps: ParticleSystem) {
        this.forceApplierFunction();
    }
}

class Gravity extends UnaryForce{
    acceleration:number = -9.81;

    constructor(acceleration?:number){
        super();
        if(acceleration !== undefined) this.acceleration = acceleration;
    }

    forceApplierFunction(p: Particle): number2 {
        return (new number2(0, this.acceleration)).ScalarMultiply(p.mass);
    }
}

class ViscousDrag extends UnaryForce{
    kConstant:number = 0.01;
    
    constructor(kConstant?:number){
        super();
        if(kConstant !== undefined) this.kConstant = kConstant;
    }

    forceApplierFunction(p: Particle): number2 {
        return p.velocity.ScalarMultiply(-this.kConstant);
    }
}

class Spring extends NAryForce{
    pA:Particle;
    pB:Particle;
    restLength:number;
    kConst:number;
    dConst:number = 0.01;

    constructor(
            pA:Particle, 
            pB:Particle, 
            springConstant:number, 
            restLength:number,
            dampening?:number){
        super();
        this.pA = pA;
        this.pB = pB;
        this.restLength = restLength;
        this.kConst = springConstant;
        if(dampening !== undefined) this.dConst = dampening;
    }

    forceApplierFunction(): void {
        let l:number2 = this.pA.position.Subtract(this.pB.position);
        let i:number2 = this.pA.velocity.Subtract(this.pB.velocity);
        let F:number2 = l.Normalize().ScalarMultiply(-this.kConst * (l.Length() - this.restLength) - this.dConst * (i.Dot(l)/l.Length()));
        this.pA.AddForce(F);
        this.pB.AddForce(F.ScalarMultiply(-1));
    }
}

class Particle{
    position:number2;
    velocity:number2;
    mass:number = 1;

    forceAcc:Array<number2>;
    
    forceUpdated:boolean = true;
    forceCurrent:number2 = new number2(0,0);

    constructor(x:number,y:number,u:number,v:number, mass:number);
    constructor(position:number2, velocity:number2, mass:number);
    constructor(){
        this.forceAcc = new Array<number2>();

        if(typeOf(arguments[0]) == 'number2'){
            this.position = arguments[0];
            this.velocity = arguments[1];
            this.mass = arguments[2];
        }else{
            this.position = new number2(arguments[0],arguments[1]);
            this.velocity = new number2(arguments[2],arguments[3]);
            this.mass = arguments[4];
        }
    }

    toString():string{
        return this.position.toString() + " " + this.velocity.toString();
    }

    AddForce(force:number2):void{
        this.forceUpdated = false;
        this.forceAcc.push(force);
    }
    ClearForces():void{
        this.forceAcc= [];
    }
    GetForceTotal(){
        if(this.forceUpdated) return this.forceCurrent;
        this.UpdateForceTotal();
        return this.forceCurrent;
    }
    
    SetForceTotal(total:number2){
        this.forceCurrent = total;
    }
    UpdateForceTotal(){
        this.forceCurrent = this.forceAcc.reduce((accumulator:number2, current) => {
            return accumulator.Add(current);
          },new number2(0,0));
        this.forceUpdated = true;
    }
}

class ParticleSystem{
    dimension:number = 2; //2D
    particles:Array<Particle> = [];
    forces:Array<Force> = [];
    clock:number = 0;

    solver:ODESolver = new EulerODESolver();

    GetParticles():Array<Particle>{
        return this.particles;
    }
    GetForces():Array<Force>{
        return this.forces;
    }
     
    AddParticle(particle:Particle):void{
        this.particles.push(particle);
    }

    AddForce(force:Force):void{
        this.forces.push(force);
    }

    ClearForces():void{
        this.forEach(e => {
            e.ClearForces();
        });
    }

    ComputeForces():void{
        this.forces.forEach(e => {
            e.ApplyForce(this);
        });
    }

    ComputeConstraintForces():void{
        for(let i = 0; i < this.particles.length-1; i++){
            //Find Collisions with other Particles
            for(let j = i+1; j < this.particles.length; j++){
                if(this.particles[i].position.Subtract(this.particles[j].position).Length() < 
                    (this.particles[i].mass+this.particles[j].mass)){
                    //Collision Found
                    //let f:number2 = this.particles[i]
                }  
            }
        }
    }

    GetPhaseSpaceDimension():number{
        //2*n*dimension
        return 4*this.particles.length;
    }

    GetStateVector():Array<number>{
        let r = new Array<number>(this.GetPhaseSpaceDimension());
        for(let i:number = 0; i < this.particles.length; i++){
            r[4*i] = this.particles[i].position.x;
            r[4*i+1] = this.particles[i].position.y;
            r[4*i+2] = this.particles[i].velocity.x;
            r[4*i+3] = this.particles[i].velocity.y;
        }
        return r;
    }
    SetStateVector(r:Array<number>):void{
        for(let i:number = 0; i < this.particles.length; i++){
            this.particles[i].position.x = r[4*i];
            this.particles[i].position.y = r[4*i+1];
            this.particles[i].velocity.x = r[4*i+2];
            this.particles[i].velocity.y = r[4*i+3];
        }
    }

    GetParticleDerivatives():Array<number>{
        this.ClearForces();
        this.ComputeForces();

        let r = new Array<number>(this.GetPhaseSpaceDimension());
        for(let i:number = 0; i < this.particles.length; i++){
            r[4*i] = this.particles[i].velocity.x;
            r[4*i+1] = this.particles[i].velocity.y;
            r[4*i+2] = this.particles[i].GetForceTotal().x/this.particles[i].mass;
            r[4*i+3] = this.particles[i].GetForceTotal().y/this.particles[i].mass;
        }
        return r;
    }


    RunTimeStep(dt:number){
        this.ClearForces;
        this.ComputeForces();

        this.SetStateVector(
            this.solver.Solve(
                this.GetPhaseSpaceDimension(),
                this.GetStateVector(),
                this.GetParticleDerivatives(),
                dt
            )
        );
    }

    forEach(callbackfn: (e: Particle) => void) {
        for(let i:number = 0; i < this.particles.length; i++){
            callbackfn(this.particles[i]);
        }
    }
}

interface ODESolver{
    Solve(dim:number, stateVector:Array<number>, derivatives:Array<number>, dt:number):Array<number>;
}

class EulerODESolver implements ODESolver{
    Solve(dim:number, stateVector:Array<number>, derivatives:Array<number>, dt:number):Array<number>{
        let result = new Array<number>(stateVector.length);
        
        for(let i = 0; i < dim; i++){
            result[i] = stateVector[i] + derivatives[i] * dt;
        }

        return result;
    }
}
