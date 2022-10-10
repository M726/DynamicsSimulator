window.addEventListener('load', function () {
    init();
});
let canvasEl = element("canvas");
let canvas;
let particleSystem;
let canvasRenderAPI;
let canvasProperties;
function init() {
    particleSystem = new ParticleSystem();
    canvas = new Canvas(canvasEl);
    canvasRenderAPI = new CanvasRenderAPI(canvas, particleSystem);
    canvasProperties = canvas.GetCanvasProperties();
    canvas.SetDimensionsPx(window.innerHeight, window.innerWidth);
    window.addEventListener("resize", e => canvas.SetDimensionsPx(window.innerHeight, window.innerWidth));
    canvas.SetScale(1000);
    //Define particles
    let pA = new Particle(0.3, 0.2, -0.1, -0.1, 0.01);
    let pB = new Particle(0.33, .25, -0.1, 0, 0.01);
    let pC = new Particle(0.01, 0.01, 0.1, 0, 0.01);
    let pD = new Particle(-0.2, -0.2, 0.1, 0.1, 0.01);
    let pE = new Particle(-0.2, 0.2, 0, 0, 0.001);
    //Add Particles to System
    particleSystem.AddParticle(pA);
    particleSystem.AddParticle(pB);
    particleSystem.AddParticle(pC);
    particleSystem.AddParticle(pD);
    particleSystem.AddParticle(pE);
    //Add Forces to System
    particleSystem.AddForce(new Gravity(0));
    particleSystem.AddForce(new ViscousDrag(0));
    particleSystem.AddForce(new Spring(pA, pB, 0.03, 0.22));
    particleSystem.AddForce(new Spring(pA, pC, 0.01, 0.2));
    particleSystem.AddForce(new Spring(pB, pC, 0.01, 0.2));
    particleSystem.AddForce(new Spring(pE, pD, 0.01, 0.15));
    particleSystem.AddForce(new Spring(pA, pE, 0.01, 0));
    particleSystem.AddForce(new Spring(pB, pE, 0.01, 0));
    particleSystem.AddForce(new Spring(pC, pE, 0.01, 0));
    let dt = 1;
    function tick() {
        particleSystem.RunTimeStep(dt / 1000);
        canvasRenderAPI.UpdateData();
    }
    setInterval(tick, dt);
    const reset = element("resetBtn");
    if (reset != null)
        reset.addEventListener("click", init);
    let mouseDown = -1;
    let mouseDownPosition;
    let previousOffset = new number2(0, 0);
    document.addEventListener('contextmenu', event => event.preventDefault());
    canvasEl.addEventListener("mousedown", handlerCanvasMouseDown);
    canvasEl.addEventListener("mouseup", handlerCanvasMouseUp);
    canvasEl.addEventListener("mousemove", handlerCanvasMiddleMouseDrag);
    function handlerCanvasMouseDown(e) {
        if (mouseDown != -1)
            return;
        console.log("mouseDown: " + e.button);
        mouseDownPosition = getCanvasMouseCoordinates(e, canvas);
        mouseDown = e.button;
    }
    function handlerCanvasMouseUp(e) {
        if (e.button != mouseDown)
            return;
        console.log("mouseUp: " + e.button);
        switch (e.button) {
            case 0:
                break;
            case 1:
                if (previousOffset == canvas.GetOffsetPx()) {
                    canvas.SetOffsetPx(new number2(0, 0));
                }
                else
                    previousOffset = canvas.GetOffsetPx();
                break;
        }
        mouseDown = -1;
    }
    function handlerCanvasMiddleMouseDrag(e) {
        if (mouseDown == -1)
            return;
        console.log("mouseMove: " + mouseDown);
        if (mouseDown == 1) {
            let movementVector = getCanvasMouseCoordinates(e, canvas)
                .Subtract(mouseDownPosition);
            movementVector.y *= -1;
            canvas.SetOffsetPx(movementVector.Add(previousOffset));
        }
    }
}
function getCanvasMouseCoordinates(e, canvasObject) {
    let boundingClient = canvasObject.GetBoundingClientRect();
    return (new number2((e.clientX - boundingClient.left) * (canvasObject.GetWidthPx() / boundingClient.width), (e.clientY - boundingClient.top) * (canvasObject.GetHeightPx() / boundingClient.height)));
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