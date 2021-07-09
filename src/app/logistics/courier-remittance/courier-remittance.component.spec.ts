import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierRemittanceComponent } from './courier-remittance.component';

describe('CourierRemittanceComponent', () => {
  let component: CourierRemittanceComponent;
  let fixture: ComponentFixture<CourierRemittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierRemittanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierRemittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
