import { Component, OnInit } from '@angular/core';

import { SnackbarService } from '../../../../services/snackbar.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkillService } from '../../../../services/skill.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-add-new-skill',
    imports: [
        CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule,
        MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule
    ],
    templateUrl: './add-new-skill.component.html',
    styleUrl: './add-new-skill.component.scss'
})
export class AddNewSkillComponent implements OnInit {
  form: FormGroup;

  constructor(private router: Router, private skillService: SkillService,  private snackBarService: SnackbarService,) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl({ value: '', disabled: false,}, Validators.required),
      description: new FormControl({ value: '', disabled: false,}, Validators.required)
    });
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
  
    const skillData = {
      skillName: this.form.value.name,
      skillDescription: this.form.value.description
    };
  
    // Call the addSkill method and pass the observer object
    this.skillService.addSkill(skillData).subscribe({
      next: response => {
        this.router.navigate(['/app-skill-list']); 
      },
      error: error => {
        this.snackBarService.openSnackBar('Error adding skill: ' + error.message, '', []);
      },
      complete: () => {
        // Optionally, handle completion
        console.log('Skill addition complete');
      }
    });
  }
  

  cancel(event: Event): void {
    this.router.navigate(['/app-skill-list']); // Navigate to location-list 
  }
}