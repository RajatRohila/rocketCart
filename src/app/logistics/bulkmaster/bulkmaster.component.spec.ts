import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkmasterComponent } from './bulkmaster.component';

describe('BulkmasterComponent', () => {
  let component: BulkmasterComponent;
  let fixture: ComponentFixture<BulkmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
