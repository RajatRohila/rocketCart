import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderSingleUoploadComponent } from './sale-order-single-uopload.component';

describe('SaleOrderSingleUoploadComponent', () => {
  let component: SaleOrderSingleUoploadComponent;
  let fixture: ComponentFixture<SaleOrderSingleUoploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOrderSingleUoploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderSingleUoploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
