var MouseMode;
(function (MouseMode) {
    MouseMode[MouseMode["None"] = 0] = "None";
    MouseMode[MouseMode["DragCanvas"] = 1] = "DragCanvas";
    MouseMode[MouseMode["DragParticle"] = 2] = "DragParticle";
})(MouseMode || (MouseMode = {}));
class InputManager {
    canvasEl;
    canvas;
    canvasProperties;
    ps;
    mouseParticle;
    mouseSpring;
    mouseX;
    mouseY;
    mouseMode;
    constructor(canvasElement, canvas, particleSystem) {
        this.canvasEl = canvasElement;
        this.canvas = canvas;
        this.canvasProperties = canvas.GetCanvasProperties();
        this.ps = particleSystem;
        this.mouseParticle = new Particle(0, 0, 0, 0, 1, 0);
        this.mouseSpring = new Spring(this.mouseParticle, this.mouseParticle, 100, 0, 10);
        this.mouseParticle.LockPosition();
        particleSystem.AddForce(this.mouseSpring);
        this.mouseMode = MouseMode.None;
        document.addEventListener('contextmenu', e => e.preventDefault());
        canvasElement.addEventListener("mousedown", e => this.handlerCanvasMouseDown(e));
        canvasElement.addEventListener("mouseup", e => this.handlerCanvasMouseUp(e));
        canvasElement.addEventListener("mousemove", e => this.handlerCanvasMouseMove(e));
        document.addEventListener("wheel", e => {
            //console.log(-e.deltaY/100);
            let ds = 0.04 * (canvas.GetScale() - 1) + 1;
            let newScale = canvas.GetScale() - (e.deltaY / 100) * ds;
            if (newScale > 1) {
                canvas.SetScale(newScale);
            }
        });
    }
    getCanvasMouseX(e) {
        let boundingClient = this.canvas.GetBoundingClientRect();
        return (e.clientX - boundingClient.left) * (this.canvas.GetWidthPx() / boundingClient.width);
    }
    getCanvasMouseY(e) {
        let boundingClient = this.canvas.GetBoundingClientRect();
        return (e.clientY - boundingClient.top) * (this.canvas.GetHeightPx() / boundingClient.height);
    }
    handlerCanvasMouseDown(e) {
        if (e.button != 0 || this.mouseMode != MouseMode.None)
            return;
        this.moveMouseSpring(e);
        this.mouseX = this.getCanvasMouseX(e);
        this.mouseY = this.getCanvasMouseY(e);
        let mousePositionObjectX = this.canvasProperties.TransformCanvasToObjectX(this.mouseX);
        let mousePositionObjectY = this.canvasProperties.TransformCanvasToObjectY(this.mouseY);
        let particle = particleSystem.FindClosestParticle(mousePositionObjectX, mousePositionObjectY);
        if (particleSystem.GetDistanceToParticle(particle, mousePositionObjectX, mousePositionObjectY) * this.canvas.GetScale() < 50) {
            this.grabParticle(particle);
            this.mouseMode = MouseMode.DragParticle;
        }
        else {
            this.mouseMode = MouseMode.DragCanvas;
        }
    }
    handlerCanvasMouseUp(e) {
        this.releaseParticle();
    }
    handlerCanvasMouseMove(e) {
        if (e.buttons == 0) {
            this.releaseParticle();
            return;
        }
        switch (this.mouseMode) {
            case MouseMode.DragParticle:
                this.moveMouseSpring(e);
                break;
            case MouseMode.DragCanvas:
                let nX = this.getCanvasMouseX(e);
                let nY = this.getCanvasMouseY(e);
                let movementVectorX = nX - this.mouseX;
                let movementVectorY = -nY + this.mouseY;
                this.mouseX = nX;
                this.mouseY = nY;
                //console.log(movementVectorX + ", " + movementVectorY);
                canvas.SetOffsetPx(movementVectorX + this.canvas.GetOffsetXPx(), movementVectorY + this.canvas.GetOffsetYPx());
                break;
        }
    }
    moveMouseSpring(e) {
        this.mouseSpring.pA.x = this.canvasProperties.TransformCanvasToObjectX(this.getCanvasMouseX(e));
        this.mouseSpring.pA.y = this.canvasProperties.TransformCanvasToObjectY(this.getCanvasMouseY(e));
    }
    grabParticle(p) {
        this.mouseSpring.pB = p;
        this.mouseMode = MouseMode.DragParticle;
    }
    releaseParticle() {
        this.mouseSpring.pB = this.mouseParticle;
        this.mouseMode = MouseMode.None;
    }
}
//# sourceMappingURL=inputManager.js.map