import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { UserService } from '../../../../services/user.service';
import { EventService } from '../../../../services/event.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { SchedulerService } from '../../../../services/scheduler.service';
import { IReservationCount } from '../../../../interfaces/reservation-count';

@Component({
    selector: 'app-edit-event',
    imports: [
        CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule,
        MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule
    ],
    templateUrl: './edit-event.component.html',
    styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  form: FormGroup;
  eventId: number;
  accountCode: string;
  accountId: number;
  setReservation: boolean = false;
  setCostToAttend: boolean = false;
  reservationCounts: IReservationCount[] = [];

  constructor(private fb: FormBuilder, private eventService: EventService, private snackBarService: SnackbarService, 
              private userService: UserService, private commonService: CommonService, private route: ActivatedRoute, 
              private schedulerService: SchedulerService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nameControl: ['', Validators.required],
      descriptionControl: ['', [Validators.required]],
      isReservation: ['',[]],
      reservationCount: ['',[]],
      isCostToAttend: ['',[]],
      costToAttend: ['',[]],
      isActiveControl: [true]
    });

    this.userService.getAccountCode().subscribe(accountCode => {
      this.accountCode = accountCode;
      this.cdr.detectChanges();
    });

    this.userService.getAccountId().subscribe(accountId => {
      this.accountId = Number(accountId);
      this.cdr.detectChanges;
    })

    // Get the eventId from the route parameters
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId']; // Assuming 'id' is the route parameter name
      this.loadEventData(this.eventId);
    });

    this.schedulerService.getReservationCount().subscribe(reservationCounts => {
      this.reservationCounts = reservationCounts;
    })

    this.subscribeToFormChanges();
  }

  subscribeToFormChanges(): void {
    this.form.get('isReservation')?.valueChanges.subscribe(value => {
      // console.log('setReservation', value);
      this.setReservation = value;
    });
  
    this.form.get('isCostToAttend')?.valueChanges.subscribe(value => {
      // console.log('setCostToAttend', value);
      this.setCostToAttend = value;
    });
  }

  loadEventData(eventId: number): void {
    this.eventService.getEventById(this.accountId, eventId).subscribe({
      next: response => {
        this.form.patchValue({
          nameControl: response.eventName,
          descriptionControl: response.eventDescription,
          isActiveControl: response.isActive === 0,
          isReservation: response?.isReservation ?? false,
          isCostToAttend: response?.isCostToAttend ?? false,
          reservationCount: response?.reservationCount ?? 0,
          costToAttend: response?.costToAttend ?? 0
        });


      },
      error: error => {
        this.snackBarService.openSnackBar('Error fetching Role data:' + error.message, '',  []);
      }
    });
  }

  onReservationChange(event:any){
    if(event.checked === true){
      this.setReservation = true;
    }else{
      this.setReservation = false;
    }
  }

  onCostToAttendChange(event:any){
    if(event.checked === true){
      this.setCostToAttend = true;
    }else{
      this.setCostToAttend = false;
    }
  }
  cancel(event: Event): void {
    this.router.navigate(['/app-event-list']); // Navigate to role-list 
  }

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
  
    let eventData = {
      eventName: this.form.value.nameControl,
      eventDescription: this.form.value.descriptionControl,
      isActive: this.form.value.isActiveControl ? 0 : 1,
      isReservation: this.form.value.isReservation ?? 0,
      isCostToAttend: this.form.value.isCostToAttend ?? 0,
      reservationCount: this.form.value.reservationCount ?? 0,
      costToAttend: this.form.value.costToAttend ?? 0
    };
  
    this.updateEventCall(eventData);  

  }

  deleteEvent(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
    this.form.get('isActiveControl')?.setValue(false);

    let eventData = {
      eventName: this.form.value.nameControl,
      eventDescription: this.form.value.descriptionControl,
      isActive: this.form.get('isActiveControl')?.value,
      isReservation: this.form.value.isReservation ?? 0,
      isCostToAttend: this.form.value.isCostToAttend ?? 0,
      reservationCount: this.form.value.reservationCount ?? 0,
      costToAttend: this.form.value.costToAttend ?? 0
    };

    this.updateEventCall(eventData);

  }

  updateEventCall(eventData: any){
    // Call the updateEventMethod method and pass the form values along with accountId
    this.eventService.updateEvent(this.eventId, eventData).subscribe({
      next: response => {
        this.router.navigate(['/app-event-list']); // Navigate to role-list 
      },
      error: error => {
        this.snackBarService.openSnackBar('Error Updating event data:' + error.message, '',  []);
      }
    });
  }
}
