class Canvas {
    constructor(canvas) {
        this.objects = [];
        this.color = "#FFFFFF";
        this.scale = 1;
        this.frameCounter = 0;
        this.textObject = new CanvasText("", new number2(10, 15));
        this.c = canvas;
        this.ctx = canvas.getContext("2d");
        this.Render();
    }
    SetData(data) {
        this.objects = data;
    }
    Reset() {
        this.objects = [];
        this.color = "#FFFFFF";
        this.Render();
    }
    Render() {
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
        this.ctx.scale(1 / this.scale, 1 / this.scale);
        this.ctx.scale(scale, scale);
        this.scale = scale;
        this.Render();
    }
    GetScale() {
        return this.scale;
    }
    Draw() {
        for (let i = 0; i < this.objects.length; i++) {
            this.Path();
            this.objects[i].Render(this.ctx);
            this.Stroke();
        }
        this.textObject.Render(this.ctx);
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
    GetWidth() {
        return this.c.width;
    }
    GetHeight() {
        return this.c.height;
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
class Circle {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }
    Render(ctx) {
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 360);
    }
}
class CanvasText {
    constructor(text, position) {
        this.text = text;
        this.position = position;
    }
    Render(ctx) {
        ctx.strokeText(this.text, this.position.x, this.position.y, ctx.measureText(this.text).width);
    }
    SetText(text) {
        this.text = text;
    }
}
//# sourceMappingURL=canvas.js.map