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

        if(this.showParticles){
            let c:CanvasObject[] = particles.map(e=>new CanvasCircle(e.x,e.y,e.radius));
            data = data.concat(c);
        }
        if(this.showForces){
            let forces = this.ps.GetForces();
            forces.forEach(force => {
                switch(typeOf(force)){
                    case "Spring":
                        let s = <Spring>force;
                        data.push(new CanvasLine(s.pA.x,s.pA.y,s.pB.x,s.pB.y));
                        break;
                    case "Rope":
                        let r = <Rope>force;
                        data.push(new CanvasLine(r.pA.x,r.pA.y,r.pB.x,r.pB.y));
                        break;
                        
                    case "RopeBreakable":
                        //let rb = <RopeBreakable>force;
                        //data.push(new CanvasLine(rb.pA.x,rb.pA.y,rb.pB.x,rb.pB.y));
                        break;
                }
            });
        }
        //data.push(new CanvasText((Math.round(this.ps.clock*100)/100).toString(),0,0));
        this.canvas.SetParticleData(data);
    }
}