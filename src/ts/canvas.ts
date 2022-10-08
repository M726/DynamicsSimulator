
class Canvas{
    private c : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;

    private objects: Array<CanvasObject> = [];
    private color:string = "#FFFFFF";
    private scale:number = 1; 

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
    public SetScale(scale:number):void{
        this.ctx.scale(1/this.scale,1/this.scale);
        this.ctx.scale(scale,scale);
        this.scale = scale;

        this.Render();
    }
    public GetScale():number{
        return this.scale;
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

interface CanvasObject{
    Render(ctx:CanvasRenderingContext2D):void;
}

class Circle{
    Render(ctx:CanvasRenderingContext2D):void{
        ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,360);
    }
    position : number2;
    radius : number;

    public constructor(position : number2, radius : number){
        this.position = position;
        this.radius = radius;
    }
}

class CanvasText implements CanvasObject{
    Render(ctx:CanvasRenderingContext2D):void{
        ctx.strokeText(
            this.text,
            this.position.x,
            this.position.y,
            ctx.measureText(this.text).width);
    }

    text: string;
    position: number2;

    constructor(text:string, position:number2){
        this.text = text;
        this.position = position;
    }


    public SetText(text:string){
        this.text = text;
    }

}