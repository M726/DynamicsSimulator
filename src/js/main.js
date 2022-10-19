window.addEventListener('load', function () {
    init();
});
let canvasEl = element("canvas");
let canvas;
let particleSystem;
let canvasRenderAPI;
let inputManager;
function init() {
    particleSystem = new ParticleSystem();
    canvas = new Canvas(canvasEl);
    canvasRenderAPI = new CanvasRenderAPI(canvas, particleSystem);
    inputManager = new InputManager(canvasEl, canvas, particleSystem);
    canvas.SetDimensionsPx(window.innerHeight, window.innerWidth);
    window.addEventListener("resize", e => canvas.SetDimensionsPx(window.innerHeight, window.innerWidth));
    canvas.SetScale(60);
    setupScene();
    let timerDtSeconds = 0.004;
    let dt = 0.0005;
    tick();
    function tick() {
        //runs every 4 ms
        for (let i = 0; i < timerDtSeconds / dt; i++) {
            particleSystem.RunTimeStep(dt);
        }
    }
    function updateFrame() {
        canvasRenderAPI.UpdateData();
    }
    setInterval(tick, timerDtSeconds * 1000); //4ms timer
    setInterval(updateFrame, 1000 / 60);
}
function setupScene() {
    let iMax = 20;
    let jMax = 30;
    let kConst = 100;
    let dx = 0.1;
    let particles = [];
    for (let i = 0; i < iMax; i++) {
        particles[i] = [];
        for (let j = 0; j < jMax; j++) {
            particles[i][j] = new Particle(i * dx, -j * dx, 0, 0, 0.01, 0.01);
            particleSystem.AddParticle(particles[i][j]);
        }
    }
    for (let i = 1; i < iMax - 1; i++) {
        for (let j = 1; j < jMax - 1; j++) {
            particleSystem.AddForce(new Rope(particles[i][j], particles[i][j + 1], kConst, dx));
            particleSystem.AddForce(new Rope(particles[i][j], particles[i][j - 1], kConst, dx));
            particleSystem.AddForce(new Rope(particles[i][j], particles[i + 1][j], kConst, dx));
            particleSystem.AddForce(new Rope(particles[i][j], particles[i - 1][j], kConst, dx));
        }
    }
    for (let i = 1; i < iMax - 1; i++) {
        particleSystem.AddForce(new Rope(particles[i][0], particles[i - 1][0], kConst, dx));
        particleSystem.AddForce(new Rope(particles[i][0], particles[i + 1][0], kConst, dx));
        particleSystem.AddForce(new Rope(particles[i][jMax - 1], particles[i - 1][jMax - 1], kConst, dx));
        particleSystem.AddForce(new Rope(particles[i][jMax - 1], particles[i + 1][jMax - 1], kConst, dx));
    }
    for (let j = 1; j < jMax - 1; j++) {
        particleSystem.AddForce(new Rope(particles[0][j], particles[0][j - 1], kConst, dx));
        particleSystem.AddForce(new Rope(particles[0][j], particles[0][j + 1], kConst, dx));
        particleSystem.AddForce(new Rope(particles[iMax - 1][j], particles[iMax - 1][j - 1], kConst, dx));
        particleSystem.AddForce(new Rope(particles[iMax - 1][j], particles[iMax - 1][j + 1], kConst, dx));
    }
    particles[0][0].LockPosition();
    particles[iMax - 1][0].LockPosition();
    ///////Add Forces to System
    particleSystem.AddForce(new Gravity(9.8));
    particleSystem.AddForce(new ViscousDrag(0.01));
}
function element(tag) {
    return document.getElementById(tag);
}
function rand() {
    return Math.random();
}
function randRange(min, max) {
    return Math.random() * (max - min) + min;
}
function getMs() {
    return performance.now();
}
function typeOf(e) {
    return e.constructor.name;
}
//# sourceMappingURL=main.js.map