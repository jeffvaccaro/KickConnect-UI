import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { HtmlGeneratorService } from '../../../../services/html-generator.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-html-template-step',
    standalone: true,
    imports: [MatStepperModule, MatButtonToggleModule, MatSlideToggleModule, MatFormFieldModule, MatCardModule, MatTabsModule,
        FormsModule, ReactiveFormsModule
    ],
    templateUrl: './html-template-step.component.html'
})
export class HtmlTemplateStepComponent implements OnInit {
  @Input() sectionTitle: string;
  @Input() columns: number;
   
  constructor(private fb: FormBuilder, private htmlGeneratorService: HtmlGeneratorService, private sanitizer: DomSanitizer) {}
    
  ngOnInit(): void { 
    console.log('Child component initialized');
    console.log('Section title:', this.sectionTitle);
    console.log('Columns:', this.columns);
  }    
}
