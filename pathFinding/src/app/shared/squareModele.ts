import { Velocity } from "./particleModele";

export class Square {
 
  constructor(
    public row: number,
    public col: number,
    public isWall: boolean,
    public isStartingbox: boolean,
    public isTargetBox: boolean,
    public isBomb: boolean,
    public isNormal: boolean,
    public neighbours: Square[],
    public visited: boolean,
    public visitedAnimation:boolean,
    public queued: boolean,
    public prior: Square,
    public isPath: boolean,
    public f: number,
    public g: number,
    public h: number,
    public isOpenSet: boolean,
    public isClosedSet: boolean,
    public isPerson:boolean,
    public treeWall:boolean
  ) {}
  setNeighbours(nodes: Square[][]) {
     if (this.row < nodes.length - 1) {
      this.neighbours.push(nodes[this.row + 1][this.col]);
    }
    if (this.col > 0) {
      this.neighbours.push(nodes[this.row][this.col - 1]);
    }
    if (this.row > 0) {
      this.neighbours.push(nodes[this.row - 1][this.col]);
    }
    if (this.col < nodes[0].length - 1) {
      this.neighbours.push(nodes[this.row][this.col + 1]);
    }
    
  }
  multiply(arg0: number): Square {
    return new Square(this.row*arg0,this.col*arg0,false,false,false,false,false,[],false,false,false,null,false,0,0,0,false,false,false,false);
  }
  subtract(position: Square) {
    return new Square(this.row - position.row, this.col - position.col,false,false,false,false,false,[],false,false,false,null,false,0,0,0,false,false,false,false);
  }
  add(velocity:Velocity):Square{
    return new Square(velocity.row,velocity.col,false,false,false,false,false,[],false,false,false,null,false,0,0,0,false,false,false,false);
  }
  distance(target: Square) {
   
    return Math.abs(this.row - target.row) + Math.abs(this.col - target.col);
  }
}
