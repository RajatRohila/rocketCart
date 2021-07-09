import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadLabelsComponent } from './download-labels.component';

describe('DownloadLabelsComponent', () => {
  let component: DownloadLabelsComponent;
  let fixture: ComponentFixture<DownloadLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadLabelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
