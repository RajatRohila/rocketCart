import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientWalletComponent } from './view-client-wallet.component';

describe('ViewClientWalletComponent', () => {
  let component: ViewClientWalletComponent;
  let fixture: ComponentFixture<ViewClientWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewClientWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClientWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
