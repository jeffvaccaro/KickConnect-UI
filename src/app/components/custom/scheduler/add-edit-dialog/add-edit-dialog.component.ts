import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, NativeDateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { UserService } from '../../../../services/user.service';
import { EventService } from '../../../../services/event.service';
import { LocationService } from '../../../../services/location.service';
import { SchedulerService } from '../../../../services/scheduler.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { IDuration } from '../../../../interfaces/duration';
import { IEvent } from '../../../../interfaces/event';
import { ILocations } from '../../../../interfaces/locations';
import { IReservationCount } from '../../../../interfaces/reservation-count';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { isReactive } from '@angular/core/primitives/signals';
import { CustomFormValidationService } from '../../../../services/custom-form-validation.service';

@Component({
    selector: 'app-add-edit-dialog',
    templateUrl: './add-edit-dialog.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatDatepickerModule,
        NgxMaterialTimepickerModule,
        MatSlideToggleModule,
        MatIconModule
    ],
    providers: [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
    ]
})
export class AddEditDialogComponent implements OnInit {
  eventForm: FormGroup;
  durations: IDuration[] = [];
  reservationCounts: IReservationCount[] = [];
  events: IEvent[] = [];
  locations: ILocations[] = [];
  accountId: number;
  isNewEvent: boolean = true;
  isNew: string;
  setReservation: boolean = false;
  setCostToAttend: boolean = false;
  isReadOnly : boolean;
  isAuthorized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private eventService: EventService,
    private locationService: LocationService,
    private schedulerService: SchedulerService,
    private snackBarService: SnackbarService,
    private router: Router,
    public dialogRef: MatDialogRef<AddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private customFormValidationService: CustomFormValidationService
  ) {}

  ngOnInit(): void {
    this.checkAuthorization();
    this.initializeForm();
    this.customFormValidationService.setupConditionalValidators(this.eventForm);
    this.subscribeToFormChanges();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngAfterContentChecked(): void {
    // console.log('Change detection triggered');
  }
  
  subscribeToFormChanges(): void {
    // console.log('initial existingEventValue', this.eventForm.get('existingEventValue')?.value);
  
    this.eventForm.get('existingEventValue')?.valueChanges.subscribe(value => {
      this.handleExistingEventValueChange.bind(this)(value);
      //console.log('existingEventValue changed:', value);
    });
    
    this.eventForm.get('selectedDate')?.valueChanges.subscribe(value => {
      this.handleSelectedDateChange.bind(this)(value);
      //console.log('selectedDate changed:', value);
    });
    
    this.eventForm.get('isReservation')?.valueChanges.subscribe(value => {
      this.setReservation = value;
      //console.log('isReservation changed:', value);
    });
  
    this.eventForm.get('isCostToAttend')?.valueChanges.subscribe(value => {
      this.setCostToAttend = value;
      //console.log('isCostToAttend changed:', value);
    });
  
    this.userService.getAccountId().subscribe({
      next: (accountId: string) => {
        this.handleAccountIdChange(accountId);
        this.loadInitialData(); // Ensure loadInitialData is called after setting accountId
        //console.log('accountId fetched:', accountId);
      },
      error: (err) => this.snackBarService.openSnackBar("Error fetching account ID: " + err.message, '', [])
    });
  }
  
  
  handleExistingEventValueChange(value: any): void {
    const isExistingEventValuePopulated = !!value;
    this.customFormValidationService.updateFormControlStates(this.eventForm, isExistingEventValuePopulated);
  
    // Enable fields for new events
    if (value === 'newEvent') {
      this.eventForm.get('eventName')?.enable();
      this.eventForm.get('eventDescription')?.enable();
      this.eventForm.get('locationValues')?.enable();
    } else {
      this.eventForm.get('eventName')?.disable();
      this.eventForm.get('eventDescription')?.disable();


      // this.eventForm.get('locationValues')?.disable();
    }
  
    this.isReadOnly = !!value && value !== 'newEvent';
  }
    
  handleSelectedDateChange(selectedDate: any): void {
    const dayNumber = new Date(selectedDate).getDay();
    this.eventForm.patchValue({ dayNumber });
  }

  handleAccountIdChange(accountId: string): void {
    this.accountId = Number(accountId);
    this.eventForm.get('accountId')?.setValue(this.accountId);
    this.cdr.detectChanges();
  }
  
  handleError(message: string, error: any): Observable<null> {
    this.snackBarService.openSnackBar(`${message}: ${error.message}`, '', []);
    return of(null);
  }
  
  checkAuthorization(): void {
    this.userService.getRoleName().subscribe(roleName => {
      this.isAuthorized = roleName.includes('Admin') || roleName.includes('Owner');
    });
  }
  
  initializeForm(): void {
    const today = new Date();
    const closestHour = today.getMinutes() >= 30 ? today.getHours() + 1 : today.getHours();
    const defaultTime = closestHour >= 12 ? `${closestHour - 12 === 0 ? 12 : closestHour - 12}:00 PM` : `${closestHour === 0 ? 12 : closestHour}:00 AM`;
  
    const data = this.data;
    const isReadOnly = data?.existingEventValue !== 'newEvent' && !!data?.existingEventValue;
  
    // Correctly parse selectedDate to avoid timezone issues
    const selectedDate = data?.selectedDate ? new Date(`${data.selectedDate}T00:00:00`) : new Date();
    
     console.log("Initialize form:", data);

    this.eventForm = this.fb.group({
      existingEventValue: [{ value: data?.existingEventValue || 'newEvent', disabled: !!data?.existingEventValue }, Validators.required],
      existingEventName: [{ value: data?.existingEventName || '', disabled: !!data?.existingEventValue }, []], // No initial validation
      eventName: [data?.eventName || '', Validators.required], // Required
      eventDescription: [data?.eventDescription || data?.existingEventDescription || '', Validators.required],
      locationValues: [data?.locationValues !== undefined ? Number(data.locationValues) : -99, []],
      selectedDate: [selectedDate, Validators.required],
      selectedTime: [data?.selectedTime || defaultTime, Validators.required],
      duration: [Number(data?.duration) || 60, Validators.required],
      accountId: [data?.accountId || 0, []],
      scheduleMainId: [data?.scheduleMainId || 0, []],
      day: [selectedDate.getDay(), []],
      isRepeat: [data?.isRepeat ?? true, []],
      isActive: [true, []],
      isReservation: [data?.isReservation ?? false, []],
      isCostToAttend: [data?.isCostToAttend ?? false, []],
      reservationCount: [0, []],
      costToAttend: [0, []],
    });
  
    this.subscribeToFormChanges();

    // Explicitly set and detect changes with setTimeout
    setTimeout(() => {
      this.eventForm.patchValue({
        isReservation: data?.isReservation ?? false,
        isCostToAttend: data?.isCostToAttend ?? false,
        reservationCount: data?.reservationCount ?? 0,
        costToAttend: data?.costToAttend ?? 0
      });

      this.cdr.detectChanges();
    }, 100); 
  }
   
  loadInitialData(): void {
    forkJoin({
      durations: this.schedulerService.getDurations().pipe(
        catchError(error => this.handleError('Error Fetching Duration data', error))
      ),
      reservationCounts: this.schedulerService.getReservationCount().pipe(
        catchError(error => this.handleError('Error Fetching ReservationCount data', error))
      ),
      events: this.eventService.getActiveEvents(this.accountId).pipe(
        catchError(error => this.handleError('Error Fetching Event data', error))
      ),
      locations: this.locationService.getLocations('active').pipe(
        catchError(error => this.handleError('Error Fetching Location data', error))
      )
    }).subscribe({
      next: (response) => {
        this.durations = response.durations || [];
        this.reservationCounts = response.reservationCounts || [];
        this.events = response.events || [];
        this.locations = response.locations || [];
      },
      error: error => this.snackBarService.openSnackBar('General Error Fetching data:' + error.message, '', [])
    });
  }

  close() {
    this.dialogRef.close();
  }

  enableFieldsBeforeClose(): void {
    ['eventDescription', 'existingEventValue', 'existingEventName', 'eventName', 'locationValues', 'isRepeat', 'isReservation', 'reservationCount', 'costToAttend', 'isCostToAttend']
      .forEach(field => this.eventForm.get(field)?.enable());
  }
  
  save(): void {
    if (this.eventForm.valid) {
      this.enableFieldsBeforeClose();
      setTimeout(() => {
        this.dialogRef.close(this.eventForm.value);
      }, 100);
    } else {
      this.validateFormFields();
      // console.log('Form is invalid', this.eventForm);
      // Object.keys(this.eventForm.controls).forEach(field => {
      //   console.log(`${field} errors:`, this.eventForm.get(field)?.errors);
      // });
    }
  }
  
  
  validateFormFields(): void {
    this.eventForm.markAllAsTouched();
    const invalidFields = Object.keys(this.eventForm.controls).filter(name => this.eventForm.controls[name].invalid);
  
    const eventDescriptionControl = this.eventForm.get('eventDescription');
    if (eventDescriptionControl && !eventDescriptionControl.value) {
      eventDescriptionControl.setValidators([Validators.required]);
      eventDescriptionControl.setErrors({ required: true });
      eventDescriptionControl.updateValueAndValidity();
    }
  }
  
  deleteEvent(event: any): void {
    if (this.isAuthorized) {
      const scheduleMainId = this.eventForm.get('scheduleMainId')?.value;
      this.schedulerService.deleteScheduleEvent(scheduleMainId).subscribe({
        next: (response) => {
          this.snackBarService.openSnackBar("Event successfully deleted", '', []);
          this.dialogRef.close();
        },
        error: (err) => {
          this.snackBarService.openSnackBar("Failed to delete event: " + err.message, '', []);
        }
      });
    } else {
      this.snackBarService.openSnackBar("Unauthorized attempt to delete event", '', []);
    }
  }
  
  enableDisable(event: any): void {
    const eventId = event.value;
    const selectedIndex = this.events.findIndex(event => event.eventId === eventId);
    this.isNewEvent = selectedIndex === -1;
  
    if (selectedIndex !== -1) {
      const selectedEvent = this.events[selectedIndex];
      this.populateFormForExistingEvent(selectedEvent);
    } else {
      this.resetFormForNewEvent();
    }
  }
  
  populateFormForExistingEvent(event: IEvent): void {
    this.eventForm.get('existingEventName')?.setValue(event.eventName);
    this.eventForm.get('eventDescription')?.setValue(event.eventDescription);
    this.eventForm.get('eventName')?.setValue('');
    this.eventForm.get('isCostToAttend')?.setValue(event.isCostToAttend);
    this.eventForm.get('costToAttend')?.setValue(event.costToAttend);
    this.eventForm.get('isReservation')?.setValue(event.isReservation);
    this.eventForm.get('reservationCount')?.setValue(event.reservationCount);
    
    console.log('populateformForExistingEvent', event);


  }
  
  resetFormForNewEvent(): void {
    this.eventForm.get('eventDescription')?.setValue('');
  }
  
  onReservationChange(event: any): void {
    this.setReservation = event.checked === true;
  }
  
  onCostToAttendChange(event: any): void {
    this.setCostToAttend = event.checked === true;
  }

}
