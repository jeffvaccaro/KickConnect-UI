import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../../../../services/skill.service';
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
    selector: 'app-edit-skill',
    imports: [
        CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule,
        MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule
    ],
    templateUrl: './edit-skill.component.html',
    styleUrl: './edit-skill.component.scss'
})
export class EditSkillComponent implements OnInit {
  form: FormGroup;
  skillId: number;


  constructor(private fb: FormBuilder, private skillService: SkillService, private snackBarService: SnackbarService, 
   private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Get the skillId from the route parameters
    this.route.params.subscribe(params => {
      this.skillId = +params['skillId']; // Assuming 'id' is the route parameter name
      this.loadSkillData(this.skillId);
    });

    this.form = this.fb.group({
      nameControl: ['', Validators.required],
      descriptionControl: ['', [Validators.required]]
    });

  }

  loadSkillData(skillId: number): void {
    this.skillService.getSkillsById(skillId).subscribe({
      next: response => {
        console.log(response,'getskillsbyid');
        this.form.patchValue({
          nameControl: response.skillName,
          descriptionControl: response.skillDescription
        });
      },
      error: error => {
        this.snackBarService.openSnackBar('Error fetching Skill data:' + error.message, '',  []);
      }
    });
  }
  
  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
    //console.log('location form info', this.form.value); // Log the form values
  

    let skillData = {
      skillName: this.form.value.nameControl,
      skillDescription: this.form.value.descriptionControl
    };
  
    //console.log('locationData:', locationData); // Log the data being sent to the server
  
    // Call the updateLocation method and pass the form values along with accountId
    this.skillService.updateSkill(this.skillId, skillData).subscribe({
      next: response => {
        this.router.navigate(['/app-skill-list']); 
      },
      error: error => {
        this.snackBarService.openSnackBar('Error fetching Skill:' + error.message, '',  []);
      }
    });
  }
  
  cancel(event: Event): void {
    this.router.navigate(['/app-skill-list']); // Navigate to skill-list 
  }
}
