import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanoLookupComponent } from './bano-lookup.component';

describe('BanoLookupComponent', () => {
  let component: BanoLookupComponent;
  let fixture: ComponentFixture<BanoLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanoLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanoLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
