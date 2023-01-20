import { Injectable } from '@angular/core';
import { Board } from '../boardModele';
import { Square } from '../squareModele';

@Injectable({
  providedIn: 'root'
})
export class DijkstraService {
  queue: Square[];
  currentBox: Square;
  constructor( public startingBox: Square, public targetBox: Square,public board:Board) { }
  dijkstraAlgorithm() {
    this.queue.push(this.startingBox);
    this.startingBox.queued=true;
    if (this.queue.length > 0) {
      this.currentBox = this.queue.shift();
      if (this.currentBox == this.targetBox) {
          // this.searching = false;
          while(this.currentBox.prior != this.startingBox){
            this.board.path.push(this.currentBox);
            this.currentBox = this.currentBox.prior;

          }
      }
      else {
        this.currentBox.neighbours.forEach(neighbour => {
          if(!neighbour.queued && !neighbour.isWall){
            neighbour.queued = true;
            neighbour.prior = this.currentBox;
            this.queue.push(neighbour);
          }

        });
      }
    }
    return this.board.path;
  }

}
