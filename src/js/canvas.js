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
    offset = new number2(0, 0);
    frameCounter = 1;
    textObject = new CanvasText("", new number2(10, 25));
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
        this.canvasProperties.offset = this.GetOffsetScaled();
        this.canvasProperties.scale = this.scale;
    }
    GetCanvasProperties() {
        return this.canvasProperties;
    }
    SetParticleData(data) {
        this.objects = data;
    }
    Reset() {
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
    GetOffsetScaled() {
        return this.offset.ScalarDivide(this.scale);
    }
    SetOffsetScaled(offset) {
        this.offset = offset.ScalarMultiply(this.scale);
    }
    GetOffsetPx() {
        return this.offset;
    }
    SetOffsetPx(offset) {
        this.offset = offset;
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
    offset;
    scale;
    ctx;
    Line(pointA, pointB) {
        this.ctx.moveTo(pointA.x, pointA.y);
        this.ctx.lineTo(pointB.x, pointB.y);
    }
    Circle(center, radius) {
        this.ctx.arc(center.x, center.y, radius, 0, 360);
    }
    TransformObjectToCanvas(objectCoordinates) {
        return new number2(this.TransformObjectToCanvasX(objectCoordinates.x), this.TransformObjectToCanvasY(objectCoordinates.y));
    }
    TransformObjectToCanvasX(x) {
        return this.scale * (this.width / 2 + (x + this.offset.x));
    }
    TransformObjectToCanvasY(y) {
        return this.scale * (this.height / 2 - (y + this.offset.y));
    }
    TransformCanvasToObject(canvasCoordinates) {
        return new number2(this.TransformCanvasToObjectX(canvasCoordinates.x), this.TransformCanvasToObjectY(canvasCoordinates.y));
    }
    TransformCanvasToObjectX(x) {
        return x / this.scale - this.width / 2 - this.offset.x;
    }
    TransformCanvasToObjectY(y) {
        return -y / this.scale + this.height / 2 - this.offset.y;
    }
    TransformCanvasToObjectVector(canvasCoordinates) {
        return new number2(canvasCoordinates.x / this.scale, canvasCoordinates.y / this.scale);
    }
    LineObjectToCanvas(pA, pB) {
        this.Line(this.TransformObjectToCanvas(pA), this.TransformObjectToCanvas(pB));
    }
    CircleObjectToCanvas(center, radius) {
        this.Circle(this.TransformObjectToCanvas(center), this.scale * (radius));
    }
}
class CanvasCircle {
    position;
    radius;
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }
    RenderObject(canvasProperties) {
        canvasProperties.CircleObjectToCanvas(this.position, this.radius);
    }
    RenderUI(canvasProperties) {
        canvasProperties.Circle(this.position, this.radius);
    }
}
class CanvasText {
    text;
    position;
    constructor(text, position) {
        this.text = text;
        this.position = position;
    }
    RenderObject(canvasProperties) {
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font = "20px Calibri";
        canvasProperties.ctx.fillText(this.text, canvasProperties.TransformObjectToCanvasX(this.position.x), canvasProperties.TransformObjectToCanvasY(this.position.y));
    }
    RenderUI(canvasProperties) {
        canvasProperties.ctx.fillStyle = "#000000";
        canvasProperties.ctx.font = "20px Calibri";
        canvasProperties.ctx.fillText(this.text, this.position.x, this.position.y);
    }
    SetText(text) {
        this.text = text;
    }
}
class CanvasVector {
    origin;
    direction;
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
    RenderObject(canvasProperties) {
        canvasProperties.LineObjectToCanvas(this.origin, this.origin.Add(this.direction));
    }
    RenderUI(canvasProperties) {
        canvasProperties.Line(this.origin, this.origin.Add(this.direction));
    }
}
class CanvasLine {
    origin;
    point2;
    constructor(origin, point2) {
        this.origin = origin;
        this.point2 = point2;
    }
    RenderObject(canvasProperties) {
        canvasProperties.LineObjectToCanvas(this.origin, this.point2);
    }
    RenderUI(canvasProperties) {
        canvasProperties.Line(this.origin, this.point2);
    }
}
//# sourceMappingURL=canvas.js.map