import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../../services/user.service';
import { RoleService } from '../../../../services/role.service';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../../interfaces/role';



@Component({
    selector: 'app-add-new-user',
    imports: [
        CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule,
        MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule
    ],
    templateUrl: './add-new-user.component.html',
    styleUrl: './add-new-user.component.scss'
})
export class AddNewUserComponent {

  form: FormGroup;
  userId: number;
  roleArr: Role[] = [];
  constructor(private fb: FormBuilder, private userService: UserService, private roleService: RoleService, 
    private commonService: CommonService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

    ngOnInit(): void {

      this.form = this.fb.group({
        nameControl: ['', Validators.required],
        roleControl: [''],
        emailControl: ['', [Validators.required, Validators.email]],
        phoneControl: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        addressControl: [''],
        cityControl: [''],
        stateControl: [''],
        zipControl: ['']
      });   

      this.form.get('cityControl')!.disable();
      this.form.get('stateControl')!.disable();

      this.roleService.getRoles().subscribe({ 
        next: roleResponse => { 
          this.roleArr = roleResponse; 
        }, 
        error: error => { 
          console.error('Error fetching role data:', error); 
        } 
      });
      
  } 

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
    this.form.get('cityControl')!.enable();
    this.form.get('stateControl')!.enable();
  
    const accountId = localStorage.getItem('accountId'); // Retrieve accountId from local storage
    const accountCode = localStorage.getItem('accountCode'); // Retrieve accountId from local storage
    const userData = {
      accountId: accountId,
      accountcode: accountCode,
      name: this.form.value.nameControl,
      address: this.form.value.addressControl,
      city: this.form.value.cityControl,
      state: this.form.value.stateControl,
      zip: this.form.value.zipControl,
      phone: this.form.value.phoneControl,
      email: this.form.value.emailControl,
      roleId: this.form.value.roleControl || 4, // Default of Staff
      password: accountCode,
      resetPassword: false
    };
  
    const formData: FormData = new FormData();
    formData.append('userData', JSON.stringify(userData)); // Add user data
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name); // Add photo file if available
    }
  
    this.userService.addUser(formData).subscribe(
      (response: any) => {
        console.log('User Added successfully:', response?.message);
        this.router.navigate(['/']); // Navigate to location-list
      },
      error => {
        this.openSnackBar('Error Adding User:' + error.message, '', []);
        console.error('Error Adding user:', error.message);
      }
    );
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
  

  cancel(event: Event): void {
    this.router.navigate(['/']); // Navigate to location-list 
  }

  trackByRoleId(index: number, role: Role): number {
    return role.roleId;
  }

  openSnackBar(message: string, action: string, panelClasses: string[]) {
    this.snackBar.open(message, action, {
      duration: 2000, // Duration in milliseconds
      panelClass: []
    });
  }
  

  imageSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  
    // Optionally, set image preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageSrc = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  

}


