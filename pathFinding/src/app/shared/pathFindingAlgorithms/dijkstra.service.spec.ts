import { TestBed } from '@angular/core/testing';

import { DijkstraService } from './dijkstra.service';

describe('DijkstraService', () => {
  let service: DijkstraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DijkstraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
