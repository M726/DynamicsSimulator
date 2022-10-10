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
        if (this.showForceVectors) {
            let f = particles.map(e => e.forceAcc.map(force => new CanvasVector(e.position, force.ScalarMultiply(50)))).flat();
            data = data.concat(f);
        }
        if (this.showParticles) {
            let c = particles.map(e => new CanvasCircle(e.position, e.massKg));
            data = data.concat(c);
        }
        if (this.showForces) {
            let forces = this.ps.GetForces();
            forces.forEach(force => {
                if (typeOf(force) == "Spring") {
                    let s = force;
                    data.push(new CanvasLine(s.pA.position, s.pB.position));
                }
            });
        }
        this.canvas.SetParticleData(data);
    }
    GetClosestParticle() {
    }
}
//# sourceMappingURL=canvasRenderAPI.js.map