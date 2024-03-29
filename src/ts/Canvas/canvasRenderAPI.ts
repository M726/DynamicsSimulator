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

        this.RenderLoop();
    }
    
    public RenderLoop(){
        window.requestAnimationFrame(e=>{this.RenderLoop()});
        canvas.Render();
        tick();
        this.UpdateData();

    }
    public UpdateData():void{ 
        let particles:Array<Particle> = this.ps.GetParticles();
        let data:Array<CanvasObject> = [];

        if(this.showParticles){
            let c:CanvasObject[] = particles.map(e=>new CanvasCircle(e.x,e.y,e.radius));
            data = data.concat(c);
        }
        if(this.showForces){
            let forces = this.ps.GetForces();
            forces.forEach(force => {
                //data.push() for each force to show force with data
            });
        }
        //data.push(new CanvasText((Math.round(this.ps.clock*100)/100).toString(),0,0));
        this.canvas.SetParticleData(data);
    }
}