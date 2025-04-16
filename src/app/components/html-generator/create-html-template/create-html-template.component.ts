import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { HtmlStepperComponent } from './html-steppers.component';
import { HtmlGeneratorService } from '../../../services/html-generator.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-create-html-template',
    standalone: true,
    imports: [
    CommonModule,
    MatCardModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    MatTabsModule,
    HtmlStepperComponent,
    HttpClientModule // Include HttpClientModule
],
    templateUrl: './create-html-template.component.html',
    styleUrls: ['./create-html-template.component.scss']
})
export class CreateHtmlTemplateComponent implements OnInit {

  generatedHtml: string = ''; 
  iframeSrc: SafeResourceUrl;
  sections = [
    { sectionHeader: 'Section 1', sectionName: 'section1' },
    { sectionHeader: 'Section 2', sectionName: 'section2' },
    { sectionHeader: 'Section 3', sectionName: 'section3' },
    { sectionHeader: 'Section 4', sectionName: 'section4' },
    { sectionHeader: 'Section 5', sectionName: 'section5' }
  ];
  sectionHtmls: { [key: string]: string } = {}; // Store HTML for each section

  whiteLogoBase64: string;
  blackLogoBase64: string;

  constructor(private sanitizer: DomSanitizer, private htmlGeneratorService: HtmlGeneratorService) {}

  ngOnInit(): void { 
    this.loadImages().then(() => {
      // Images are loaded, update the HTML
      this.updateCombinedHtml();
    }).catch(error => {
      console.error('Error loading images:', error);
    });
  }

  loadImages(): Promise<void> {
    return Promise.all([
        lastValueFrom(
            this.htmlGeneratorService.getFileAsBlob('../../../../assets/img/kickConnect_logo2_white_50.png')
                .pipe(
                    switchMap(blob => blob ? this.htmlGeneratorService.convertToBase64(blob) : Promise.reject('Failed to fetch white logo'))
                )
        ).then(base64 => this.whiteLogoBase64 = base64),

        lastValueFrom(
            this.htmlGeneratorService.getFileAsBlob('../../../../assets/img/kickConnect_logo2_black_50.png')
                .pipe(
                    switchMap(blob => blob ? this.htmlGeneratorService.convertToBase64(blob) : Promise.reject('Failed to fetch black logo'))
                )
        ).then(base64 => this.blackLogoBase64 = base64)
    ]).then(() => {}).catch(error => {
        console.error('Error loading one or more images:', error);
    });
  }

  changeColors(bgColor: string, fgColor: string): void {
    this.updateCombinedHtml(bgColor, fgColor);
  }

  appendSectionHtml(event: { sectionName: string, html: string }): void {
    this.sectionHtmls[event.sectionName] = event.html; // Update HTML for the specific section
    this.updateCombinedHtml();
  }

  updateCombinedHtml(bgColor?: string, fgColor?: string): void {
    bgColor = bgColor ?? '#000';
    fgColor = fgColor ?? 'white';

    console.log('whiteLogoBase64', this.whiteLogoBase64);
    console.log('blackLogoBase64', this.blackLogoBase64);

    const sectionsContent = Object.values(this.sectionHtmls).join(''); // Combine HTML from all sections

    const logoSrc = (bgColor === '#000') ? this.whiteLogoBase64 : this.blackLogoBase64;

    console.log(logoSrc);
    // Wrap combined sections content with the full HTML structure
    this.generatedHtml = `
      <!DOCTYPE html>
      <html class="no-js" lang="en">
      <head>
        <meta charset="utf-8">
        <title>kickConnect-HTML-TEMPLATE-1</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <base href="http://localhost:4200/HTML-TEMPLATE-1/">
        <link rel="stylesheet" href="/public/htmlgencode/css/base.css">
        <link rel="stylesheet" href="/public/htmlgencode/css/main.css">        
        <link rel="shortcut icon" href="/public/favicon.ico" type="image/x-icon">
        <link rel="icon" href="/public/favicon.ico" type="image/x-icon">
      </head>
      <body>
        <header id="header" class="row">
          <div class="header-logo">
            <img src="${logoSrc}">
          </div>
          <nav id="header-nav-wrap">
            <ul class="header-main-nav">
              ${this.generateMenuItemsHtml()} 
            </ul>
          </nav>
          <a class="header-menu-toggle" href="#"><span>Menu</span></a>
        </header><br/><br/><br/><br/>
        ${sectionsContent}
      </body>
      <script>
        document.documentElement.style.setProperty('--bg-color', '${bgColor}');
        document.documentElement.style.setProperty('--fg-color', '${fgColor}');
      </script>
      </html>`;

    this.updateIframeSrc();
  }
    // this.columnColor = 'white';
    // this.col1HeaderText = 'Column 1';
    // this.col1TextBlock = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.';
    // this.col2HeaderText = 'Column 2';
    // this.col2TextBlock = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.';
    // this.col3HeaderText = 'Column 3';
    // this.col3TextBlock = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.';
    // this.currentSection = 1;
    // this.columnCount = 1;

  generateMenuItemsHtml(): string {
    return this.sections.map((section, index) => `<li><a class="smoothscroll" href="#${section.sectionName}" title="Section ${index + 1}">Section ${index + 1}</a></li>`).join('');
  }

  updateIframeSrc(): void {
    const blob = new Blob([this.generatedHtml], { type: 'text/html' });
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
  }
}
