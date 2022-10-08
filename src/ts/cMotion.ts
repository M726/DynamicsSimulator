interface force{
    ApplyForce(p:ParticleSystem);
}

//class UnaryForce implements force{

//}

class ParticleSystem{
    dimension:number = 2; //2D
    particles:Array<Particle> = [];

    GetPhaseSpaceDimension(){
        //2*n*dimension
        return 2*this.dimension*this.particles.length;
    }

}


//p = new ParticleSystem();


class Particle{
    position:number2;
    velocity:number2;
    forceAcc:number2;
    mass:number;


}