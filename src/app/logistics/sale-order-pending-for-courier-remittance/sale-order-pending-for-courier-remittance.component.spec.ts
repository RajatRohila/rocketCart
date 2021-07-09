import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderPendingForCourierRemittanceComponent } from './sale-order-pending-for-courier-remittance.component';

describe('SaleOrderPendingForCourierRemittanceComponent', () => {
  let component: SaleOrderPendingForCourierRemittanceComponent;
  let fixture: ComponentFixture<SaleOrderPendingForCourierRemittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOrderPendingForCourierRemittanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderPendingForCourierRemittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
