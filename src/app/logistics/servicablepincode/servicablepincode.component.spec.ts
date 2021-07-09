import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicablepincodeComponent } from './servicablepincode.component';

describe('ServicablepincodeComponent', () => {
  let component: ServicablepincodeComponent;
  let fixture: ComponentFixture<ServicablepincodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicablepincodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicablepincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
