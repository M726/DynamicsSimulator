interface force{
    ApplyForce(ps:ParticleSystem);
}

class UnaryForce implements force{
    forceApplierFunction(p: Particle):number2{
        return new number2(0,0);
    }

    ApplyForce(ps: ParticleSystem) {
        ps.forEach(e => {
            e.AddForce(this.forceApplierFunction(e));
        });
    }
}

class NAryForce implements force{
    forceApplierFunction():void{}

    ApplyForce(_ps: ParticleSystem) {
        this.forceApplierFunction();
    }
}

class Gravity extends UnaryForce{
    acceleration:number = 9.81;

    constructor(acceleration?:number){
        super();
        if(acceleration !== undefined) this.acceleration = acceleration;
    }

    forceApplierFunction(p: Particle): number2 {
        return (new number2(0, -9.81)).ScalarMultiply(p.mass);
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
    forceAcc:number2;
    mass:number = 1;

    constructor(x:number,y:number,u:number,v:number);
    constructor(position:number2, velocity:number2);
    constructor(){
        this.forceAcc = new number2(0,0);

        if(arguments.length==4){
            this.position = new number2(arguments[0],arguments[1]);
            this.velocity = new number2(arguments[2],arguments[3]);
        }else{
            this.position = arguments[0];
            this.velocity = arguments[1];
        }
    }

    toString():string{
        return this.position.toString() + " " + this.velocity.toString();
    }

    AddForce(force:number2):void{
        this.forceAcc = this.forceAcc.Add(force);
    }
    ClearForces():void{
        this.forceAcc.set(0,0);
    }
}

class ParticleSystem{
    dimension:number = 2; //2D
    particles:Array<Particle> = [];
    forces:Array<force> = [];

    GetPhaseSpaceDimension(){
        //2*n*dimension
        return 2*this.dimension*this.particles.length;
    }

    GetParticles():Array<Particle>{
        return this.particles;
    }

    forEach(callbackfn: (e: Particle) => void) {
        for(let i:number = 0; i < this.particles.length; i++){
            callbackfn(this.particles[i]);
        }
    }
    
    AddParticle(particle:Particle):void;
    AddParticle(position:number2, velocity:number2):void;
    AddParticle(a:number2|Particle, b?:number2):void{
        if(typeOf(a) === 'Particle'){
            this.particles.push(<Particle>a);
            return
        }
        this.particles.push(new Particle(<number2>a, b));
    }

    AddForce(force:force):void;
    AddForce(force:force):void{
        this.forces.push(force);
    }

    ClearForces(){
        this.forEach(e => {
            e.ClearForces();
        });
    }

    ComputeForces(){
        this.forces.forEach(e => {
            e.ApplyForce(this);
        });
    }
}



