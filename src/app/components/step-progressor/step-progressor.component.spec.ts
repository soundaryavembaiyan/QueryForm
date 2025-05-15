import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepProgressorComponent } from './step-progressor.component';

describe('StepProgressorComponent', () => {
  let component: StepProgressorComponent;
  let fixture: ComponentFixture<StepProgressorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepProgressorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepProgressorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
