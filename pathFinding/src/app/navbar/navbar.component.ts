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
  typeAlgorithm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dijkstraService: DijkstraService
  ) {
    this.initAlgoForm();
  }

  ngOnInit(): void {
    this.initAlgoForm();
  }
  ngDoCheck() {
    this.chosenAlgoName();
  }
  initAlgoForm() {
    this.typeAlgorithm = this.fb.group({
      algo: '',
    });
  }

  choseAlgorithme() {
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
    }
  }
  addPerson() {
    this.dijkstraService.isPerson = true;
  }
  chosenAlgoName() {
    this.dijkstraService.chosenAlgo = this.typeAlgorithm.value.algo;
  }
}
