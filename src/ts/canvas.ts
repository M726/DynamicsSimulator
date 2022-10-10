
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
    private offset:number2 = new number2(0,0); 

    private frameCounter:number = 1;

    private textObject = new CanvasText("",new number2(10,25));

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
        this.canvasProperties.offset = this.GetOffsetScaled();
        this.canvasProperties.scale = this.scale
    }
    public GetCanvasProperties():CanvasProperties{
        return this.canvasProperties;
    }

    public SetParticleData(data:Array<CanvasObject>){
        this.objects = data;
    }

    public Reset():void{
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

    private DrawCanvasObjectUI(object:CanvasObject){
        this.Path();
        object.RenderUI(this.canvasProperties);
        this.Stroke();
    }
    private DrawObjects(){
        this.objects.forEach(e=>{
            this.DrawCanvasObject(e);
        });
    }

    private DrawCanvasObject(object:CanvasObject){
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

    
    public GetOffsetScaled():number2{
        return this.offset.ScalarDivide(this.scale);
    }
    public SetOffsetScaled(offset:number2):void{
        this.offset = offset.ScalarMultiply(this.scale)
    }
    public GetOffsetPx():number2{
        return this.offset;
    }
    public SetOffsetPx(offset:number2):void{
        this.offset = offset;
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
    offset:number2;
    scale:number;
    ctx:CanvasRenderingContext2D;

    Line(pointA:number2, pointB:number2){
        this.ctx.moveTo(pointA.x,pointA.y);
        this.ctx.lineTo(pointB.x,pointB.y);
    }

    Circle(center:number2,radius:number){
        this.ctx.arc(
            center.x,
            center.y,
            radius,
            0,360);
    }

    TransformObjectToCanvas(objectCoordinates:number2):number2{
        return new number2(
            this.TransformObjectToCanvasX(objectCoordinates.x),
            this.TransformObjectToCanvasY(objectCoordinates.y));
    }

    TransformObjectToCanvasX(x:number):number{
        return this.scale * (this.width/2 + (x + this.offset.x));
    }

    TransformObjectToCanvasY(y:number):number{
        return this.scale * (this.height/2 - (y + this.offset.y));
    }

    TransformCanvasToObject(canvasCoordinates:number2):number2{
        return new number2(
            this.TransformCanvasToObjectX(canvasCoordinates.x),
            this.TransformCanvasToObjectY(canvasCoordinates.y));
    }
    TransformCanvasToObjectX(x:number):number{
        return x/this.scale - this.width/2 - this.offset.x;
    }
    TransformCanvasToObjectY(y:number):number{
        return -y/this.scale + this.height/2 - this.offset.y;
    }

    LineObjectToCanvas(pA:number2, pB:number2){
        this.Line(
            this.TransformObjectToCanvas(pA),
            this.TransformObjectToCanvas(pB));
    }

    CircleObjectToCanvas(center:number2,radius:number){
        this.Circle(
            this.TransformObjectToCanvas(center),
            this.scale * (radius)
        );
    }
}

interface CanvasObject{
    RenderObject(canvasProperties: CanvasProperties):void;
    RenderUI(canvasProperties: CanvasProperties):void;
}

class CanvasCircle implements CanvasObject{
    position : number2;
    radius : number;

    public constructor(position : number2, radius : number){
        this.position = position;
        this.radius = radius;
    }

    RenderObject(canvasProperties:CanvasProperties):void{
        canvasProperties.CircleObjectToCanvas(this.position,this.radius);
    }
    RenderUI(canvasProperties: CanvasProperties): void {
        canvasProperties.Circle(this.position,this.radius);
    }
} 

class CanvasText implements CanvasObject{
    text: string;
    position: number2;

    constructor(text:string, position:number2){
        this.text = text;
        this.position = position;
    }
    RenderObject(canvasProperties: CanvasProperties):void{
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font="20px Calibri";
        canvasProperties.ctx.fillText(
            this.text,
            canvasProperties.TransformObjectToCanvasX(this.position.x),
            canvasProperties.TransformObjectToCanvasY(this.position.y));
    }
    RenderUI(canvasProperties: CanvasProperties): void {
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font="20px Calibri";
        canvasProperties.ctx.fillText(
            this.text,
            this.position.x,
            this.position.y);
    }

    public SetText(text:string){
        this.text = text;
    }

}

class CanvasVector implements CanvasObject{
    origin:number2;
    direction:number2;

    constructor(origin:number2, direction:number2){
        this.origin = origin;
        this.direction = direction;
    }

    RenderObject(canvasProperties: CanvasProperties): void {
        canvasProperties.LineObjectToCanvas(this.origin, this.origin.Add(this.direction));
    }
    RenderUI(canvasProperties: CanvasProperties): void {
        canvasProperties.Line(this.origin, this.origin.Add(this.direction));
    }

}

class CanvasLine implements CanvasObject{
    origin:number2;
    point2:number2;

    constructor(origin:number2, point2:number2){
        this.origin = origin;
        this.point2 = point2;
    }

    RenderObject(canvasProperties: CanvasProperties): void {
        canvasProperties.LineObjectToCanvas(this.origin, this.point2);
    }
    RenderUI(canvasProperties: CanvasProperties): void {
        canvasProperties.Line(this.origin, this.point2);
    }
}