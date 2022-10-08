window.addEventListener('load', function () {
    init();
});
let canvas;
function init() {
    //Particle System init
    //New Particle System
    let particleSystem = new ParticleSystem();
    //Define particles
    let pA = new Particle(20, 30, 0, 0);
    let pB = new Particle(new number2(90, 70), new number2(0, 0));
    //Add Particles to System
    particleSystem.AddParticle(pA);
    particleSystem.AddParticle(pB);
    //Add Forces to System
    particleSystem.AddForce(new Gravity());
    particleSystem.AddForce(new ViscousDrag());
    particleSystem.AddForce(new Spring(pA, pB, 0.2, 15));
    canvas = new Canvas(elId("canvas"));
    setCanvasSize(canvas);
    window.addEventListener("resize", e => setCanvasSize(canvas));
    elId("canvas").addEventListener("click", e => {
        let boundingClient = canvas.GetBoundingClientRect();
        let mousePos = new number2((e.clientX - boundingClient.left) * (canvas.GetWidth() / boundingClient.width), (e.clientY - boundingClient.top) * (canvas.GetHeight() / boundingClient.height)).ScalarDivide(canvas.GetScale());
        console.log("Click: " + mousePos.toString());
        //objects.push(new Circle(mousePos,randRange(5,20)));
    });
    const reset = elId("resetBtn");
    if (reset != null)
        reset.addEventListener("click", e => { canvas.Reset(); });
    let canvasRenderAPI = new CanvasRenderAPI(canvas, particleSystem);
    let dt = 1000 / 2400;
    function tick() {
        //Clear Force Accumulators
        particleSystem.ClearForces();
        //Compute Forces
        particleSystem.ComputeForces();
        canvasRenderAPI.UpdateParticleData();
    }
    setInterval(function () {
        tick();
    }, dt);
}
function setCanvasSize(canvas) {
    console.log("Set Canvas Size");
    canvas.SetHeight(window.innerHeight);
    canvas.SetWidth(window.innerWidth);
}
function elId(tag) {
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