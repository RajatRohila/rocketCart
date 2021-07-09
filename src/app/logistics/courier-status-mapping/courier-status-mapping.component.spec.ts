import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierStatusMappingComponent } from './courier-status-mapping.component';

describe('CourierStatusMappingComponent', () => {
  let component: CourierStatusMappingComponent;
  let fixture: ComponentFixture<CourierStatusMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierStatusMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierStatusMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
