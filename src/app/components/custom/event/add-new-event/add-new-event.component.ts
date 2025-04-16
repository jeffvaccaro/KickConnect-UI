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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { EventService } from '../../../../services/event.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { IReservationCount } from '../../../../interfaces/reservation-count';
import { SchedulerService } from '../../../../services/scheduler.service';

@Component({
    selector: 'app-add-new-event',
    imports: [
        CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule,
        MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule,
        MatSlideToggleModule
    ],
    templateUrl: './add-new-event.component.html',
    styleUrl: './add-new-event.component.scss'
})
export class AddNewEventComponent implements OnInit {
  form: FormGroup;
  eventId: number;
  accountCode: string;
  accountId: number;
  setCostToAttend: boolean;
  setReservation: boolean;
  reservationCounts: IReservationCount[] = [];

  constructor(private fb: FormBuilder, private eventService: EventService, private snackBarService: SnackbarService, 
              private userService: UserService, private commonService: CommonService, private route: ActivatedRoute, 
              private router: Router, private schedulerService: SchedulerService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nameControl: ['', Validators.required],
      descriptionControl: ['', [Validators.required]],
      isReservation: ['',[]],
      reservationCount: ['',[]],
      isCostToAttend: ['',[]],
      costToAttend: ['',[]],
      isActiveControl: [false]
    });

    this.userService.getAccountCode().subscribe(accountCode => {
      this.accountCode = accountCode;
      this.cdr.detectChanges();
    });

    this.userService.getAccountId().subscribe(accountId => {
      this.accountId = Number(accountId);
      this.cdr.detectChanges;
    })

    this.schedulerService.getReservationCount().subscribe(reservationCounts => {
      this.reservationCounts = reservationCounts;
    })
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

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission

    let eventData = 
    {
      accountId: this.accountId,
      eventName: this.form.value.nameControl,
      eventDescription: this.form.value.descriptionControl,
      isActive: this.form.value.isActiveControl ? 0 : 1,
      isReservation: this.form.value.isReservation ?? 0,
      isCostToAttend: this.form.value.isCostToAttend ?? 0,
      reservationCount: this.form.value.reservationCount ?? 0,
      costToAttend: this.form.value.costToAttend ?? 0
     };
  
  
    // Call the updateLocation method and pass the form values along with accountId
    this.eventService.addEvent(eventData).subscribe({
      next: response => {
        this.router.navigate(['/app-event-list']); // Navigate to role-list 
      },
      error: error => {
        this.snackBarService.openSnackBar('Error Updating Event data:' + error.message, '',  []);
      }
    });
  }
  
  cancel(event: Event): void {
    this.router.navigate(['/app-event-list']);
  }
}
