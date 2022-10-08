//class UnaryForce implements force{
//}
class ParticleSystem {
    constructor() {
        this.dimension = 2; //2D
        this.particles = [];
    }
    GetPhaseSpaceDimension() {
        //2*n*dimension
        return 2 * this.dimension * this.particles.length;
    }
}
//p = new ParticleSystem();
class Particle {
}
//# sourceMappingURL=cMotion.js.map