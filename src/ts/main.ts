window.addEventListener('load', function () {
    init();
});

let canvas:Canvas;
let particleSystem:ParticleSystem;

function init(){
    //Particle System init
    particleSystem = new ParticleSystem();
    canvas = new Canvas(<HTMLCanvasElement> elId("canvas"));
    let canvasRenderAPI:CanvasRenderAPI = new CanvasRenderAPI(canvas,particleSystem);

    canvas.SetDimensions(window.innerHeight,window.innerWidth);
    window.addEventListener("resize", e=>canvas.SetDimensions(window.innerHeight,window.innerWidth));

    elId("canvas").addEventListener("click",e=>{
        let boundingClient = canvas.GetBoundingClientRect();
        let mousePos = new number2(
            (e.clientX-boundingClient.left)*(canvas.GetWidth() / boundingClient.width),
            (e.clientY-boundingClient.top)*(canvas.GetHeight() / boundingClient.height),
        ).ScalarDivide(canvas.GetScale());
        console.log("Click: " + mousePos.toString());
        //objects.push(new Circle(mousePos,randRange(5,20)));
    });
    const reset = elId("resetBtn");
    if(reset != null) reset.addEventListener("click",e=>{canvas.Reset()});

 
    
    
    //Define particles
    let pA = new Particle(canvas.GetPxWidth()/2,canvas.GetPxHeight()/2,0,0, 5);
    let pB = new Particle(100,270,0,0, 1);
    let pC = new Particle(200,270,0,0, 3);

    //Add Particles to System
    particleSystem.AddParticle(pA);
    particleSystem.AddParticle(pB);
    particleSystem.AddParticle(pC);

    //Add Forces to System
    particleSystem.AddForce(new Gravity(0));
    particleSystem.AddForce(new ViscousDrag(0.02));
    particleSystem.AddForce(new Spring(pA,pB,0.007,250));
    particleSystem.AddForce(new Spring(pA,pC,0.001,350));
    particleSystem.AddForce(new Spring(pB,pC,0.01,200));

    let dt = 1000/800;


    function tick():void{

        particleSystem.RunTimeStep(dt);
        
        canvasRenderAPI.UpdateParticleData();
        canvasRenderAPI.UpdateForceData();
    }

    setInterval(function(){
        tick();
    },dt);

}




function elId(tag:string){
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