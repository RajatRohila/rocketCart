import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierPriorityComponent } from './courier-priority.component';

describe('CourierPriorityComponent', () => {
  let component: CourierPriorityComponent;
  let fixture: ComponentFixture<CourierPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierPriorityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
