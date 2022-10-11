window.addEventListener('load', function () {
    init();
});
let canvasEl = element("canvas");
let canvas:Canvas;
let particleSystem:ParticleSystem;
let canvasRenderAPI:CanvasRenderAPI;
let canvasProperties:CanvasProperties;

function init(){
    particleSystem = new ParticleSystem();
    canvas = new Canvas(<HTMLCanvasElement> canvasEl);
    canvasRenderAPI = new CanvasRenderAPI(canvas,particleSystem);
    canvasProperties = canvas.GetCanvasProperties();
    
    canvas.SetDimensionsPx(window.innerHeight,window.innerWidth);
    window.addEventListener("resize", e=>canvas.SetDimensionsPx(window.innerHeight,window.innerWidth));

    canvas.SetScale(60);
    canvas.SetOffsetPx(new number2(0,canvas.GetHeightPx()/2));
    
    //Define particles
    let pAnchor = new Particle(0, 0,   0,    0,    0.001);
    pAnchor.LockPosition();
    //Add Particles to System
    particleSystem.AddParticle(pAnchor);

    let particles:Array<Particle> = new Array(20);
    particles[0] = new Particle(-0.5,  0,    0,   0,   0.1);
    particleSystem.AddParticle(particles[0]);
    for(let i = 1; i < particles.length;i++){
        particles[i] = new Particle(-0.5*i-0.5,  0,    0,   0,   0.1);
        particleSystem.AddParticle(particles[i]);
        particleSystem.AddForce(new Spring(particles[i-1],particles[i],30,0.5,1));
    }


    //Add Forces to System
    particleSystem.AddForce(new Gravity(9.8));
    particleSystem.AddForce(new ViscousDrag(0.01));

    particleSystem.AddForce(new Spring(pAnchor,particles[0],30,0.5,1));



    let timerDtSeconds = 0.004;
    let dt = 0.00001;
    
    function tick():void{
        //runs every 4 ms
        for(let i = 0; i < timerDtSeconds/dt; i++){
            particleSystem.RunTimeStep(dt);
        }
    }
    function updateFrame():void{
        canvasRenderAPI.UpdateData();
    }
    
    setInterval(tick,timerDtSeconds*1000);//4ms timer
    setInterval(updateFrame,1000/30);


    ////Handle Mouse Stuff:
    let mouseDown:number = -1;
    let mouseDownPosition:number2;
    let previousOffset:number2 = new number2(0,0);
    let particle:Particle;

    document.addEventListener('contextmenu', event => event.preventDefault());
    canvasEl.addEventListener("mousedown", handlerCanvasMouseDown);
    canvasEl.addEventListener("mouseup", handlerCanvasMouseUp);
    canvasEl.addEventListener("mousemove", handlerCanvasMiddleMouseDrag);

    function handlerCanvasMouseDown(e:MouseEvent){
        if(mouseDown != -1) return;
        mouseDownPosition = getCanvasMouseCoordinates(e,canvas);
        mouseDown = e.button;

        particle = particleSystem.FindClosestParticle(canvasProperties.TransformCanvasToObject(mouseDownPosition));
    }

    function handlerCanvasMouseUp(e:MouseEvent){
        if(e.button != mouseDown) return;
        switch(e.button){
            case 0:
                particle.UnlockPosition();
                break;
            case 1:
                if(previousOffset == canvas.GetOffsetPx()){
                    canvas.SetOffsetPx(new number2(0,0));
                }else previousOffset = canvas.GetOffsetPx();
                break;
        }
        mouseDown = -1;
    }

    function handlerCanvasMiddleMouseDrag(e:MouseEvent){
        if(mouseDown == -1) return;

        let movementVector = getCanvasMouseCoordinates(e,canvas)
        .Subtract(mouseDownPosition);
        movementVector.y *= -1;

        switch(mouseDown){
            case 0:
                
                particle.LockPosition();
                particle.position.Add(canvasProperties.TransformCanvasToObjectVector(movementVector))
            break;
            case 1:
                canvas.SetOffsetPx(movementVector.Add(previousOffset));    
            break;
        }
        if(mouseDown == 1){}
    }
}

function getCanvasMouseCoordinates(e:MouseEvent, canvasObject:Canvas):number2{
    let boundingClient = canvasObject.GetBoundingClientRect();
    return (new number2(
        (e.clientX-boundingClient.left)*(canvasObject.GetWidthPx() / boundingClient.width),
        (e.clientY-boundingClient.top)*(canvasObject.GetHeightPx() / boundingClient.height),
    ));
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