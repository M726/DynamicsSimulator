
class Canvas{
    private c : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private canvasProperties : CanvasProperties;

    private objects: Array<CanvasObject> = [];
    private color:string = "#FFFFFF";
    private scale:number = 1; 

    private frameCounter:number = 0;

    private textObject = new CanvasText("",new number2(10,30));

    public constructor(canvas:HTMLCanvasElement){
        this.c = canvas;
        this.ctx = canvas.getContext("2d");

        this.Render();
    }
    public UpdateCanvasProperties(){
        this.canvasProperties = {
            ctx: this.ctx,
            width: this.GetPxWidth(),
            height: this.GetPxHeight(),
            scale: this.scale
        }
    }

    public SetParticleData(data:Array<CanvasObject>){
        this.objects = data;
    }

    public Reset():void{
        this.objects = [];
        this.color = "#FFFFFF";
        this.Render();
    }

    public Render():void{
        this.UpdateCanvasProperties();
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
        this.scale = scale;

        this.Render();
    }
    public GetScale():number{
        return this.scale;
    }

    private Draw(){
        for(let i = 0; i<this.objects.length; i++){
            this.Path();
            this.objects[i].Render(this.canvasProperties);
            this.Stroke();
        }
        this.textObject.Render(this.canvasProperties);
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

    public SetDimensions(height: number, width: number) {
        this.SetHeight(height);
        this.SetWidth(width);
        this.Render();

    }
    public GetWidth():number{
        return this.c.width;
    }
    public GetHeight():number{
        return this.c.height;
    }
    public GetPxWidth():number{
        return this.c.width/this.scale;
    }
    public GetPxHeight():number{
        return this.c.height/this.scale;
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


class CanvasProperties{
    width:number;
    height:number;
    scale:number;

    get ctx():CanvasRenderingContext2D{
        return this.ctx;
    }
    set ctx(value: CanvasRenderingContext2D){
        this.ctx;
    }
}

interface CanvasObject{
    Render(canvasProperties: CanvasProperties):void;
}

class Circle implements CanvasObject{
    Render(canvasProperties:CanvasProperties):void{
        canvasProperties.ctx.arc(
            canvasProperties.scale * (this.position.x),
            canvasProperties.scale * (canvasProperties.height-this.position.y),
            canvasProperties.scale * (this.radius),
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
    Render(canvasProperties):void{
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font="30px Calibri";
        canvasProperties.ctx.fillText(
            this.text,
            this.position.x,
            this.position.y);
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

class CanvasVector implements CanvasObject{
    origin:number2;
    direction:number2;

    point2:number2;

    constructor(origin:number2, direction:number2){
        this.origin = origin;
        this.direction = direction;
    }

    Render(canvasProperties: CanvasProperties): void {

        this.point2 = this.origin.Add(this.direction);
        canvasProperties.ctx.moveTo(
            canvasProperties.scale * this.origin.x,
            canvasProperties.scale * (canvasProperties.height-this.origin.y));
        canvasProperties.ctx.lineTo(
            canvasProperties.scale * this.point2.x,
            canvasProperties.scale * (canvasProperties.height-this.point2.y));
    }

}