import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeplManifestComponent } from './threepl-manifest.component';

describe('ThreeplManifestComponent', () => {
  let component: ThreeplManifestComponent;
  let fixture: ComponentFixture<ThreeplManifestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeplManifestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeplManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
