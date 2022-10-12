class Canvas {
    c;
    ctx;
    canvasProperties;
    objects = [];
    color = "#FFFFFF";
    drawObjectUI = true;
    drawObjects = true;
    drawUI = true;
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    frameCounter = 1;
    textObject = new CanvasText("", 10, 25);
    constructor(canvas) {
        this.c = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvasProperties = new CanvasProperties();
        this.canvasProperties.ctx = this.ctx;
        this.RenderLoop();
    }
    RenderLoop() {
        window.requestAnimationFrame(e => { this.RenderLoop(); });
        this.Render();
    }
    UpdateCanvasProperties() {
        this.canvasProperties.width = this.GetWidthScaled();
        this.canvasProperties.height = this.GetHeightScaled();
        this.canvasProperties.offsetX = this.GetOffsetXScaled();
        this.canvasProperties.offsetY = this.GetOffsetYScaled();
        this.canvasProperties.scale = this.scale;
    }
    GetCanvasProperties() {
        return this.canvasProperties;
    }
    SetParticleData(data) {
        this.objects = data;
    }
    Reset() {
        for (let i = 0; i < this.objects.length; i++) {
            delete (this.objects[i]);
        }
        this.objects = [];
        this.color = "#FFFFFF";
    }
    Render() {
        this.UpdateCanvasProperties();
        this.Clear();
        if (this.drawObjectUI) {
            this.DrawObjectUI();
        }
        if (this.drawObjects) {
            this.DrawObjects();
        }
        if (this.drawUI) {
            this.DrawUI();
        }
        this.frameCounter++;
    }
    Clear() {
        this.DrawBackground();
    }
    DrawObjectUI() {
    }
    DrawUI() {
        this.textObject.SetText("Frame " + this.frameCounter);
        this.textObject.RenderUI(this.canvasProperties);
    }
    DrawObjects() {
        this.objects.forEach(e => {
            this.DrawCanvasObject(e);
        });
    }
    DrawCanvasObject(object) {
        this.Path();
        object.RenderObject(this.canvasProperties);
        this.Stroke();
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
    SetColor(color) {
        this.color = color;
    }
    SetScale(scale) {
        this.scale = scale;
        console.log();
    }
    GetScale() {
        return this.scale;
    }
    GetFrameNumber() {
        return this.frameCounter;
    }
    SetDimensionsPx(height, width) {
        this.SetHeightPx(height);
        this.SetWidthPx(width);
    }
    GetWidthPx() {
        return this.c.width;
    }
    GetHeightPx() {
        return this.c.height;
    }
    GetWidthScaled() {
        return this.c.width / this.scale;
    }
    GetHeightScaled() {
        return this.c.height / this.scale;
    }
    GetOffsetXScaled() {
        return this.offsetX / this.scale;
    }
    GetOffsetYScaled() {
        return this.offsetY / this.scale;
    }
    SetOffsetScaled(offsetX, offsetY) {
        this.SetOffsetXScaled(offsetX);
        this.SetOffsetYScaled(offsetY);
    }
    SetOffsetXScaled(offsetX) {
        this.offsetX = offsetX * this.scale;
    }
    SetOffsetYScaled(offsetY) {
        this.offsetY = offsetY * this.scale;
    }
    GetOffsetXPx() {
        return this.offsetX;
    }
    GetOffsetYPx() {
        return this.offsetY;
    }
    SetOffsetXPx(offsetX) {
        this.offsetX = offsetX;
    }
    SetOffsetYPx(offsetY) {
        this.offsetY = offsetY;
    }
    SetOffsetPx(offsetX, offsetY) {
        this.SetOffsetXPx(offsetX);
        this.SetOffsetYPx(offsetY);
    }
    GetBoundingClientRect() {
        return this.c.getBoundingClientRect();
    }
    SetWidthPx(width) {
        this.c.width = width;
    }
    SetHeightPx(height) {
        this.c.height = height;
    }
}
class CanvasProperties {
    width;
    height;
    offsetX;
    offsetY;
    scale;
    ctx;
    Line(x1, y1, x2, y2) {
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
    }
    Circle(x, y, radius) {
        this.ctx.arc(x, y, radius, 0, 360);
    }
    TransformObjectToCanvasX(x) {
        return this.scale * (this.width / 2 + (x + this.offsetX));
    }
    TransformObjectToCanvasY(y) {
        return this.scale * (this.height / 2 - (y + this.offsetY));
    }
    TransformCanvasToObjectX(x) {
        return x / this.scale - this.width / 2 - this.offsetX;
    }
    TransformCanvasToObjectY(y) {
        return -y / this.scale + this.height / 2 - this.offsetY;
    }
    LineObjectToCanvas(x1, y1, x2, y2) {
        this.Line(this.TransformObjectToCanvasX(x1), this.TransformObjectToCanvasY(y1), this.TransformObjectToCanvasX(x2), this.TransformObjectToCanvasY(y2));
    }
    CircleObjectToCanvas(x, y, radius) {
        this.Circle(this.TransformObjectToCanvasX(x), this.TransformObjectToCanvasY(y), this.scale * (radius));
    }
}
class CanvasCircle {
    x;
    y;
    radius;
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    RenderObject(canvasProperties) {
        canvasProperties.CircleObjectToCanvas(this.x, this.y, this.radius);
    }
    RenderUI(canvasProperties) {
        canvasProperties.Circle(this.x, this.y, this.radius);
    }
}
class CanvasText {
    text;
    x;
    y;
    constructor(text, x, y) {
        this.text = text;
        this.x = x;
        this.y = y;
    }
    RenderObject(canvasProperties) {
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font = "20px Calibri";
        canvasProperties.ctx.fillText(this.text, canvasProperties.TransformObjectToCanvasX(this.x), canvasProperties.TransformObjectToCanvasY(this.y));
    }
    RenderUI(canvasProperties) {
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font = "20px Calibri";
        canvasProperties.ctx.fillText(this.text, this.x, this.y);
    }
    SetText(text) {
        this.text = text;
    }
}
class CanvasVector {
    x;
    y;
    dx;
    dy;
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
    RenderObject(canvasProperties) {
        canvasProperties.LineObjectToCanvas(this.x, this.y, this.x + this.dx, this.y + this.dy);
    }
    RenderUI(canvasProperties) {
        canvasProperties.Line(this.x, this.y, this.x + this.dx, this.y + this.dy);
    }
}
class CanvasLine {
    x1;
    y1;
    x2;
    y2;
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    RenderObject(canvasProperties) {
        canvasProperties.LineObjectToCanvas(this.x1, this.y1, this.x2, this.y2);
    }
    RenderUI(canvasProperties) {
        canvasProperties.Line(this.x1, this.y1, this.x2, this.y2);
    }
}
//# sourceMappingURL=canvas.js.map