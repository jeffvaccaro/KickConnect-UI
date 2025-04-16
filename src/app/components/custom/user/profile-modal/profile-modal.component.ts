import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SkillsAutocompleteComponent } from '../skills-autocomplete/skills-autocomplete.component';
import { UserService } from '../../../../services/user.service';
import { MatOption } from '@angular/material/core';
import { LocationService } from '../../../../services/location.service';
import { ILocations } from '../../../../interfaces/locations';

@Component({
    selector: 'app-profile-modal',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOption,
    SkillsAutocompleteComponent
],
    templateUrl: './profile-modal.component.html',
    styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent {
  profileForm: FormGroup;
  locationArr: ILocations[] = [];
  secLocArr: ILocations[] = [];
  formReady: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userService: UserService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
  ) {
    this.locationService.getLocations("Active").subscribe({
      next: locationResponse => {
        this.locationArr = locationResponse;
        this.secLocArr = locationResponse;  
        this.initializeForm();
        this.formReady = true;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error fetching location data:', error);
      }
    });    
  }

  initializeForm(){
    this.profileForm = this.fb.group({
      profileDescription: [this.data?.profileDescription || '', Validators.required],
      profileURL: [this.data?.profileURL || '', Validators.required],
      profileSkills: this.fb.array([]),
      primaryStudio: [this.data?.primaryLoc || '', Validators.required],
      altStudio: [this.data?.altLoc ? this.data.altLoc.split(',').map(Number) : []]
    });
  
    
    if (this.data?.altLoc) {
      const altLocIds = this.data.altLoc.split(',').map(Number);
      this.profileForm.get('altStudio')!.setValue(altLocIds);
    
      // Update the secLocArr based on the primary location value
      this.secLocArr = this.locationArr.map(location => ({
        ...location,
        disabled: location.locationId === this.data?.primaryLoc
      }));
    }
    

    //this.primaryLocationChange({ value: this.data?.primaryLoc });
   
    this.onSkillsChanged(this.data?.profileSkills || []);
  }

  primaryLocationChange(event: any): void {
    const selectedValue = event.value;

    this.profileForm.get('altStudio')?.setValue([]);

    // Reset and update secLocArr to reflect the primary location change
    this.secLocArr = this.locationArr.map(location => ({
      ...location,
      disabled: location.locationId === selectedValue
    }));

    this.cdr.detectChanges();
  }

  onSkillsChanged(skills: string | string[]): void {

    const skillsArray = this.profileForm.get('profileSkills') as FormArray;
    skillsArray.clear();

    if (typeof skills === 'string') {
      skills = skills.split(',').map(skill => skill.trim());
    }

    if (Array.isArray(skills)) {
      skills.forEach(skill => skillsArray.push(this.fb.control(skill)));
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.profileForm.valid) {
      const formData: FormData = new FormData();
      formData.append('profileData', JSON.stringify(this.profileForm.value));

      this.userService.updateProfile(this.data.userId, formData).subscribe({
        next: response => {
          console.log('Response from server:', response);
        },
        error: error => {
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Update profile request completed');
        }
      });

      this.dialogRef.close(this.profileForm.value);
    }
  }

  trackByLocationId(index: number, location: ILocations): number {
    return location.locationId;
  }
}
