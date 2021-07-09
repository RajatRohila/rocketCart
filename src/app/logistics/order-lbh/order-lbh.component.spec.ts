import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLBHComponent } from './order-lbh.component';

describe('OrderLBHComponent', () => {
  let component: OrderLBHComponent;
  let fixture: ComponentFixture<OrderLBHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderLBHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLBHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
