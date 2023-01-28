import { Square } from "./squareModele";

export class Particle{
    position:Square;
    bestPosition:Square;
    globalBest:Square;
    velocity:Velocity;
    c1:number=2;
    c2:number=2;
    constructor(public nodeStart:Square,public nodeTarget:Square){
        this.position = nodeStart;
        this.bestPosition = nodeStart;
        this.globalBest = nodeStart;
        this.nodeTarget = nodeTarget;
        this.nodeStart = nodeStart;
        this.velocity = new Velocity(nodeStart.row,nodeStart.col);
    }
    move(){
        this.velocity = this.velocity.add(this.bestPosition.subtract(this.position).multiply(this.c1*Math.random()));
        console.log("velocity",this.velocity);
        this.velocity = this.velocity.add(this.globalBest.subtract(this.position).multiply(this.c2*Math.random()));
         this.position = this.position.add(this.velocity);
        
                // check if the path found by the particle is shorter than its personal best path
                if (this.position.distance(this.nodeTarget) < this.bestPosition.distance(this.nodeTarget)) {
                    this.bestPosition = this.position;
                }
        


    }
} 

export class Velocity{
    add(square:Square): Velocity {
        return new Velocity(this.row+square.row,this.col+square.col);
    }

    constructor(public row:number,public col:number){}
}