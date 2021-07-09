import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFacilityComponent } from './client-facility.component';

describe('ClientFacilityComponent', () => {
  let component: ClientFacilityComponent;
  let fixture: ComponentFixture<ClientFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
