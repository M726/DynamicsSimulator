interface Force{
    ApplyForce(ps:ParticleSystem);
}

class UnaryForce implements Force{
    forceApplierFunction(p: Particle):void{

    }

    ApplyForce(ps: ParticleSystem) {
        ps.forEach(e => {
            this.forceApplierFunction(e);
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

    forceApplierFunction(p: Particle):void {
        p.AddForce(0,-this.acceleration*p.massKg);
    }
}

class ViscousDrag extends UnaryForce{
    kConstant:number = 0.01;
    
    constructor(kConstNewtonSecondPerMeter2?:number){
        super();
        if(kConstNewtonSecondPerMeter2 !== undefined) this.kConstant = kConstNewtonSecondPerMeter2;
    }

    forceApplierFunction(p: Particle):void {
        p.AddForce(-this.kConstant * p.u, -this.kConstant * p.v);
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
            kConstNewtonPerMeter:number, 
            restLength:number,
            dampening?:number){
        super();
        this.pA = pA;
        this.pB = pB;
        this.restLength = restLength;
        this.kConst = kConstNewtonPerMeter;
        if(dampening !== undefined) this.dConst = dampening;
    }

    forceApplierFunction(): void {
        let dx = this.pA.x-this.pB.x;
        let dy = this.pA.y-this.pB.y;
        let dPos = Math.sqrt(dx*dx+dy*dy);
        let magnitude = -(this.kConst * (dPos-this.restLength) + this.dConst * ((dot(this.pA.u-this.pB.u,this.pA.v-this.pB.v,dx,dy))/dPos))/dPos;
        
        this.pA.AddForce(magnitude * dx,magnitude * dy);
        this.pB.AddForce(-magnitude * dx,-magnitude * dy);
    }
}

class Rope extends NAryForce{
    pA:Particle;
    pB:Particle;
    restLength:number;
    kConst:number;
    dConst:number = 0.01;

    constructor(
            pA:Particle, 
            pB:Particle, 
            kConstNewtonPerMeter:number, 
            restLength:number,
            dampening?:number){
        super();
        this.pA = pA;
        this.pB = pB;
        this.restLength = restLength;
        this.kConst = kConstNewtonPerMeter;
        if(dampening !== undefined) this.dConst = dampening;
    }

    forceApplierFunction(): void {
        let dx = this.pA.x-this.pB.x;
        let dy = this.pA.y-this.pB.y;
        let dPos = Math.sqrt(dx*dx+dy*dy);
        let magnitude = -(this.kConst * (dPos-this.restLength) + this.dConst * ((dot(this.pA.u-this.pB.u,this.pA.v-this.pB.v,dx,dy))/dPos))/dPos;
        if(magnitude > 0) return;
        this.pA.AddForce(magnitude * dx,magnitude * dy);
        this.pB.AddForce(-magnitude * dx,-magnitude * dy);
    }
}