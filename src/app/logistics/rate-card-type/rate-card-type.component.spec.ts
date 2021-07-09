import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardTypeComponent } from './rate-card-type.component';

describe('RateCardTypeComponent', () => {
  let component: RateCardTypeComponent;
  let fixture: ComponentFixture<RateCardTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateCardTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
