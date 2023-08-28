class Particle{
    x:number;
    y:number;
    u:number;
    v:number;
    massKg:number = 1;
    radius:number;

    forceX:number;
    forceY:number;

    lockPosition = false;

    constructor(x:number,y:number,u:number,v:number, massKg:number, radius?:number){
        this.x = x;
        this.y = y;
        this.u = u;
        this.v = v;
        this.massKg = massKg;

        if(radius != undefined) this.radius = radius;
        else this.radius = massKg;

        this.forceX = 0;
        this.forceY = 0;
    }

    toString():string{
        return `(${this.x},${this.y})`;
    }

    AddForce(x:number,y:number):void{
        this.forceX += x;
        this.forceY += y;
    }
    ClearForces():void{
        this.forceX = 0;
        this.forceY = 0;
    }

    LockPosition(){
        this.lockPosition = true;
        this.u = 0;
        this.v = 0;
    }
    UnlockPosition(){
        this.lockPosition = false;
    }
    IsLocked():boolean{
        return this.lockPosition;
    }

}

class ParticleSystem{
    dimension:number = 2; //2D
    phaseSpaceDimension:number = 0;
    particles:Array<Particle> = [];
    forces:Array<Force> = [];
    clock:number = 0;

    solver:ODESolver = new ODESolverRK4();

    stateVector:number[] = [];
    derivativeVector:number[] = [];

    AddParticle(particle:Particle):void{
        this.particles.push(particle);
        
        //2*n*dimension
        this.phaseSpaceDimension = 2*this.dimension*this.particles.length;
        
        this.stateVector = new Array<number>(this.phaseSpaceDimension);
        this.derivativeVector = new Array<number>(this.phaseSpaceDimension);
    }
    GetParticles():Array<Particle>{
        return this.particles;
    }
    FindClosestParticle(x:number, y:number):Particle{
        let returnParticle = this.particles[0];
        let dist = this.GetDistanceToParticle(this.particles[0],x,y);

        for(let i = 0; i < this.particles.length; i++){
            let d = this.GetDistanceToParticle(this.particles[i],x,y);
            if(d < dist) {
                dist = d;
                returnParticle = this.particles[i];
            }
        }
        return returnParticle;
    }
    GetDistanceToParticle(particle:Particle, x:number, y:number):number{
        return distanceBetweenPoints(particle.x,particle.y, x,y);
    }
    AddForce(force:Force):void{
        this.forces.push(force);
    }
    GetForces():Array<Force>{
        return this.forces;
    }
    ClearForces():void{
        this.forEach(e => {
            e.ClearForces();
        });
    }


    ComputeForces():void{
        this.forces.forEach(e => {
            e.ApplyForce();
        });
    }

    ComputeConstraintForces():void{
        for(let i = 0; i < this.particles.length-1; i++){
            //Find Collisions with other Particles
            for(let j = i+1; j < this.particles.length; j++){
                if(this.collisionCheck(this.particles[i], this.particles[j])){
                    //console.log("Collision: " + this.particles[i].toString() + ", " + this.particles[j].toString())
                    //Collision Found
                    //coefficientOfRestitution = delta_v_f/delta_v_i
                }  
            }
        }
    }

    GetStateVector():Array<number>{
        for(let i:number = 0; i < this.particles.length; i++){
            this.stateVector[4*i] = this.particles[i].x;
            this.stateVector[4*i+1] = this.particles[i].y;
            this.stateVector[4*i+2] = this.particles[i].u;
            this.stateVector[4*i+3] = this.particles[i].v;
        }
        return this.stateVector;
    }

    SetStateVector(r:Array<number>):void{
        for(let i:number = 0; i < this.particles.length; i++){
            if(!this.particles[i].IsLocked()){
                this.particles[i].x = (r[4*i]);
                this.particles[i].y = (r[4*i+1]);
                this.particles[i].u = (r[4*i+2]);
                this.particles[i].v = (r[4*i+3]);
            }
        }
    }

    GetParticleDerivatives():Array<number>{
        this.ClearForces();
        this.ComputeForces();

        for(let i:number = 0; i < this.particles.length; i++){
            this.derivativeVector[4*i] = this.particles[i].u;
            this.derivativeVector[4*i+1] = this.particles[i].v;
            this.derivativeVector[4*i+2] = this.particles[i].forceX/this.particles[i].massKg;
            this.derivativeVector[4*i+3] = this.particles[i].forceY/this.particles[i].massKg;
        }
        return this.derivativeVector;
    }
    AddVectors(a:Array<number>, b:Array<number>){
        let result = new Array<number>(a.length);
        for(let i = 0; i < a.length; i++){
            result[i] = a[i] + b[i];
        }
        return result;
    }
    AddVectors4(a:Array<number>, b:Array<number>, c:Array<number>, d:Array<number>){
        let result = new Array<number>(a.length);
        for(let i = 0; i < a.length; i++){
            result[i] = a[i] + b[i] + c[i] + d[i];
        }
        return result;
    }

    ScaleVectors(derivs:Array<number>,factor:number){
        let result = new Array<number>(derivs.length);
        for(let i = 0; i < derivs.length; i++){
            result[i] = derivs[i]* factor;
        }
        return result;
    }

    RunTimeStep(dt:number){
        this.solver.Solve(this,dt);
        this.clock += dt;
    }

    forEach(callbackfn: (e: Particle) => void) {
        for(let i:number = 0; i < this.particles.length; i++){
            callbackfn(this.particles[i]);
        }
    }
    
    collisionCheck(pA:Particle, pB:Particle):boolean{
        return distanceParticles(pA,pB) < (pA.radius+pB.radius);
    }
}

interface ODESolver{
    Solve(particleSystem:ParticleSystem, dt:number):void;
}

class ODESolverEuler implements ODESolver{
    Solve(ps:ParticleSystem, dt:number){
        let statev = ps.GetStateVector();
        //x(t_0+h) = x(t_0) + deriv(t_0) * dt
        //result = statev + deriv * dt
        ps.SetStateVector(ps.AddVectors(statev,ps.ScaleVectors(ps.GetParticleDerivatives(),dt)));
    }
}
class ODESolverMidpoint implements ODESolver{
    Solve(ps:ParticleSystem, dt:number){
        let statev = ps.GetStateVector();
        let result = new Array<number>(statev.length);

        //x(t_0+h) = x(t_0) + deriv(t_0) * dt + 
        //result = statev + deriv * dt
        ps.SetStateVector(ps.AddVectors(statev,ps.ScaleVectors(ps.GetParticleDerivatives(),dt*0.5)));
        ps.SetStateVector(ps.AddVectors(statev,ps.ScaleVectors(ps.GetParticleDerivatives(),dt)));
    }
}
class ODESolverRK4 implements ODESolver{
    k1:number[];
    k2:number[];
    k3:number[];
    k4:number[];
    statev:number[];

    Solve(ps:ParticleSystem, dt:number){

        this.statev = ps.GetStateVector();
        this.k1 = ps.GetParticleDerivatives();

        ps.SetStateVector(ps.AddVectors(this.statev,ps.ScaleVectors(this.k1,dt/2)));
        this.k2 = ps.GetParticleDerivatives();
        
        ps.SetStateVector(ps.AddVectors(this.statev,ps.ScaleVectors(this.k2,dt/2)));
        this.k3 = ps.GetParticleDerivatives();

        ps.SetStateVector(ps.AddVectors(this.statev,ps.ScaleVectors(this.k3,dt)));
        this.k4 = ps.GetParticleDerivatives();
        //ps.SetStateVector(ps.AddVectors(statev,ps.ScaleVectors(k1,0.5)));

        ps.SetStateVector(
            ps.AddVectors(
                this.statev,
                ps.ScaleVectors(
                    ps.AddVectors4(this.k1, ps.ScaleVectors(this.k2,2), ps.ScaleVectors(this.k3,2), this.k4),
                    dt/6
                )
            )
        );
        //console.log(ps.AddVectorArray([k1, ps.ScaleVectors(k2,2), ps.ScaleVectors(k3,2), k4]));
    }
}