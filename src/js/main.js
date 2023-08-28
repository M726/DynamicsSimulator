let canvasEl;
let canvas;
let particleSystem;
let canvasRenderAPI;
let inputManager;
let timerDtSeconds = 15 / 1000;
let dtSeconds = timerDtSeconds / 2;
let timeScale = 1;
let timerInterval;
window.addEventListener('load', function () {
    init();
});
function init() {
    canvasEl = element("canvas");
    canvas = new Canvas(canvasEl);
    canvas.SetDimensionsPx(window.innerHeight, window.innerWidth);
    canvas.SetScale(10);
    window.addEventListener("resize", e => canvas.SetDimensionsPx(window.innerHeight, window.innerWidth));
    particleSystem = new ParticleSystem();
    canvasRenderAPI = new CanvasRenderAPI(canvas, particleSystem);
    inputManager = new InputManager(canvasEl, canvas, particleSystem);
    setupSceneNetLarge();
}
function tick() {
    //runs every 4 ms
    for (let i = 0; i < timerDtSeconds / (dtSeconds); i++) {
        particleSystem.RunTimeStep(dtSeconds / timeScale);
    }
}
function setupSceneNetLarge() {
    let iMax = Math.round(canvas.GetWidthPx() / 15);
    let jMax = Math.round(canvas.GetHeightPx() / 15);
    let kConst = 30;
    let particles = [];
    let width = canvas.GetWidthScaled();
    let height = canvas.GetHeightScaled();
    let dx = 1 / (iMax - 1) * width;
    //Create Free Particles
    for (let i = 0; i < iMax; i++) {
        particles[i] = [];
        for (let j = 0; j < jMax; j++) {
            particles[i][j] = new Particle(-width / 2 + i / (iMax - 1) * width, -height / 2 + j / (jMax - 1) * height, 0, 0, 0.1, 0.1);
            particleSystem.AddParticle(particles[i][j]);
        }
    }
    let d = 0.01;
    let b = 28;
    for (let i = 1; i < iMax - 1; i++) {
        for (let j = 1; j < jMax - 1; j++) {
            particleSystem.AddForce(new RopeBreakable(particles[i][j], particles[i - 1][j], kConst, dx, d, b));
            particleSystem.AddForce(new RopeBreakable(particles[i][j], particles[i][j + 1], kConst, dx, d, b));
        }
    }
    for (let i = 0; i < iMax; i++) {
        particles[i][0].LockPosition();
        particles[i][jMax - 1].LockPosition();
        particleSystem.AddForce(new RopeBreakable(particles[i][0], particles[i][1], kConst, dx, d, b));
    }
    for (let i = 0; i < jMax; i++) {
        particles[0][i].LockPosition();
        particles[iMax - 1][i].LockPosition();
        particleSystem.AddForce(new RopeBreakable(particles[iMax - 1][i], particles[iMax - 2][i], kConst, dx, d, b));
    }
    ///////Add Forces to System
    //particleSystem.AddForce(new Gravity(9.8));
    //particleSystem.AddForce(new ViscousDrag(0.1));
}
//# sourceMappingURL=main.js.map