interface Vector{
    Add(a:Vector):Vector;
    Subtract(a:Vector):Vector;
    Dot(a:Vector):number;
    ScalarMultiply(a:number):Vector;
    ScalarDivide(a:number):Vector;
    Length():number;
    Normalize():Vector;
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

    public Add(a: number2): number2 {
        return new number2(this.x + a.x, this.y + a.y);
    }
    
    public Subtract(a: number2): number2 {
        return new number2(this.x - a.x, this.y - a.y);
    }
    
    public Dot(a: number2): number {
        return this.x * a.x + this.y * a.y;
    }
    
    public ScalarMultiply(a: number): number2 {
        return new number2(this.x * a, this.y * a);
    }
    
    public ScalarDivide(a: number): number2 {
        return new number2(this.x / a, this.y / a);
    }

    public Length():number{
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
    public Normalize():number2{
        return this.ScalarDivide(this.Length());
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

    public Add(a: number3): number3 {
        return new number3(this.x + a.x, this.y + a.y, this.z + a.z);
    }
    
    public Subtract(a: number3): number3 {
        return new number3(this.x - a.x, this.y - a.y, this.z - a.z);
    }
    
    public Dot(a: number3): number {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }
    
    public ScalarMultiply(a: number): number3 {
        return new number3(this.x * a, this.y * a, this.z * a);
    }
    
    public ScalarDivide(a: number): number3 {
        return new number3(this.x / a, this.y / a, this.z / a);
    }

    public Length():number{
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
    }
    public Normalize():number3{
        return this.ScalarDivide(this.Length());
    }
}

 