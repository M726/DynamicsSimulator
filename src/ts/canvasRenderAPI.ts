class CanvasRenderAPI{
    canvas:Canvas;
    ps:ParticleSystem;
    p:Array<Particle>;
    
    constructor(canvas:Canvas, ps:ParticleSystem){
        this.canvas = canvas;
        this.ps = ps;
    }

    public UpdateParticleData():void{ 
        let particles:Array<Particle> = this.ps.GetParticles();
        let c:CanvasObject[] = particles.map(e=>new Circle(e.position,e.mass));
        let f:CanvasObject[] = particles.map(e=>e.forceAcc.map(force=>new CanvasVector(e.position,force.ScalarMultiply(1000)))).flat();
        
        this.canvas.SetParticleData(c.concat(f));
    }

    public UpdateForceData():void{
        //let forces:Array<Force> = this.ps.GetForces();
        //let c = forces.map()
    }
}