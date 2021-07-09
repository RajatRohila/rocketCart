import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientRateComponent } from './view-client-rate.component';

describe('ViewClientRateComponent', () => {
  let component: ViewClientRateComponent;
  let fixture: ComponentFixture<ViewClientRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewClientRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClientRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
