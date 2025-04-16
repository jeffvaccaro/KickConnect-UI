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
import { LocationService } from '../../../../services/location.service';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-edit-location',
    imports: [
        CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule,
        MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule
    ],
    templateUrl: './edit-location.component.html',
    styleUrls: ['./edit-location.component.scss']
})
export class EditLocationComponent implements OnInit {
  form: FormGroup;
  locationId: number;


  constructor(private fb: FormBuilder, private locationService: LocationService, private commonService: CommonService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Get the locationId from the route parameters
    this.route.params.subscribe(params => {
      this.locationId = +params['locationId']; // Assuming 'id' is the route parameter name
      this.loadLocationData(this.locationId);
    });

    this.form = this.fb.group({
      nameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      phoneControl: [''],
      addressControl: [''],
      cityControl: [''],
      stateControl: [''],
      zipControl: [''],
      isActiveControl: [true]
    });

    this.form.get('cityControl')!.disable();
    this.form.get('stateControl')!.disable();
  }

  loadLocationData(locationId: number): void {
    this.locationService.getLocationsById(locationId).subscribe({
      next: response => {
        this.form.patchValue({
          nameControl: response[0].locationName,
          emailControl: response[0].locationEmail,
          phoneControl: response[0].locationPhone,
          addressControl: response[0].locationAddress,
          cityControl: response[0].locationCity,
          stateControl: response[0].locationState,
          zipControl: response[0].locationZip,
          isActiveControl:response[0].isActive === 0
        });
      },
      error: error => {
        console.error('Error fetching location data:', error);
        // Handle error here (e.g., show error message)
      }
    });
  }
  
  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
    //console.log('location form info', this.form.value); // Log the form values

    this.form.get('cityControl')!.enable();
    this.form.get('stateControl')!.enable();
  
    const accountId = localStorage.getItem('accountId'); // Retrieve accountId from local storage
    let locationData = {
      accountId: accountId,
      locationName: this.form.value.nameControl,
      locationAddress: this.form.value.addressControl,
      locationCity: this.form.value.cityControl,
      locationState: this.form.value.stateControl,
      locationZip: this.form.value.zipControl,
      locationPhone: this.form.value.phoneControl,
      locationEmail: this.form.value.emailControl,
      isActive: this.form.value.isActiveControl ? 0 : 1
    };
  
    //console.log('locationData:', locationData); // Log the data being sent to the server
  
    // Call the updateLocation method and pass the form values along with accountId
    this.locationService.updateLocation(this.locationId, locationData).subscribe(
      response => {
        //console.log('Location updated successfully:', response);
        this.router.navigate(['/app-location-list']); // Navigate to location-list 
      },
      error => {
        console.error('Error updating location:', error);
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
          this.form.patchValue({
            cityControl: response.city,
            stateControl: response.state_code
          });
          // console.log('City/State Info:', response);
        },
        error: error => {
          console.error('Error fetching City/State Info:', error);
        }
      });
    }
  }

  cancel(event: Event): void {
    this.router.navigate(['/app-location-list']); // Navigate to location-list 
  }
}
