import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRemittanceComponent } from './client-remittance.component';

describe('ClientRemittanceComponent', () => {
  let component: ClientRemittanceComponent;
  let fixture: ComponentFixture<ClientRemittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientRemittanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRemittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
