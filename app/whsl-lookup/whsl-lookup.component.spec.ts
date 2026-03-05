import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfnoLookupComponent } from './mfno-lookup.component';

describe('MfnoLookupComponent', () => {
  let component: MfnoLookupComponent;
  let fixture: ComponentFixture<MfnoLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfnoLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MfnoLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
