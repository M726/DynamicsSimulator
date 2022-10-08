window.addEventListener('load', function () {
    init();
});

let canvas:Canvas;

let objects:Array<PhysicalObject> = [];

function init(){
    canvas = new Canvas(<HTMLCanvasElement> elId("canvas"));
    elId("canvas").addEventListener("click",e=>{
        let boundingClient = canvas.GetBoundingClientRect();
        let mousePos = new number2(
            (e.clientX-boundingClient.left)*(canvas.GetWidth() / boundingClient.width),
            (e.clientY-boundingClient.top)*(canvas.GetHeight() / boundingClient.height),
        ).ScalarDivide(canvas.GetScale());
        console.log("Click: " + mousePos.toString());
        objects.push(new Circle(mousePos,randRange(0,10)));
    });
    window.addEventListener("resize", setCanvasSize);
    const reset = elId("resetBtn");
    if(reset != null) reset.addEventListener("click",e=>{canvas.Reset()});


    const addCircleBtn = elId("addCircleBtn");
    if(addCircleBtn != null) 
        addCircleBtn.addEventListener("click", e=>{
            objects.push(
                new Circle(
                    new number2(
                        randRange(0,canvas.GetWidth()),
                        randRange(0,canvas.GetHeight())),
                    randRange(0,10))
        )});

        setCanvasSize();
    let dt = 1000/240;


    function tick():void{
        //objects.forEach(e=>e.ZeroForceAccumulator());
        //forceObjects.forEach(e=>e.ApplyForce(ParticleSystem));



        

        for(let i:number = 0; i < objects.length; i++){
            objects[i].AddForce(new number2((rand()-0.5)/1000,0.001),dt)
        }

        canvas.SetData(objects);
    }

    setInterval(function(){
        tick();
    },dt);
}


function setCanvasSize(){
    canvas.SetHeight(window.innerHeight);
    canvas.SetWidth(window.innerWidth);
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