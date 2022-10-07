interface Vector{
    Length():number;
}

class number2 implements Vector{
    x :number;
    y :number;
    
    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public set(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    public toString():string{
        return `(${this.x},${this.y})`;
    }

    public Length():number{
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
}

class number3 implements Vector{
    x :number;
    y :number;
    z :number;
    
    public constructor(x: number, y: number, z:number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public set(x: number, y: number, z: number){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    public Length():number{
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
    }
}

function dotn2(a:number2, b:number2) :number{
    return a.x*b.x+a.y*b.y;
}
function dotn3(a:number3, b:number3): number{
    return a.x*b.x+a.y*b.y+a.z*b.z;
}
function addn2(a:number2, b:number2) :number2{
    return new number2(a.x+b.x, a.y+b.y);
}
function addn3(a:number3, b:number3) :number3{
    return new number3(a.x+b.x, a.y+b.y, a.z+b.z);
}