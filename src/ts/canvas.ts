
class Canvas{
    private c : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private canvasProperties : CanvasProperties;

    private objects: Array<CanvasObject> = [];

    private color:string = "#FFFFFF";
    private drawObjectUI:boolean = true;
    private drawObjects:boolean = true;
    private drawUI:boolean = true;
    private scale:number = 1; 
    private offsetX:number = 0;
    private offsetY:number = 0;

    private frameCounter:number = 1;

    private textObject = new CanvasText("",10,25);

    public constructor(canvas:HTMLCanvasElement){
        this.c = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvasProperties = new CanvasProperties();
        this.canvasProperties.ctx = this.ctx;

        this.RenderLoop();
    }
    public RenderLoop(){
        window.requestAnimationFrame(e=>{this.RenderLoop()});
        this.Render();
    }

    public UpdateCanvasProperties(){
        this.canvasProperties.width = this.GetWidthScaled();
        this.canvasProperties.height = this.GetHeightScaled();
        this.canvasProperties.offsetX = this.GetOffsetXScaled();
        this.canvasProperties.offsetY = this.GetOffsetYScaled();
        this.canvasProperties.scale = this.scale
    }
    public GetCanvasProperties():CanvasProperties{
        return this.canvasProperties;
    }

    public SetParticleData(data:Array<CanvasObject>){
        this.objects = data;
    }

    public Reset():void{
        for(let i = 0; i < this.objects.length; i++){
            delete(this.objects[i]);
        }
        this.objects = [];
        this.color = "#FFFFFF";
    }

    public Render():void{
        this.UpdateCanvasProperties();

        this.Clear();
        if(this.drawObjectUI){
            this.DrawObjectUI();
        }
        if(this.drawObjects){
            this.DrawObjects();
        }
        if(this.drawUI){
            this.DrawUI();
        }


        this.frameCounter++;
    }

    public Clear():void{
        this.DrawBackground();
    }

    private DrawObjectUI(){

    }

    private DrawUI(){
        this.textObject.SetText("Frame " + this.frameCounter);
        this.textObject.RenderUI(this.canvasProperties);
    }
    private DrawObjects(){
        this.objects.forEach(e=>{
            this.DrawCanvasObject(e);
        });
    }

    public DrawCanvasObject(object:CanvasObject){
        this.Path();
        object.RenderObject(this.canvasProperties);
        this.Stroke();
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

    public SetColor(color:string):void{
        this.color=color;
    }
    public SetScale(scale:number):void{
        this.scale = scale; 
    }
    public GetScale():number{
        return this.scale;
    }
    public GetFrameNumber():number{
        return this.frameCounter;
    }

    public SetDimensionsPx(height: number, width: number) {
        this.SetHeightPx(height);
        this.SetWidthPx(width);

    }
    public GetWidthPx():number{
        return this.c.width;
    }
    public GetHeightPx():number{
        return this.c.height;
    }
    public GetWidthScaled():number{
        return this.c.width/this.scale;
    }
    public GetHeightScaled():number{
        return this.c.height/this.scale;
    }

    
    public GetOffsetXScaled():number{
        return this.offsetX/this.scale;
    }
    public GetOffsetYScaled():number{
        return this.offsetY/this.scale;
    }
    public SetOffsetScaled(offsetX:number, offsetY:number):void{
        this.SetOffsetXScaled(offsetX);
        this.SetOffsetYScaled(offsetY);
    }
    public SetOffsetXScaled(offsetX:number):void{
        this.offsetX = offsetX * this.scale;
    }
    public SetOffsetYScaled(offsetY:number):void{
        this.offsetY = offsetY * this.scale;
    }
    public GetOffsetXPx():number{
        return this.offsetX;
    }
    public GetOffsetYPx():number{
        return this.offsetY;
    }
    public SetOffsetXPx(offsetX:number):void{
        this.offsetX = offsetX;
    }
    public SetOffsetYPx(offsetY:number):void{
        this.offsetY = offsetY;
    }
    public SetOffsetPx(offsetX:number, offsetY:number):void{
        this.SetOffsetXPx(offsetX);
        this.SetOffsetYPx(offsetY);
    }

    public GetBoundingClientRect(){
        return this.c.getBoundingClientRect();
    }

    public SetWidthPx(width:number):void{
        this.c.width = width;
    }
    public SetHeightPx(height:number):void{
        this.c.height = height;
    }
}


class CanvasProperties{
    width:number;
    height:number;
    offsetX:number;
    offsetY:number;
    scale:number;
    ctx:CanvasRenderingContext2D;

    Line(x1:number, y1:number, x2:number, y2:number){
        this.ctx.moveTo(x1,y1);
        this.ctx.lineTo(x2,y2);
    }

    Circle(x:number, y:number, radius:number){
        this.ctx.arc(
            x,y,radius,
            0,360);
    }

    TransformObjectToCanvasX(x:number):number{
        return this.scale * (this.width/2 + (x + this.offsetX));
    }

    TransformObjectToCanvasY(y:number):number{
        return this.scale * (this.height/2 - (y + this.offsetY));
    }
    TransformCanvasToObjectX(x:number):number{
        return x/this.scale - this.width/2 - this.offsetX;
    }
    TransformCanvasToObjectY(y:number):number{
        return -y/this.scale + this.height/2 - this.offsetY;
    }

    LineObjectToCanvas(x1:number, y1:number, x2:number, y2:number){
        this.Line(
            this.TransformObjectToCanvasX(x1),
            this.TransformObjectToCanvasY(y1),
            this.TransformObjectToCanvasX(x2),
            this.TransformObjectToCanvasY(y2),);
    }

    CircleObjectToCanvas(x:number, y:number, radius:number){
        this.Circle(
            this.TransformObjectToCanvasX(x),
            this.TransformObjectToCanvasY(y),
            this.scale * (radius)
        );
    }
}

interface CanvasObject{
    RenderObject(canvasProperties: CanvasProperties):void;
    RenderUI(canvasProperties: CanvasProperties):void;
}

class CanvasCircle implements CanvasObject{
    x:number;
    y:number;
    radius : number;

    public constructor(x : number, y:number, radius : number){
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    RenderObject(canvasProperties:CanvasProperties):void{
        canvasProperties.CircleObjectToCanvas(this.x,this.y,this.radius);
    }
    RenderUI(canvasProperties: CanvasProperties): void {
        canvasProperties.Circle(this.x,this.y,this.radius);
    }
} 

class CanvasText implements CanvasObject{
    text: string;
    x:number;
    y:number;

    constructor(text:string, x:number, y:number){
        this.text = text;
        this.x = x;
        this.y = y;
    }
    RenderObject(canvasProperties: CanvasProperties):void{
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font="20px Calibri";
        canvasProperties.ctx.fillText(
            this.text,
            canvasProperties.TransformObjectToCanvasX(this.x),
            canvasProperties.TransformObjectToCanvasY(this.y));
    }
    RenderUI(canvasProperties: CanvasProperties): void {
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font="20px Calibri";
        canvasProperties.ctx.fillText(
            this.text,
            this.x,
            this.y);
    }

    public SetText(text:string){
        this.text = text;
    }

}

class CanvasVector implements CanvasObject{
    x:number;
    y:number;
    dx:number;
    dy:number;

    constructor(x:number, y:number, dx:number, dy:number){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    RenderObject(canvasProperties: CanvasProperties): void {
        canvasProperties.LineObjectToCanvas(this.x,this.y,this.x+this.dx, this.y+this.dy);
    }
    RenderUI(canvasProperties: CanvasProperties): void {
        canvasProperties.Line(this.x,this.y,this.x+this.dx, this.y+this.dy);
    }

}

class CanvasLine implements CanvasObject{
    x1:number;
    y1:number;
    x2:number;
    y2:number;

    constructor(x1:number, y1:number, x2:number, y2:number){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    RenderObject(canvasProperties: CanvasProperties): void {
        canvasProperties.LineObjectToCanvas(this.x1,this.y1,this.x2,this.y2);
    }
    RenderUI(canvasProperties: CanvasProperties): void {
        canvasProperties.Line(this.x1,this.y1,this.x2,this.y2);
    }
}