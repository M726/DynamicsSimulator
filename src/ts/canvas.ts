
class Canvas{
    private c : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;

    private objects: Array<CanvasObject> = [];
    private color:string = "#FFFFFF";

    private frameCounter:number = 0;

    private textObject = new CanvasText("",new number2(10,15));

    public constructor(canvas:HTMLCanvasElement){
        this.c = canvas;
        this.ctx = canvas.getContext("2d");
        
        this.Render();
    }
    public SetData(data:Array<CanvasObject>){
        this.objects = data;
    }
    public Reset():void{
        this.objects = [];
        this.color = "#FFFFFF";
        this.Render();
    }

    public Render():void{
        this.frameCounter++;
        this.textObject.SetText(this.frameCounter.toString());

        window.requestAnimationFrame(e=>{this.Render()});
        this.Clear();
        this.Draw();
    }

    public Clear():void{
        this.DrawBackground();
    }

    public SetColor(color:string):void{
        this.color=color;
        this.Render();
    }

    private Draw(){
        for(let i = 0; i<this.objects.length; i++){
            this.Path();
            this.objects[i].Render(this.ctx);
            this.Stroke();
        }

        this.textObject.Render(this.ctx);
    }

    private Path():void{
        this.ctx.beginPath();
    }
    private Stroke():void{
        this.ctx.stroke();
    }

    private DrawBackground(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0,0,this.c.width,this.c.height);
    }

    public GetFrameNumber():number{
        return this.frameCounter;
    }

    public GetWidth():number{
        return this.c.width;
    }
    public GetHeight():number{
        return this.c.height;
    }

    public GetBoundingClientRect(){
        return this.c.getBoundingClientRect();
    }

    public SetWidth(width:number):void{
        this.c.width = width;
    }
    public SetHeight(height:number):void{
        this.c.height = height;
    }
}


enum ObjectType{
    Circle,
    Strut
}

interface PhysicalObject extends CanvasObject{
    mass:number;
    velocity:number2;
    AddForce(force: number2, dt: number);
}

interface CanvasObject{
    Render(ctx:CanvasRenderingContext2D):void;
}

class Circle implements PhysicalObject{
    position : number2;
    radius : number;

    mass:number = 1;
    velocity:number2 = new number2(0,0);
    acceleration:number2 = new number2(0,0);

    public constructor(position : number2, radius : number){
        this.position = position;
        this.radius = radius;
    }

    public SetPosition(position:number2){
        this.position = position;
    }

    public SetVelocity(velocity:number2){
        this.velocity = velocity;
    }

    public AddForce(force: number2, dt:number) {
        this.position = new number2(this.position.x + this.velocity.x*dt,this.position.y + this.velocity.y*dt);
        this.velocity = new number2(this.velocity.x + this.acceleration.x*dt,this.velocity.y + this.acceleration.y*dt);
        this.acceleration = new number2(force.x/this.mass,force.y/this.mass);
    }

    Render(ctx:CanvasRenderingContext2D):void{
        ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,360);
    }
}

class CanvasText implements CanvasObject{
    text: string;
    position: number2;

    constructor(text:string, position:number2){
        this.text = text;
        this.position = position;
    }

    Render(ctx:CanvasRenderingContext2D):void{
        ctx.strokeText(this.text,this.position.x,this.position.y);
    }

    public SetText(text:string){
        this.text = text;
    }
}