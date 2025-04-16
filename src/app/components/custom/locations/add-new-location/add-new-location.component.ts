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
import { CommonService } from '../../../../services/common.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocationService } from '../../../../services/location.service';
import { LocationListComponent } from '../location-list/location-list.component';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
    selector: 'app-add-new-location',
    imports: [
        CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule,
        MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule
    ],
    templateUrl: './add-new-location.component.html',
    styleUrls: ['./add-new-location.component.scss']
})
export class AddNewLocationComponent implements OnInit {
  form: FormGroup;

  constructor(private http: HttpClient, private router: Router, private commonService: CommonService, private locationService: LocationService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl({ value: '', disabled: false,}, Validators.required),
      email: new FormControl({ value: '', disabled: false,}, [Validators.required, Validators.email]),
      phone: new FormControl({ value: '', disabled: false,}, Validators.required),
      address: new FormControl({ value: '', disabled: false,}, Validators.required),      
      city: new FormControl({ value: '', disabled: true, }),
      state: new FormControl({ value: '', disabled: true }),
      zip: new FormControl({ value: '', disabled: false,}, Validators.required),      
    });
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get phoneControl(): FormControl {
    return this.form.get('phone') as FormControl;
  }

  get addressControl(): FormControl {
    return this.form.get('address') as FormControl;
  }

  get cityControl(): FormControl {
    return this.form.get('city') as FormControl;
  }

  get stateControl(): FormControl {
    return this.form.get('state') as FormControl;
  }

  get zipControl(): FormControl {
    return this.form.get('zip') as FormControl;
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

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
    //console.warn('location info', this.form.value); // Log the form values
  
    const accountId = localStorage.getItem('accountId'); // Retrieve accountId from local storage
    const locationData = {
      accountId: accountId,
      locationName: this.form.value.name,
      locationAddress: this.form.value.address,
      locationCity: this.cityControl.value,
      locationState: this.stateControl.value,
      locationZip: this.form.value.zip,
      locationPhone: this.form.value.phone,
      locationEmail: this.form.value.email
    };
  
    console.log('locationData:', locationData); // Log the data being sent to the server
  
    // Call the addLocation method and pass the form values along with accountId
    this.locationService.addLocation(locationData).subscribe(
      response => {
        console.log('Location added successfully:', response);
        this.router.navigate(['/app-location-list']); // Navigate to location-list 
      },
      error => {
        console.error('Error adding location:', error);
      }
    );
  }
  cancel(event: Event): void {
    this.router.navigate(['/app-location-list']); // Navigate to location-list 
  }
}
