import { Component, OnInit } from '@angular/core';
import { Square } from '../shared/squareModele';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  squares:Square[];
  constructor() { }
  
  ngOnInit(): void {

  }
  initialiseGrid(){
    
  }

}
