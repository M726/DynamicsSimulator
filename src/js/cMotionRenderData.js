class CanvasRenderAPI {
    constructor(canvas, ps) {
        this.canvas = canvas;
        this.ps = ps;
    }
    UpdateParticleData() {
        let particles = this.ps.GetParticles();
        let c = particles.map(e => new Circle(e.position, 5));
        this.canvas.SetData(c);
    }
}
//# sourceMappingURL=cMotionRenderData.js.map