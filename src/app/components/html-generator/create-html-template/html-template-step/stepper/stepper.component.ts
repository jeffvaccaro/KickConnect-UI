import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  standalone: true,
  styleUrls: []
})
export class StepperComponent {
  @Input() message: string;
}
