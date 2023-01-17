import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-big-carre',
  templateUrl: './big-carre.component.html',
  styleUrls: ['./big-carre.component.scss']
})
export class BigCarreComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  drop(event: CdkDragDrop<string[]>) {
    
  }

}
