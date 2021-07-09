import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbSeriesComponent } from './awb-series.component';

describe('AwbSeriesComponent', () => {
  let component: AwbSeriesComponent;
  let fixture: ComponentFixture<AwbSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwbSeriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
