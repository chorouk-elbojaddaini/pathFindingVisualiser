import { Component } from '@angular/core';
import { Board } from '../shared/boardModele';
import { Square } from '../shared/squareModele';

@Component({
  selector: 'app-grille',
  templateUrl: './grille.component.html',
  styleUrls: ['./grille.component.scss']
})
export class GrilleComponent {
  numberSquares:number;
  board:Board;
  nodes:Square[][];
  
  ngOnInit(): void {
   
    let wi = window.innerWidth;
    this.numberSquares = Math.trunc(wi/20);
    this.board  = new Board(window.innerWidth,this.numberSquares*3);
    this.initialiseGrid();
    
    console.log(this.nodes);
    console.log("hi");
    console.log(this.numberSquares);
  }
  test(node:Square){
    console.log(` this is i=>${node.row} ,this is j =>${node.col}`);
  }
  initialiseGrid(){
    this.nodes = [];
    for(let i=0;i<18;i++){
      this.nodes[i] = [];
      for(let j=0;j<this.numberSquares;j++){
        this.nodes[i][j] = new Square(i,j,false,false,false,false);
        if(i==this.board.height/2 && j== this.numberSquares/2-5){
          this.nodes[i][j].isStartingbox=true;
        }
        if(i==this.board.height/2 && j== this.numberSquares/2+5){
          this.nodes[i][j].isTargetBox=true;
        }
      }
    }
  }

  statusNode(node:Square):string{
    if(node.isStartingbox){
      return "start";
    }
    if(node.isTargetBox){
      return "target";
    }
    return "normal";
  }

}
