import { Component } from '@angular/core';
import { Board } from '../shared/boardModele';
import { Square } from '../shared/squareModele';

@Component({
  selector: 'app-grille',
  templateUrl: './grille.component.html',
  styleUrls: ['./grille.component.scss'],
})
export class GrilleComponent {
  numberSquares: number;
  board: Board;
  nodes: Square[][];

  ngOnInit(): void {
    let wi = window.innerWidth;
    this.numberSquares = Math.trunc(wi / 20);
    this.board = new Board(
      window.innerWidth,
      this.numberSquares * 3,
      null,
      null,
      false,
      false,
      false,
      false,
      false,
      false
    );
    this.initialiseGrid();

    console.log(this.nodes);
    console.log('hi');
    console.log(this.numberSquares);
  }
  ngOnchange() {}
  test(node: Square) {
    console.log(` this is i=>${node.row} ,this is j =>${node.col}`);
  }
  test2() {
    console.log('click events');
  }

  initialiseGrid() {
    this.nodes = [];
    for (let i = 0; i < window.innerHeight / 30; i++) {
      this.nodes[i] = [];
      for (let j = 0; j < Math.trunc(window.innerWidth / 20); j++) {
        this.nodes[i][j] = new Square(i, j, false, false, false, false);
        if (i == 8 && j == Math.trunc(this.numberSquares / 2) - 15) {
          this.nodes[i][j].isStartingbox = true;
        }
        if (i == 8 && j == Math.trunc(this.numberSquares / 2) + 10) {
          this.nodes[i][j].isTargetBox = true;
        }
      }
    }
  }

  statusNode(node: Square): string {
    if (node.isStartingbox) {
      return 'start';
    }
    if (node.isTargetBox) {
      return 'target';
    }
    return 'normal';
  }
  eventsListener() {
    // for(let i=0;i<window.innerHeight/30;i++){
    //   for(let j=0;j<this.numberSquares-1;j++){
    //     this.nodes[i][j].
    //   }
    // }
  }
  mouseDown(node: Square) {
    if (node.isStartingbox ) {
      this.board.mouseDown = true;
      this.board.currentNode = node;
      this.board.isSelectedNodeStart=true;
      console.log(`this is the MOUSE DOWN ${node.row} ${node.col}`);
    }
    if(node.isTargetBox){
      this.board.mouseDown = true;
      this.board.currentNode = node;
      this.board.isSelectedNodeEnd=true;
    }
  }
  mouseLeave(node: Square) {
    if (this.board.mouseDown && this.board.isSelectedNodeStart) {
      node.isStartingbox = false;
      console.log(`this is the MOUSE LEAVE ${node.row} ${node.col}`);
    }
    if(this.board.mouseDown && this.board.isSelectedNodeEnd){
      node.isTargetBox=false;
    }
  }
  mouseEnter(node: Square) {
    if (this.board.mouseDown && this.board.isSelectedNodeStart) {
      this.board.mouseEnter = true;
      this.board.enteredNode = node;
      if(!node.isTargetBox){
        node.isStartingbox = true;
      }
      

      console.log(`this is the MOUSE ENTER ${node.row} ${node.col}`);
    }
    if(this.board.mouseDown && this.board.isSelectedNodeEnd){
      this.board.mouseEnter = true;
      this.board.enteredNode = node;
      if(!node.isStartingbox){
        node.isTargetBox = true;
      }
     
    }
  }
  mouseUp(node: Square) {
    if (this.board.mouseEnter && this.board.isSelectedNodeStart && !node.isTargetBox) {
      this.board.mouseUp = true;
      this.board.mouseEnter = false;
      this.board.mouseDown = false;
      this.board.enteredNode = node;
      if(!node.isTargetBox){
        node.isStartingbox = true;
      }

      console.log(`this is the MOUSE UP ${node.row} ${node.col}`);
    }
    if(this.board.mouseEnter && this.board.isSelectedNodeEnd &&!node.isStartingbox){
      this.board.mouseUp = true;
      this.board.mouseEnter = false;
      this.board.mouseDown = false;
      this.board.enteredNode = node;
      if(!node.isStartingbox){
        node.isTargetBox = true;
      }

      console.log(`this is the MOUSE UP ${node.row} ${node.col}`);
    }
  }
}
