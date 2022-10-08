class CanvasRenderAPI{
    canvas:Canvas;
    ps:ParticleSystem;
    p:Array<Particle>;
    
    constructor(canvas:Canvas, ps:ParticleSystem){
        this.canvas = canvas;
        this.ps = ps;
    }

    UpdateParticleData(){
        let particles:Array<Particle> = this.ps.GetParticles();
        let c = particles.map(e=>new Circle(e.position,5));
        this.canvas.SetData(c)

    }
}