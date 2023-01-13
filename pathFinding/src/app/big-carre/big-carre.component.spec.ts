import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigCarreComponent } from './big-carre.component';

describe('BigCarreComponent', () => {
  let component: BigCarreComponent;
  let fixture: ComponentFixture<BigCarreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigCarreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigCarreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
