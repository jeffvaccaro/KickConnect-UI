import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { RoleService } from '../../../../services/role.service';
import { Role } from '../../../../interfaces/role';
import { AccountService } from '../../../../services/account.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-new-account',
    imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule, CommonModule],
    templateUrl: './add-new-account.component.html',
    styleUrl: './add-new-account.component.scss'
})
export class AddNewAccountComponent implements OnInit {
  form: FormGroup;
  roleArr: Role[] = [];
  hide = true;

  constructor(private fb: FormBuilder, private commonService: CommonService, private roleService: RoleService, private accountService: AccountService, private router: Router){}

  ngOnInit(): void {
    this.form = this.fb.group({
      accountName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      accountEmail: ['', [Validators.required, Validators.email]],

      accountPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      phone2: ['', Validators.pattern(/^\d{10}$/)],


      accountAddress: ['', Validators.required],
      accountCity: [{ value: '', disabled: true }],
      accountState: [{ value: '', disabled: true }],
      accountZip: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.roleService.getRoles().subscribe({
      next: roleResponse => {
        this.roleArr = roleResponse;
      },
      error: error => {
        console.error('Error fetching role data:', error);
      }
    });
  }

  get accountnameControl(): FormControl {
    return this.form.get('accountName') as FormControl;
  }

  get usernameControl(): FormControl {
    return this.form.get('userName') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('accountEmail') as FormControl;
  }

  get phoneControl(): FormControl {
    return this.form.get('accountPhone') as FormControl;
  }

  get phone2Control(): FormControl {
    return this.form.get('phone2') as FormControl;
  }

  get addressControl(): FormControl {
    return this.form.get('accountAddress') as FormControl;
  }

  get cityControl(): FormControl {
    return this.form.get('accountCity') as FormControl;
  }

  get stateControl(): FormControl {
    return this.form.get('accountState') as FormControl;
  }

  get zipControl(): FormControl {
    return this.form.get('accountZip') as FormControl;
  }

  get roleControl(): FormControl {
    return this.form.get('role') as FormControl;
  }

  
  

  getCityStateInfo(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const zipCodePattern = /^\d{5}$/;

    if (zipCodePattern.test(input)) {
      const zipCode = Number(input);
      this.commonService.getCityState(zipCode).subscribe({
        next: response => {
          this.cityControl.setValue(response.city);
          this.stateControl.setValue(response.state_code);
          console.log('City/State Info:', response);
        },
        error: error => {
          console.error('Error fetching City/State Info:', error);
        }
      });
    }
  }

  trackByRoleId(index: number, role: Role): number {
    return role.roleId;
  }
  
  onSubmit(event: Event) {
    if (this.form.valid) {
      this.form.get('accountCity')!.enable();
      this.form.get('accountState')!.enable();
      const accountData = this.form.value;
      console.log('accountData:', accountData);
      this.accountService.addAccount(accountData).subscribe({
        next: response => {
          console.log('Account added successfully', response);
          this.router.navigate(['/']); // Navigate to location-list
        },
        error: error => {
          console.error('Error adding account', error);
        }
      });
    } else {
      console.error('Form is invalid');
      this.logInvalidControls();
    }
  }
  
  logInvalidControls() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      const controlErrors = control?.errors;
      if (controlErrors) {
        console.error(`Control: ${key}, Errors: `, controlErrors, `Value: `, control?.value, `Status: `, control?.status);
      }
    });
  }
  
  
  
}
