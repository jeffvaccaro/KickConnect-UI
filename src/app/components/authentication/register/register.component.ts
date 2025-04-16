import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Role } from '../../../interfaces/role';
import { UserService } from '../../../services/user.service';
import { RoleService } from '../../../services/role.service';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    imports: [CommonModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSelectModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    form: FormGroup;
    roleArr: Role[] = []; // Define the type of roleArr  

    hide = true;

    constructor(
        public themeService: CustomizerSettingsService, private fb: FormBuilder, private userService: UserService, private roleService: RoleService, 
        private commonService: CommonService
    ) {}

    
  ngOnInit(): void {
    // console.log('RegisterComponent initialized');
    this.form = this.fb.group({
        nameControl: ['', Validators.required],
        roleControl: [''],
        emailControl: ['', [Validators.required, Validators.email]],
        phoneControl: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        addressControl: [''],
        cityControl: [''],
        stateControl: [''],
        zipControl: [''],
        isActiveControl: [true]
      });   
  }

  trackByRoleId(index: number, role: Role): number {
    return role.roleId;
  }

  getCityStateInfo(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const zipCodePattern = /^\d{5}$/;
  
    if (zipCodePattern.test(input)) {
      const zipCode = Number(input);
      this.commonService.getCityState(zipCode).subscribe({
        next: response => {
          console.log('City/State Info:', response); // Log the response to verify the data structure
          this.form.patchValue({
            cityControl: response.city,
            stateControl: response.state_code
          });
          console.log('Form values after setting city/state:', this.form.value); // Log form values after setting city/state
        },
        error: error => {
          console.error('Error fetching City/State Info:', error);
        }
      });
    }
  }
}