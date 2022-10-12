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
    //canvas.SetOffsetPx(0,canvas.GetHeightPx()/2);
    
    

    let iMax = 30;
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
            particleSystem.AddForce(new Spring(particles[i][j],particles[i][j+1],kConst,dx));
            particleSystem.AddForce(new Spring(particles[i][j],particles[i][j-1],kConst,dx));
            particleSystem.AddForce(new Spring(particles[i][j],particles[i+1][j],kConst,dx));
            particleSystem.AddForce(new Spring(particles[i][j],particles[i-1][j],kConst,dx));
        }
    }
    for(let i = 1; i < iMax-1;i++){
        particleSystem.AddForce(new Spring(particles[i][0],particles[i-1][0],kConst,dx));
        particleSystem.AddForce(new Spring(particles[i][0],particles[i+1][0],kConst,dx));
        particleSystem.AddForce(new Spring(particles[i][jMax-1],particles[i-1][jMax-1],kConst,dx));
        particleSystem.AddForce(new Spring(particles[i][jMax-1],particles[i+1][jMax-1],kConst,dx));
    }
    for(let j = 1; j < jMax-1;j++){
        particleSystem.AddForce(new Spring(particles[0][j],particles[0][j-1],kConst,dx));
        particleSystem.AddForce(new Spring(particles[0][j],particles[0][j+1],kConst,dx));
        particleSystem.AddForce(new Spring(particles[iMax-1][j],particles[iMax-1][j-1],kConst,dx));
        particleSystem.AddForce(new Spring(particles[iMax-1][j],particles[iMax-1][j+1],kConst,dx));
    }

    particles[0][0].LockPosition();
    particles[iMax-1][0].LockPosition();
    //particles[0][jMax-1].LockPosition();
    //particles[iMax-1][jMax-1].LockPosition();
    


    //Add Forces to System
    particleSystem.AddForce(new Gravity(9.8));
    particleSystem.AddForce(new ViscousDrag(0.01));



    let timerDtSeconds = 0.004;
    let dt = 0.001;
    
    tick();
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
    let mouseDownX:number;
    let mouseDownY:number;
    let previousOffsetX:number = canvas.GetOffsetXPx();
    let previousOffsetY:number = canvas.GetOffsetYPx();
    let particle:Particle;

    //TODO: Add particleSystem.RemoveParticle()
    let mouseParticle = new Particle(0,0,0,0,1,0);
    //TODO: Spring force should be a function of the other particles mass? and other forces?
    let mouseSpring = new Spring(mouseParticle,mouseParticle,100,0,10);
    mouseParticle.LockPosition();
    //particleSystem.AddParticle(mouseParticle);
    particleSystem.AddForce(mouseSpring);


    document.addEventListener('contextmenu', event => event.preventDefault());
    canvasEl.addEventListener("mousedown", handlerCanvasMouseDown);
    canvasEl.addEventListener("mouseup", handlerCanvasMouseUp);
    canvasEl.addEventListener("mousemove", handlerCanvasMouseDrag);
    document.addEventListener("wheel", e => {
        console.log(-e.deltaY/100);
        let ds = 0.04*(canvas.GetScale()-1)+1;
        let newScale = canvas.GetScale()-(e.deltaY/100)*ds;
        if(newScale >1)
            canvas.SetScale(newScale);
    });

    function handlerCanvasMouseDown(e:MouseEvent){
        if(mouseDown != -1) return;
        mouseDownX = getCanvasMouseX(e,canvas);
        mouseDownY = getCanvasMouseY(e,canvas);
        mouseDown = e.button;

        let mousePositionObjectX = canvasProperties.TransformCanvasToObjectX(mouseDownX);
        let mousePositionObjectY = canvasProperties.TransformCanvasToObjectY(mouseDownY);

        particle = particleSystem.FindClosestParticle(mousePositionObjectX,mousePositionObjectY);
        if(particleSystem.GetDistanceToParticle(particle,mousePositionObjectX,mousePositionObjectY) > 50/canvas.GetScale())
            particle = mouseParticle;
        //console.log(particle.position.Subtract(mousePositionObject).Length());
        
    }

    function handlerCanvasMouseUp(e:MouseEvent){
        if(e.button != mouseDown) return;
        switch(e.button){
            case 0:
                mouseSpring.pB = mouseParticle;
                particle = mouseParticle;
                break;
            case 1:
                if(previousOffsetX == canvas.GetOffsetXPx() && previousOffsetY == canvas.GetOffsetYPx()){
                    canvas.SetOffsetPx(0,0);
                }
                previousOffsetX = canvas.GetOffsetXPx();
                previousOffsetY = canvas.GetOffsetYPx();
                break;
        }
        mouseDown = -1;
    }

    function handlerCanvasMouseDrag(e:MouseEvent){
        if(mouseDown == -1) return;

        let movementVectorX = getCanvasMouseX(e,canvas) - mouseDownX;
        let movementVectorY = -getCanvasMouseY(e,canvas) + mouseDownY;

        switch(mouseDown){
            case 0:
                mouseParticle.x = canvasProperties.TransformCanvasToObjectX(getCanvasMouseX(e,canvas));
                mouseParticle.y = canvasProperties.TransformCanvasToObjectY(getCanvasMouseY(e,canvas));
                mouseSpring.pB = particle;
                //particle.LockPosition();
                
            break;
            case 1:
                canvas.SetOffsetPx(movementVectorX + previousOffsetX, movementVectorY + previousOffsetY);
            break;
        }
        if(mouseDown == 1){}
    }
}

function getCanvasMouseX(e:MouseEvent, canvasObject:Canvas):number{
    let boundingClient = canvasObject.GetBoundingClientRect();
    return (e.clientX-boundingClient.left)*(canvasObject.GetWidthPx() / boundingClient.width);
}
function getCanvasMouseY(e:MouseEvent, canvasObject:Canvas):number{
    let boundingClient = canvasObject.GetBoundingClientRect();
    return (e.clientY-boundingClient.top)*(canvasObject.GetHeightPx() / boundingClient.height);
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