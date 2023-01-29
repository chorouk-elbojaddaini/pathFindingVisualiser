import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
import { DijkstraService } from '../shared/pathFindingAlgorithms/dijkstra.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  chosenAlgo: string;
  selectedMaze:string ;
  typeAlgorithm: FormGroup;
  typeMazePattern:FormGroup;
  valueVisualise:string = 'Visualise';

  constructor(
    private fb: FormBuilder,
    public dijkstraService: DijkstraService
  ) {
    this.initAlgoForm();
  }

  ngOnInit(): void {
    this.initAlgoForm();
    this.initMazePattern();
    
  }
  ngDoCheck() {
    this.chosenMaze();
    if(this.typeAlgorithm.value.algo != this.valueVisualise){
      this.chosenAlgoName();
    let btnVisualise = document.getElementById("button");
      this.valueVisualise = this.dijkstraService.chosenAlgo;
      btnVisualise.innerHTML = 'visualise ' + this.dijkstraService.chosenAlgo;

    }
    
  }
  initAlgoForm() {
    this.typeAlgorithm = this.fb.group({
      algo: '',
    });
  }
  initMazePattern(){
    this.typeMazePattern = this.fb.group({
      mazePattern : ''
    })
  }

  choseAlgorithme() {
    let btnVisualise = document.getElementById("button");
    switch (this.dijkstraService.chosenAlgo) {
      case 'A* Search':
        this.dijkstraService.algo = 'astar';
        break;
      case "Dijkstra's Algorithm":
        this.dijkstraService.algo = 'dijkstra';

        break;
      case "Greedy Best-first Search":
        this.dijkstraService.algo = 'greedy'
        break;
      case "Breadth-first Search":
       this.dijkstraService.algo = 'breadth'
       break;
      case "Swarm Algorithm":
        this.dijkstraService.algo = 'swarm'
        break;
       case "Depth-first Search":
        this.dijkstraService.algo = 'depth'
        break;
        default:  
      btnVisualise.innerHTML = 'pick an algorithm';
    }
  }
  addPerson() {
    this.dijkstraService.isPerson = !this.dijkstraService.isPerson;
    this.dijkstraService.ngDoCheckRunOnce = false;

  }
  chosenAlgoName() {
    this.dijkstraService.chosenAlgo = this.typeAlgorithm.value.algo;
    console.log('algochosen',this.dijkstraService.chosenAlgo);
  
  }
  chosenMaze(){
   
    this.dijkstraService.mazePattern = this.typeMazePattern.value.mazePattern;
  }

  clearBoard(){
    this.dijkstraService.clearBoard = true;
  }
  clearWalls(){
    this.dijkstraService.reinitialiseWall();
  }
  clearPath(){
    this.dijkstraService.clearPath = true;
  }
  visualisebtn(){
    let btnVisualise = document.getElementById("button");
    console.log("visualise btn");
     
      btnVisualise.innerHTML = 'pick an algorithm';

     
  }
}
