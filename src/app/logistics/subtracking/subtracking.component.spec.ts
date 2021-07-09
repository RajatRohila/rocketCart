import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtrackingComponent } from './subtracking.component';

describe('SubtrackingComponent', () => {
  let component: SubtrackingComponent;
  let fixture: ComponentFixture<SubtrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
