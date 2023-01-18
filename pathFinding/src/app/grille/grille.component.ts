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
    this.board  = new Board(window.innerWidth,this.numberSquares*3,null,null,false,false,false,false);
    this.initialiseGrid();
    
    console.log(this.nodes);
    console.log("hi");
    console.log(this.numberSquares);
  }
  ngOnchange(){

  }
  test(node:Square){
    console.log(` this is i=>${node.row} ,this is j =>${node.col}`);
  }
  test2(){
    console.log("click events");
  }

  initialiseGrid(){
    this.nodes = [];
    for(let i=0;i<window.innerHeight/30;i++){
      this.nodes[i] = [];
      for(let j=0;j<Math.trunc(window.innerWidth/20);j++){
        this.nodes[i][j] = new Square(i,j,false,false,false,false);
        if(i==8 && j== Math.trunc(this.numberSquares/2)-15){
          this.nodes[i][j].isStartingbox=true;
        }
        if(i==8&& j== Math.trunc(this.numberSquares/2)+10){
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
  eventsListener(){
    // for(let i=0;i<window.innerHeight/30;i++){
    //   for(let j=0;j<this.numberSquares-1;j++){
    //     this.nodes[i][j].
    //   }
    // }
  }
  mouseDown(node:Square){
    this.board.mouseDown = true;
    this.board.currentNode=node;
    console.log(`this is the MOUSE DOWN ${node.row} ${node.col}`);
  }
  mouseEnter(node:Square){
    if(this.board.mouseDown){
      this.board.mouseEnter  = true;
      this.board.enteredNode = node;
      console.log(`this is the MOUSE ENTER ${node.row} ${node.col}`);
    }
  }
  mouseUp(node:Square){
    if(this.board.mouseEnter){
      this.board.mouseUp = true;
      this.board.mouseEnter=false;
      this.board.mouseDown=false;
      this.board.enteredNode = node;
      let element = document.getElementById(`${this.board.enteredNode.row}-${this.board.enteredNode.col}`).parentElement
      console.log(element);
      element.style.backgroundColor ='red';
      console.log(`this is the MOUSE UP ${node.row} ${node.col}`);
    }
  }
}
