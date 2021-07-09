import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomasticRateCardComponent } from './domastic-rate-card.component';

describe('DomasticRateCardComponent', () => {
  let component: DomasticRateCardComponent;
  let fixture: ComponentFixture<DomasticRateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomasticRateCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomasticRateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
