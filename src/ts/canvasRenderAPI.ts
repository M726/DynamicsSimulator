class CanvasRenderAPI{
    canvas:Canvas;
    ps:ParticleSystem;
    p:Array<Particle>;

    showForceVectors:boolean = true;
    showParticles:boolean = true;
    
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

        this.canvas.SetParticleData(data);
    }

    public GetClosestParticle(){
        
    }
}