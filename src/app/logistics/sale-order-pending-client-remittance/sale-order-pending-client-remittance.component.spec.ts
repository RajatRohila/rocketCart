import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderPendingClientRemittanceComponent } from './sale-order-pending-client-remittance.component';

describe('SaleOrderPendingClientRemittanceComponent', () => {
  let component: SaleOrderPendingClientRemittanceComponent;
  let fixture: ComponentFixture<SaleOrderPendingClientRemittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOrderPendingClientRemittanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderPendingClientRemittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
