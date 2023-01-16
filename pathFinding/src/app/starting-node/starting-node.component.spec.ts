import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingNodeComponent } from './starting-node.component';

describe('StartingNodeComponent', () => {
  let component: StartingNodeComponent;
  let fixture: ComponentFixture<StartingNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartingNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartingNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
