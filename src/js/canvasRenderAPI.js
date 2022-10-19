class CanvasRenderAPI {
    canvas;
    ps;
    p;
    showForceVectors = false;
    showParticles = true;
    showForces = true;
    constructor(canvas, ps) {
        this.canvas = canvas;
        this.ps = ps;
    }
    UpdateData() {
        let particles = this.ps.GetParticles();
        let data = [];
        if (this.showParticles) {
            let c = particles.map(e => new CanvasCircle(e.x, e.y, e.radius));
            data = data.concat(c);
        }
        if (this.showForces) {
            let forces = this.ps.GetForces();
            forces.forEach(force => {
                if (typeOf(force) == "Spring") {
                    let s = force;
                    data.push(new CanvasLine(s.pA.x, s.pA.y, s.pB.x, s.pB.y));
                }
            });
        }
        data.push(new CanvasText((Math.round(this.ps.clock * 100) / 100).toString(), 0, 0));
        this.canvas.SetParticleData(data);
    }
}
//# sourceMappingURL=canvasRenderAPI.js.map