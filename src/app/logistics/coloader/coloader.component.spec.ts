import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoaderComponent } from './coloader.component';

describe('ColoaderComponent', () => {
  let component: ColoaderComponent;
  let fixture: ComponentFixture<ColoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
