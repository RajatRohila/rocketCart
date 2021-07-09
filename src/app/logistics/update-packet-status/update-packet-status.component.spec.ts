import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePacketStatusComponent } from './update-packet-status.component';

describe('UpdatePacketStatusComponent', () => {
  let component: UpdatePacketStatusComponent;
  let fixture: ComponentFixture<UpdatePacketStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePacketStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePacketStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
