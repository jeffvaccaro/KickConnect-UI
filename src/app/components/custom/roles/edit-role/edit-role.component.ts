import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../../../services/role.service';
import { SnackbarService } from '../../../../services/snackbar.service';
@Component({
    selector: 'app-edit-role',
    imports: [
        CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule,
        MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule
    ],
    templateUrl: './edit-role.component.html',
    styleUrl: './edit-role.component.scss'
})
export class EditRoleComponent implements OnInit {
  form: FormGroup;
  roleId: number;


  constructor(private fb: FormBuilder, private roleService: RoleService, private snackBarService: SnackbarService, private commonService: CommonService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Get the roleId from the route parameters
    this.route.params.subscribe(params => {
      this.roleId = +params['roleId']; // Assuming 'id' is the route parameter name
      this.loadRoleData(this.roleId);
    });

    this.form = this.fb.group({
      nameControl: ['', Validators.required],
      descriptionControl: ['', [Validators.required]]
    });

  }

  loadRoleData(roleId: number): void {
    this.roleService.getRolesById(roleId).subscribe({
      next: response => {
        console.log(response,'getrolesbyid');
        this.form.patchValue({
          nameControl: response.roleName,
          descriptionControl: response.roleDescription
        });
      },
      error: error => {
        this.snackBarService.openSnackBar('Error fetching Role data:' + error.message, '',  []);
      }
    });
  }
  
  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
    //console.log('location form info', this.form.value); // Log the form values
  

    let roleData = {
      roleName: this.form.value.nameControl,
      roleDescription: this.form.value.descriptionControl
    };
  
    //console.log('locationData:', locationData); // Log the data being sent to the server
  
    // Call the updateLocation method and pass the form values along with accountId
    this.roleService.updateRole(this.roleId, roleData).subscribe({
      next: response => {
        // console.log('Role updated successfully:', response); // Log the response
        this.router.navigate(['/app-role-list']); // Navigate to role-list 
        // console.log('Navigation triggered'); // Log navigation trigger
      },
      error: error => {
        this.snackBarService.openSnackBar('Error fetching Role:' + error.message, '',  []);
      }
    });
  }
  
  cancel(event: Event): void {
    this.router.navigate(['/app-role-list']); // Navigate to role-list 
  }
}
