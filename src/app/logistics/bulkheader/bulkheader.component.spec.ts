import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkheaderComponent } from './bulkheader.component';

describe('BulkheaderComponent', () => {
  let component: BulkheaderComponent;
  let fixture: ComponentFixture<BulkheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
