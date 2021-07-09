import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingStatusMappingComponent } from './pending-status-mapping.component';

describe('PendingStatusMappingComponent', () => {
  let component: PendingStatusMappingComponent;
  let fixture: ComponentFixture<PendingStatusMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingStatusMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingStatusMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
