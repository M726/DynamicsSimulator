class Canvas {
    c;
    ctx;
    canvasProperties;
    objects = [];
    color = "#FFFFFF";
    scale = 1;
    frameCounter = 0;
    textObject = new CanvasText("", new number2(10, 30));
    constructor(canvas) {
        this.c = canvas;
        this.ctx = canvas.getContext("2d");
        this.Render();
    }
    UpdateCanvasProperties() {
        this.canvasProperties = {
            ctx: this.ctx,
            width: this.GetPxWidth(),
            height: this.GetPxHeight(),
            scale: this.scale
        };
    }
    SetParticleData(data) {
        this.objects = data;
    }
    Reset() {
        this.objects = [];
        this.color = "#FFFFFF";
        this.Render();
    }
    Render() {
        this.UpdateCanvasProperties();
        this.frameCounter++;
        this.textObject.SetText(this.frameCounter.toString());
        window.requestAnimationFrame(e => { this.Render(); });
        this.Clear();
        this.Draw();
    }
    Clear() {
        this.DrawBackground();
    }
    SetColor(color) {
        this.color = color;
        this.Render();
    }
    SetScale(scale) {
        this.scale = scale;
        this.Render();
    }
    GetScale() {
        return this.scale;
    }
    Draw() {
        for (let i = 0; i < this.objects.length; i++) {
            this.Path();
            this.objects[i].Render(this.canvasProperties);
            this.Stroke();
        }
        this.textObject.Render(this.canvasProperties);
    }
    Path() {
        this.ctx.beginPath();
    }
    Stroke() {
        this.ctx.stroke();
    }
    DrawBackground() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, this.c.width, this.c.height);
    }
    GetFrameNumber() {
        return this.frameCounter;
    }
    SetDimensions(height, width) {
        this.SetHeight(height);
        this.SetWidth(width);
        this.Render();
    }
    GetWidth() {
        return this.c.width;
    }
    GetHeight() {
        return this.c.height;
    }
    GetPxWidth() {
        return this.c.width / this.scale;
    }
    GetPxHeight() {
        return this.c.height / this.scale;
    }
    GetBoundingClientRect() {
        return this.c.getBoundingClientRect();
    }
    SetWidth(width) {
        this.c.width = width;
    }
    SetHeight(height) {
        this.c.height = height;
    }
}
class CanvasProperties {
    width;
    height;
    scale;
    get ctx() {
        return this.ctx;
    }
    set ctx(value) {
        this.ctx;
    }
}
class Circle {
    Render(canvasProperties) {
        canvasProperties.ctx.arc(canvasProperties.scale * (this.position.x), canvasProperties.scale * (canvasProperties.height - this.position.y), canvasProperties.scale * (this.radius), 0, 360);
    }
    position;
    radius;
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }
}
class CanvasText {
    Render(canvasProperties) {
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font = "30px Calibri";
        canvasProperties.ctx.fillText(this.text, this.position.x, this.position.y);
    }
    text;
    position;
    constructor(text, position) {
        this.text = text;
        this.position = position;
    }
    SetText(text) {
        this.text = text;
    }
}
class CanvasVector {
    origin;
    direction;
    point2;
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
    Render(canvasProperties) {
        this.point2 = this.origin.Add(this.direction);
        canvasProperties.ctx.moveTo(canvasProperties.scale * this.origin.x, canvasProperties.scale * (canvasProperties.height - this.origin.y));
        canvasProperties.ctx.lineTo(canvasProperties.scale * this.point2.x, canvasProperties.scale * (canvasProperties.height - this.point2.y));
    }
}
//# sourceMappingURL=canvas.js.map