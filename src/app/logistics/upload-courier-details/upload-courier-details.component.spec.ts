import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCourierDetailsComponent } from './upload-courier-details.component';

describe('UploadCourierDetailsComponent', () => {
  let component: UploadCourierDetailsComponent;
  let fixture: ComponentFixture<UploadCourierDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCourierDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCourierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
