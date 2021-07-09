import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPushErrorAndSuccessLogComponent } from './data-push-error-and-success-log.component';

describe('DataPushErrorAndSuccessLogComponent', () => {
  let component: DataPushErrorAndSuccessLogComponent;
  let fixture: ComponentFixture<DataPushErrorAndSuccessLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPushErrorAndSuccessLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPushErrorAndSuccessLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
