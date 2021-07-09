import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceableCouriersComponent } from './serviceable-couriers.component';

describe('ServiceableCouriersComponent', () => {
  let component: ServiceableCouriersComponent;
  let fixture: ComponentFixture<ServiceableCouriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceableCouriersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceableCouriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
