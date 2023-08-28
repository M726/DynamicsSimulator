interface Force{
    ApplyForce();
}

class RopeBreakable implements Force{
    pA:Particle;
    pB:Particle;
    restLength:number;
    kConst:number;
    dConst:number;
    maxForce:number;

    
    private dx = 0;
    private dy = 0;
    private dL = 0;
    private magnitude = 0;
    

    constructor(
            pA:Particle, 
            pB:Particle, 
            kConstNewtonPerMeter:number, 
            restLength:number,
            dampening:number,
            breakingForce:number){
        this.pA = pA;
        this.pB = pB;
        this.restLength = restLength;
        this.kConst = kConstNewtonPerMeter;
        this.maxForce = breakingForce;
        if(dampening !== undefined) this.dConst = dampening;
    }

    ApplyForce(): void { 
        //This get EXTREMELY SLOW if you assign variables within.
        this.dx = this.pA.x-this.pB.x;
        this.dy = this.pA.y-this.pB.y;
        if(this.dx == 0 && this.dy == 0){return;}
        this.dL = Math.sqrt(this.dx*this.dx+this.dy*this.dy);
        this.magnitude = (this.kConst * (this.dL-this.restLength) + this.dConst * ((dot(this.pA.u-this.pB.u,this.pA.v-this.pB.v,this.dx,this.dy))/this.dL))/this.dL;
        
        if(this.magnitude <= 0) return; // Adds Rope behavior when length is smaller than restlength
        this.pA.AddForce(-this.magnitude * this.dx,-this.magnitude * this.dy);
        this.pB.AddForce(this.magnitude * this.dx,this.magnitude * this.dy);
        if(this.magnitude > this.maxForce){
            this.kConst = 0;
            this.dConst = 0;
        }
    }
}


class Spring extends RopeBreakable{
    

    constructor(
            pA:Particle, 
            pB:Particle, 
            kConstNewtonPerMeter:number, 
            restLength:number,
            dampening:number){
        super(pA,pB,kConstNewtonPerMeter,0,dampening,Number.MAX_SAFE_INTEGER);
    }
}
