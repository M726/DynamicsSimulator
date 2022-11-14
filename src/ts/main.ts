let canvasEl:HTMLElement;
let canvas:Canvas;
let particleSystem:ParticleSystem;
let canvasRenderAPI:CanvasRenderAPI;
let inputManager:InputManager;


let timerDtSeconds = 0.004;
let dtSeconds = 0.001;
let timeScale = 1;
let timerInterval;


window.addEventListener('load', function () {
    init();
});

function init(){
    canvasEl = element("canvas");

    canvas = new Canvas(<HTMLCanvasElement> canvasEl);
    canvas.SetDimensionsPx(window.innerHeight,window.innerWidth);
    canvas.SetScale(10);
    window.addEventListener("resize", e=>canvas.SetDimensionsPx(window.innerHeight,window.innerWidth));

    particleSystem = new ParticleSystem();
    canvasRenderAPI = new CanvasRenderAPI(canvas,particleSystem);
    inputManager = new InputManager(canvasEl, canvas, particleSystem);
    
    setupScene();
    start();

}
function start(){
    tick();
    function tick():void{
        //runs every 4 ms
        for(let i = 0; i < timerDtSeconds/(dtSeconds); i++){
            particleSystem.RunTimeStep(dtSeconds/timeScale);
        }
    }
    function updateFrame():void{
        canvasRenderAPI.UpdateData();
    }
    timerInterval = setInterval(tick,timerDtSeconds*1000);//4ms timer
    setInterval(updateFrame,1000/60);
}
function stop(){
    clearInterval(timerInterval);
}

function setupScene(){
    let particles:Particle[] = [];
    let iMax = 200;
    let x = 10;
    let u = 0.01;
    for(let i = 0; i < iMax; i++){
        particles[i] = new Particle(
            randRange(-x,x),
            randRange(-x,x),
            randRange(-u,u),
            randRange(-u,u),
            Math.pow(randRange(0.1,1),20)*randRange(1,50),1);
        particleSystem.AddParticle(particles[i]);
    }
    for(let i = 0; i < iMax-1; i++){
        for(let j = i+1; j < iMax; j++){
            particleSystem.AddForce(new GravityN(particles[i],particles[j],1e-6));
        }
    }
}

function setupSceneSpringPendulum(){
    let particles:Particle[] = [];
    let iMax = 3;
    let dx = 0.5;
    let k = 100;
    for(let i = 0; i < iMax; i++){
        particles[i] = new Particle(0,-i*dx,0,0,0.01,0.05);
        particleSystem.AddParticle(particles[i]);
    }
    for(let i = 0; i < iMax-1; i++){
        particleSystem.AddForce(new Spring(particles[i],particles[i+1],k,dx));
    }
    particles[0].LockPosition();
    particleSystem.AddForce(new Gravity(9.8));
    particleSystem.AddForce(new ViscousDrag(0.001));
}


//////NET CREATION
function setupSceneNet(){
    let iMax = 20;
    let jMax = 30;
    let kConst = 100;
    let dx = 0.1;
    let particles:Particle[][] = [];
    for(let i = 0; i < iMax;i++){
        particles[i] = [];
        for(let j = 0; j < jMax;j++){
            particles[i][j] = new Particle(i*dx,-j*dx,0,0,0.01,0.01);
            particleSystem.AddParticle(particles[i][j]);
        }
    }
    for(let i = 1; i < iMax-1;i++){
        for(let j = 1; j < jMax-1;j++){
            particleSystem.AddForce(new Rope(particles[i][j],particles[i][j+1],kConst,dx));
            particleSystem.AddForce(new Rope(particles[i][j],particles[i][j-1],kConst,dx));
            particleSystem.AddForce(new Rope(particles[i][j],particles[i+1][j],kConst,dx));
            particleSystem.AddForce(new Rope(particles[i][j],particles[i-1][j],kConst,dx));
        }
    }
    for(let i = 1; i < iMax-1;i++){
        particleSystem.AddForce(new Rope(particles[i][0],particles[i-1][0],kConst,dx));
        particleSystem.AddForce(new Rope(particles[i][0],particles[i+1][0],kConst,dx));
        particleSystem.AddForce(new Rope(particles[i][jMax-1],particles[i-1][jMax-1],kConst,dx));
        particleSystem.AddForce(new Rope(particles[i][jMax-1],particles[i+1][jMax-1],kConst,dx));
    }
    for(let j = 1; j < jMax-1;j++){
        particleSystem.AddForce(new Rope(particles[0][j],particles[0][j-1],kConst,dx));
        particleSystem.AddForce(new Rope(particles[0][j],particles[0][j+1],kConst,dx));
        particleSystem.AddForce(new Rope(particles[iMax-1][j],particles[iMax-1][j-1],kConst,dx));
        particleSystem.AddForce(new Rope(particles[iMax-1][j],particles[iMax-1][j+1],kConst,dx));
    }

    particles[0][0].LockPosition();
    particles[iMax-1][0].LockPosition();

    
    ///////Add Forces to System
    particleSystem.AddForce(new Gravity(9.8));
    particleSystem.AddForce(new ViscousDrag(0.01));
}