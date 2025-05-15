import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.css']
})
export class StepIndicatorComponent {
  @Input() steps: string[] = ['Issue Selection', 'Issue Description', 'Personal Details'];
  @Input() currentStep: number = 1;
}
