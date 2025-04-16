import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoleService } from '../../../../services/role.service';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
    selector: 'app-add-new-role',
    imports: [
        CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule,
        MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule
    ],
    templateUrl: './add-new-role.component.html',
    styleUrl: './add-new-role.component.scss'
})
export class AddNewRoleComponent implements OnInit {
  form: FormGroup;

  constructor(private http: HttpClient, private router: Router, private roleService: RoleService,  private snackBarService: SnackbarService,) {}

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
  
    const roleData = {
      roleName: this.form.value.name,
      roleDescription: this.form.value.description
    };
  
    console.log('roleData:', roleData); // Log the data being sent to the server
  
    // Call the addRole method and pass the observer object
    this.roleService.addRole(roleData).subscribe({
      next: response => {
        this.router.navigate(['/app-role-list']); // Navigate to role-list 
      },
      error: error => {
        this.snackBarService.openSnackBar('Error adding role: ' + error.message, '', []);
      },
      complete: () => {
        console.log('Role addition complete');
      }
    });
  }
  

  cancel(event: Event): void {
    this.router.navigate(['/app-role-list']); // Navigate to location-list 
  }
}
