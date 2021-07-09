import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCourierWarehouseMappingComponent } from './client-courier-warehouse-mapping.component';

describe('ClientCourierWarehouseMappingComponent', () => {
  let component: ClientCourierWarehouseMappingComponent;
  let fixture: ComponentFixture<ClientCourierWarehouseMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCourierWarehouseMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCourierWarehouseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
