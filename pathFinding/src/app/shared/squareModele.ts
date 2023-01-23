export class Square{
    constructor(public row:number,public col:number,public isWall:boolean,public isStartingbox:boolean,public isTargetBox:boolean,public isBomb:boolean,public isNormal:boolean,public neighbours:Square[],public visited:boolean,public queued:boolean,public prior:Square,public isPath:boolean,public f:number,public g:number,public h:number){}
    setNeighbours(nodes:Square[][]){
       if(this.row>0){
         this.neighbours.push(nodes[this.row-1][this.col]);
       }
       if(this.row<nodes.length-1){
        this.neighbours.push(nodes[this.row+1][this.col]);
      }
      if(this.col>0){
        this.neighbours.push(nodes[this.row][this.col-1]);
      }
      if(this.col<nodes[0].length-1){
        this.neighbours.push(nodes[this.row][this.col+1]);
      }
    }
}