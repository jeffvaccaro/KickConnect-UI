import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { updateHeaderText } from './html-helpers/helper-section1-columns/helper-section1-columns';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { generateSectionContent } from './html-helpers/helper-generate-html';
import { HtmlGeneratorService } from '../../../services/html-generator.service';

@Component({
    selector: 'html-steppers',
    standalone: true,
    templateUrl: './html-steppers.component.html',
    imports: [MatStepperModule, MatButtonToggleModule, MatSlideToggleModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatInputModule, MatIconModule,
        FormsModule, ReactiveFormsModule, CommonModule],
    styleUrls: ['html-steppers.component.scss']
})
export class HtmlStepperComponent implements OnInit {
  @Input() SectionHeader: string;
  @Input() SectionName: string;
  @Output() TextToUpdateIFrame = new EventEmitter<{ sectionName: string, html: string }>();

  placeholderText: string = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.';
  columnColor: string = 'white';
  tabIndex: number = 1;

  columns = [
    { headerText: 'Column 1', textBlock: this.placeholderText, image: '' }
  ]

  menuForm: FormGroup; 
  generatedHtmlText: string; 
  iframeSrc: SafeResourceUrl;

  bgImgURL: string;
  isDarkText: boolean = false;

  colBlockHTML: string;
  colBlock: string;
  col1: boolean;
  col2: boolean;
  col3: boolean;
  private colImages: string[] = [];
  private updatingColumns: boolean = false; // Flag to prevent redundant updates
  
  constructor(private fb: FormBuilder, private htmlGeneratorService: HtmlGeneratorService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void { 
    this.menuForm = this.fb.group({ menuItems: this.fb.array([]) });
    this.addMenuItem();
    
    const defaultEvent = {
      value: '1',
      source: {
        value: '1'
      }
    } as MatButtonToggleChange;

    this.updateColumns(defaultEvent);    
  }

  get menuItems(): FormArray { 
    return this.menuForm.get('menuItems') as FormArray; 
  }

  addMenuItem(): void { 
    this.menuItems.push(this.fb.group({ name: ['Home'], href: ['#Home'] })); 
  } 
  
  removeMenuItem(index: number): void { 
    this.menuItems.removeAt(index); 
  } 

  changeColors(bgColor: string, fgColor: string): void {
    //this.updateCombinedHtml(bgColor, fgColor);
  }

  switchTextColor(event: MatSlideToggleChange): void {
    this.isDarkText = event.checked;
    this.columnColor = event.checked ? 'black' : 'white';
    this.updateColBlockHTML();
  }

  onColTabChanged(event: number): void {
    this.tabIndex = event;
  }

  async addColumn(): Promise<void> {
    const newIndex = this.columns.length + 1;
    this.columns.push({
      headerText: `Column ${newIndex}`,
      textBlock: this.placeholderText,
      image: ''
    });
  }

  async removeColumn(): Promise<void> {
    if (this.columns.length > 1) {
      this.columns.pop();
    }
  }

  getDifference(colsChangedValue: number, colsCurrentValue: number): number {
    return colsChangedValue - colsCurrentValue;
  }

  async updateColumns(event: MatButtonToggleChange): Promise<void> {
    if (this.updatingColumns) return; // Prevent redundant updates
    this.updatingColumns = true;
    
    const difference = this.getDifference(Number(event.value), this.columns.length);
    const isNewValueGT = difference > 0;

    if (isNewValueGT) {
      console.log('Adding columns...');
      for (let i = 0; i < difference; i++) {
        await this.addColumn();
      }
    } else {
      console.log('Removing columns...');
      for (let i = 0; i < Math.abs(difference); i++) {
        await this.removeColumn();
      }
    }

    const result = await updateHeaderText(event, this.columnColor, this.columns);

    this.colBlockHTML = result.colBlockHTML;
    this.col1 = result.col1;
    this.col2 = result.col2;
    this.col3 = result.col3;
    this.colBlock = result.colBlock;

    this.updateIframeSrc();

    this.updatingColumns = false; // Reset flag after update
  }

  updateIframeSrc(): void {     
    this.menuItems.controls.forEach((control: AbstractControl, index: number) => {
      (control as FormGroup).get('href')?.setValue(`#section${index + 1}`);
    });

    const menuItems = this.menuForm.value.menuItems;    
    this.generatedHtmlText = this.generateSectionHtml(menuItems); 

    this.TextToUpdateIFrame.emit({ sectionName: this.SectionName, html: this.generatedHtmlText });
  }

  // Generating HTML for each section to send to the parent
  generateSectionHtml(menuItems: { name: string, href: string }[]): string { 
    if (!this.colBlockHTML || !menuItems) return '';
    return generateSectionContent(this.SectionName, this.bgImgURL, this.colBlockHTML); // Pass the current section only
  }

  onImageUpload(event: Event, section: number, type: string, colNum: number = 0): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Call the service to upload the image
      this.htmlGeneratorService.uploadBGImage(file).subscribe(
        response => {
          const imageUrl = response.url;
          if (type === "background") {
            this.bgImgURL = imageUrl;
            this.setBackground(this.bgImgURL, this.colBlock);
          } else if (type === "columns" && [2, 3].includes(colNum)) {
            this.updateColBlockImage(colNum, imageUrl);
          }
        },
        error => {
          console.error('Error uploading image:', error);
          // Handle the error, e.g., show an error message
        }
      );
    }
  }

  setBackground(img: string, styleBlock: String): void {
    this.updateIframeSrc();
  }

  updateColBlockImage(colNum: number, imageUrl: string): void {
    this.colImages[colNum] = imageUrl;
    this.updateColBlockHTML();
  }

  updateColBlockHTML(): void {
    if (this.col3) {
      const event = { value: 3 } as MatButtonToggleChange;
      this.updateColumns(event);
    } else if (this.col2) {
      const event = { value: 2 } as MatButtonToggleChange;
      this.updateColumns(event);
    } else {
      const event = { value: 1 } as MatButtonToggleChange;
      this.updateColumns(event);
    }
  }
}
