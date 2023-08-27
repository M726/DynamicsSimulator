enum MouseMode {
    None,
    DragCanvas,
    DragParticle,
}

class InputManager{
    canvasEl:HTMLElement;
    canvas:Canvas;
    canvasProperties:CanvasProperties;

    ps:ParticleSystem;
    mouseParticle:Particle;
    mouseSpring:Spring;

    mouseX:number;
    mouseY:number;

    mouseMode:MouseMode;

    constructor(canvasElement:HTMLElement, canvas:Canvas, particleSystem:ParticleSystem){
        this.canvasEl = canvasElement;
        this.canvas = canvas;
        this.canvasProperties = canvas.GetCanvasProperties();
        this.ps = particleSystem;

        this.mouseParticle = new Particle(0,0,0,0,1,0);
        this.mouseSpring = new Spring(this.mouseParticle,this.mouseParticle,100,0,10);
        this.mouseParticle.LockPosition();
        particleSystem.AddForce(this.mouseSpring);

        this.mouseMode = MouseMode.None;
        
        document.addEventListener('contextmenu', e => e.preventDefault());
        canvasElement.addEventListener("mousedown", e => this.handlerCanvasMouseDown(e));
        canvasElement.addEventListener("mouseup", e => this.handlerCanvasMouseUp(e));
        canvasElement.addEventListener("mousemove", e => this.handlerCanvasMouseMove(e));

        canvasElement.addEventListener("touchstart", e=> this.handlerCanvasTouchStart(e));
        canvasElement.addEventListener("touchend", e=> this.handlerCanvasTouchEnd(e));
        canvasElement.addEventListener("touchmove", e=> this.handlerCanvasTouchMove(e));

        document.addEventListener("wheel", e => {
            this.mouseX = this.getCanvasMouseX(e);
            this.mouseY = this.getCanvasMouseY(e);
            let mousePositionObjectX = this.canvasProperties.TransformCanvasToObjectX(this.mouseX);
            let mousePositionObjectY = this.canvasProperties.TransformCanvasToObjectY(this.mouseY);
            
            let ds = 0.04*(canvas.GetScale()-1)+1;
            let newScale = canvas.GetScale()-(e.deltaY/100)*ds;
            if(newScale >1 && newScale < 10000){
                //BUG IF scroll too fast - I think that it's the event getting called twice before finishing.
                canvas.SetScale(newScale);
                canvas.UpdateCanvasProperties();
                let newMousePositionObjectX = this.canvasProperties.TransformCanvasToObjectX(this.mouseX);
                let newMousePositionObjectY = this.canvasProperties.TransformCanvasToObjectY(this.mouseY);
                canvas.SetOffsetScaled(
                    canvas.GetOffsetXScaled() - mousePositionObjectX + newMousePositionObjectX,
                    canvas.GetOffsetYScaled() - mousePositionObjectY + newMousePositionObjectY,
                )

            }
        });
    }

  
    getCanvasMouseX(e:MouseEvent):number{
        let boundingClient = this.canvas.GetBoundingClientRect();
        return (e.clientX-boundingClient.left)*(this.canvas.GetWidthPx() / boundingClient.width);
    }
    getCanvasMouseY(e:MouseEvent):number{
        let boundingClient = this.canvas.GetBoundingClientRect();
        return (e.clientY-boundingClient.top)*(this.canvas.GetHeightPx() / boundingClient.height);
    }

    handlerCanvasMouseDown(e:MouseEvent){

        if(e.button == 2 && this.mouseMode == MouseMode.DragParticle){ //Right click while dragging particle
            if(this.mouseSpring.pB.IsLocked()){
                this.mouseSpring.pB.UnlockPosition();
            }else{
                this.mouseSpring.pB.LockPosition();
            }
        }else if(e.button == 0 && this.mouseMode == MouseMode.None) { //Left click while not doing anything
            this.moveMouseSpring(e);
            this.mouseX = this.getCanvasMouseX(e);
            this.mouseY = this.getCanvasMouseY(e);
      
            let mousePositionObjectX = this.canvasProperties.TransformCanvasToObjectX(this.mouseX);
            let mousePositionObjectY = this.canvasProperties.TransformCanvasToObjectY(this.mouseY);
    
            let particle = particleSystem.FindClosestParticle(mousePositionObjectX,mousePositionObjectY);
            if(particleSystem.GetDistanceToParticle(particle,mousePositionObjectX,mousePositionObjectY) * this.canvas.GetScale() < 50){ //Decide mouse mode
                this.grabParticle(particle);
                this.mouseMode = MouseMode.DragParticle;
            }else{
                this.mouseMode = MouseMode.DragCanvas;
            }
        }
    }
    handlerCanvasMouseUp(e:MouseEvent){
        if(e.buttons != 1)
        this.releaseParticle();
    }
    handlerCanvasMouseMove(e:MouseEvent){
        if(e.buttons == 0){
            this.releaseParticle()
            return;
        }
        switch(this.mouseMode){
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
                canvas.SetOffsetPx(
                    movementVectorX + this.canvas.GetOffsetXPx(), 
                    movementVectorY + this.canvas.GetOffsetYPx());
                break;
        }
        
    }
    moveMouseSpring(e:MouseEvent){
        this.mouseSpring.pA.x = this.canvasProperties.TransformCanvasToObjectX(this.getCanvasMouseX(e));
        this.mouseSpring.pA.y = this.canvasProperties.TransformCanvasToObjectY(this.getCanvasMouseY(e));
    }

    grabParticle(p:Particle){
        this.mouseSpring.pB = p;
        this.mouseMode = MouseMode.DragParticle;
    }
    releaseParticle(){
        this.mouseSpring.pB = this.mouseParticle;
        this.mouseMode = MouseMode.None;
    }
    

    getCanvasTouchX(e:TouchEvent):number{
        let boundingClient = this.canvas.GetBoundingClientRect();
        return (e.touches[0].clientX-boundingClient.left)*(this.canvas.GetWidthPx() / boundingClient.width);
    }
    getCanvasTouchY(e:TouchEvent):number{
        let boundingClient = this.canvas.GetBoundingClientRect();
        return (e.touches[0].clientY-boundingClient.top)*(this.canvas.GetHeightPx() / boundingClient.height);
    }
    moveTouchSpring(e:TouchEvent){
        this.mouseSpring.pA.x = this.canvasProperties.TransformCanvasToObjectX(this.getCanvasTouchX(e));
        this.mouseSpring.pA.y = this.canvasProperties.TransformCanvasToObjectY(this.getCanvasTouchY(e));
    }
    handlerCanvasTouchStart(e:TouchEvent){
        e.preventDefault();
        console.log(e);
        if(this.mouseMode == MouseMode.None) { //Touch while not doing anything
            this.moveTouchSpring(e);
            this.mouseX = this.getCanvasTouchX(e);
            this.mouseY = this.getCanvasTouchY(e);
      
            let mousePositionObjectX = this.canvasProperties.TransformCanvasToObjectX(this.mouseX);
            let mousePositionObjectY = this.canvasProperties.TransformCanvasToObjectY(this.mouseY);
    
            let particle = particleSystem.FindClosestParticle(mousePositionObjectX,mousePositionObjectY);
            if(particleSystem.GetDistanceToParticle(particle,mousePositionObjectX,mousePositionObjectY) * this.canvas.GetScale() < 50){ //Decide mouse mode
                this.grabParticle(particle);
                this.mouseMode = MouseMode.DragParticle;
            }else{
                this.mouseMode = MouseMode.DragCanvas;
            }
        }
    }
    handlerCanvasTouchEnd(e:TouchEvent){
        this.releaseParticle();
    }
    handlerCanvasTouchMove(e:TouchEvent){
        if(e.touches.length == 0){
            this.releaseParticle()
            return;
        }
        switch(this.mouseMode){
            case MouseMode.DragParticle:
                this.moveTouchSpring(e);
                break;
            case MouseMode.DragCanvas:
                let nX = this.getCanvasTouchX(e);
                let nY = this.getCanvasTouchY(e);

                let movementVectorX = nX - this.mouseX;
                let movementVectorY = -nY + this.mouseY;

                this.mouseX = nX;
                this.mouseY = nY;

                //console.log(movementVectorX + ", " + movementVectorY);
                canvas.SetOffsetPx(
                    movementVectorX + this.canvas.GetOffsetXPx(), 
                    movementVectorY + this.canvas.GetOffsetYPx());
                break;
        }
        
    }
  
  }
  