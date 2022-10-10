class CanvasRenderAPI{
    canvas:Canvas;
    ps:ParticleSystem;
    p:Array<Particle>;

    showForceVectors:boolean = false;
    showParticles:boolean = true;
    showForces:boolean = true;
    
    constructor(canvas:Canvas, ps:ParticleSystem){
        this.canvas = canvas;
        this.ps = ps;
    }

    public UpdateData():void{ 
        let particles:Array<Particle> = this.ps.GetParticles();
        let data:Array<CanvasObject> = [];

        if(this.showForceVectors){
            let f:CanvasObject[] = particles.map(e=>
                e.forceAcc.map(force=>
                    new CanvasVector(e.position,force.ScalarMultiply(50)))).flat();
            data = data.concat(f);
        }
        if(this.showParticles){
            let c:CanvasObject[] = particles.map(e=>new CanvasCircle(e.position,e.massKg));
            data = data.concat(c);
        }
        if(this.showForces){
            let forces = this.ps.GetForces();
            forces.forEach(force => {
                if(typeOf(force) == "Spring"){
                    let s = <Spring>force;
                    data.push(new CanvasLine(s.pA.position,s.pB.position));
                }
            });
        }
        this.canvas.SetParticleData(data);
    }

    public GetClosestParticle(){
        
    }
}