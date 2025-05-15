import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDropoffComponent } from './document-dropoff.component';

describe('DocumentDropoffComponent', () => {
  let component: DocumentDropoffComponent;
  let fixture: ComponentFixture<DocumentDropoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentDropoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentDropoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
