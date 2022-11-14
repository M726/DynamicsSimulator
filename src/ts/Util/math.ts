

function dot(x1:number, y1:number, x2:number, y2:number){
    return x1*x2+y1*y2;
}

function distanceParticles(pA:Particle, pB:Particle){
    return distanceBetweenPoints(pA.x,pA.y,pB.x,pB.y);
}
function distanceBetweenPoints(x1:number, y1:number, x2:number, y2:number){
    return distance(x2-x1,y2-y1);
}
function distance(x:number, y:number){
    return Math.sqrt(x*x+y*y)
}

function rand(){
    return Math.random();
}
function randRange(min:number,max:number){
    return Math.random()*(max-min)+min;
}

 