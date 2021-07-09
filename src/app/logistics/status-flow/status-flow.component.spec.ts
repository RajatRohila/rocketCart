import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusFlowComponent } from './status-flow.component';

describe('StatusFlowComponent', () => {
  let component: StatusFlowComponent;
  let fixture: ComponentFixture<StatusFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
