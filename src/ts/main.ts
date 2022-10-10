window.addEventListener('load', function () {
    init();
});

let canvas:Canvas;
let particleSystem:ParticleSystem;
let canvasRenderAPI:CanvasRenderAPI;

function init(){
    particleSystem = new ParticleSystem();
    canvas = new Canvas(<HTMLCanvasElement> element("canvas"));
    canvasRenderAPI = new CanvasRenderAPI(canvas,particleSystem);

    
    canvas.SetDimensionsPx(window.innerHeight,window.innerWidth);
    window.addEventListener("resize", e=>canvas.SetDimensionsPx(window.innerHeight,window.innerWidth));

    canvas.SetScale(1000);
    
    //Define particles
    let pA = new Particle(0.3,0.2,-0.1,-0.1, 0.0075);
    let pB = new Particle(0.33,.25,-0.1,0, 0.01);
    let pC = new Particle(0.01,0.01,0.1,0, 0.01);
    let pD = new Particle(0,0,0,0, 0.01);

    //Add Particles to System
    particleSystem.AddParticle(pA);
    particleSystem.AddParticle(pB);
    particleSystem.AddParticle(pC);
    particleSystem.AddParticle(pD);

    //Add Forces to System
    particleSystem.AddForce(new Gravity(0));
    particleSystem.AddForce(new ViscousDrag(.0005));
    particleSystem.AddForce(new Spring(pA,pB,0.07,0.1));
    particleSystem.AddForce(new Spring(pA,pC,0.01,0.05));
    particleSystem.AddForce(new Spring(pB,pC,0.01,0.07));

    let dt = 10;


    function tick():void{
        particleSystem.RunTimeStep(dt/1000);
        canvasRenderAPI.UpdateData();
    }

    setInterval(function(){
        tick();
    },dt);


    

    element("canvas").addEventListener("click",e=>{
        let boundingClient = canvas.GetBoundingClientRect();
        let mousePos = new number2(
            (e.clientX-boundingClient.left)*(canvas.GetWidthPx() / boundingClient.width),
            (e.clientY-boundingClient.top)*(canvas.GetHeightPx() / boundingClient.height),
        );
        mousePos = canvas.GetCanvasProperties().TransformCanvasToObject(mousePos);
        console.log("Click: " + mousePos.toString());
    });
    const reset = element("resetBtn");
    if(reset != null) reset.addEventListener("click",e=>{canvas.Reset()});

}




function element(tag:string){
    return document.getElementById(tag);
}

function rand(){
    return Math.random();
}
function randRange(min:number,max:number){
    return Math.random()*(max-min)+min;
}

function getMs():number{
    return performance.now();
}

function typeOf(e:any):string{
    return e.constructor.name;
}