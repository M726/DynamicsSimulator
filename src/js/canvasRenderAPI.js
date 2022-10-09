class CanvasRenderAPI {
    canvas;
    ps;
    p;
    constructor(canvas, ps) {
        this.canvas = canvas;
        this.ps = ps;
    }
    UpdateParticleData() {
        let particles = this.ps.GetParticles();
        let c = particles.map(e => new Circle(e.position, e.mass));
        let f = particles.map(e => e.forceAcc.map(force => new CanvasVector(e.position, force.ScalarMultiply(1000)))).flat();
        this.canvas.SetParticleData(c.concat(f));
    }
    UpdateForceData() {
        //let forces:Array<Force> = this.ps.GetForces();
        //let c = forces.map()
    }
}
//# sourceMappingURL=canvasRenderAPI.js.map