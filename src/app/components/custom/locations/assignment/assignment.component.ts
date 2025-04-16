import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DayPilot, DayPilotCalendarComponent, DayPilotModule } from '@daypilot/daypilot-lite-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { DataService } from '../../../../services/data.service';
import { ICustomDayPilotEventData } from '../../../../interfaces/customDayPilotEventData';
import { EventService } from '../../../../services/event.service';
import { SchedulerService } from '../../../../services/scheduler.service';
import { LocationService } from '../../../../services/location.service';
import { IEvent } from '../../../../interfaces/event';
import { ISchedule } from '../../../../interfaces/schedule';
import { SnackbarService } from '../../../../services/snackbar.service';
import { AssignmentDialogComponent } from './assignment-dialog/assignment-dialog.component';
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-assignments',
    standalone: true,
    imports: [DayPilotModule, MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './assignment.component.html',
    styleUrl: './assignment.component.scss'
})
export class AssignmentComponent implements AfterViewInit {
  @ViewChild('calendar') calendar!: DayPilotCalendarComponent;
  private createEventDataManager = createEventData(); 
  
  eventObj : IEvent;
  scheduleList : ISchedule[] = [];
  customDPEvents: ICustomDayPilotEventData[] = [];
  locationId: number;
  locationName: string;

  // Define the configCalendar property here
  configCalendar: DayPilot.CalendarConfig = {
    viewType: 'Week',
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    onTimeRangeSelected: args => {},
    onEventClick: args => {
      const updatedEvent = args.e.data;
      const eventIndex = this.customDPEvents.findIndex(event => event.id === updatedEvent.id);
      const eventData = {
        ...args.e.data,
        accountId: args.e.data.accountId,
        scheduleMainId: args.e.data.scheduleMainId,
        scheduleLocationId: args.e.data.scheduleLocationId,
        existingEventId: args.e.data.existingEventId,
        existingEventValue: args.e.data.existingEventValue,
        existingEventName: args.e.data.existingEventName || 'defaultName',
        eventDescription: args.e.data.eventDescription || '',
        eventName: args.e.data.text || '',
        selectedDate: args.e.data.start.toString('yyyy-MM-dd'),
        day: new Date(args.e.data.start).getDay(),
        selectedTime: args.e.data.start.toString('HH:mm'),
        duration: (args.e.data.end.getTime() - args.e.data.start.getTime()) / (60 * 1000),
        locationValues: args.e.data.locationValues !== undefined ? args.e.data.locationValues : -99,
        locationName: this.locationName,
        reservationCount: args.e.data.reservationCount,
        costToAttend: args.e.data.costToAttend,
        isRepeat: args.e.data.isRepeat || false,
        isActive: args.e.data.isActive || false,
        isReservation: args.e.data.isReservation,
        isCostToAttend: args.e.data.isCostToAttend,
      };
      this.openAddEventDialog('300ms', '100ms', false, eventData);
    },
  };
  
  constructor(public dialog: MatDialog, private ds: DataService, private schedulerService: SchedulerService, private locationService: LocationService,
    private eventService: EventService, private snackBarService: SnackbarService, private route: ActivatedRoute) {
    
  }
  ngOnInit():void{
    this.route.paramMap.subscribe(params => {
      this.locationId = parseInt(params.get('locationId')!);
    });
    this.loadEvents(this.locationId)
  }

  ngAfterViewInit(): void {
    if (this.calendar && this.calendar.control) {
      this.calendar.control.events.list = this.customDPEvents;
      this.calendar.control.update();
    }
  }

  checkAndLoadEvents(): void {
    if (this.calendar && this.calendar.control) {
      this.loadEvents(this.locationId);
    }
  }  
  loadEvents(locationId: number): void {
    this.schedulerService.getSchedulesWithAssignmentsByLocation(locationId).subscribe((data: ISchedule[]) => {
      this.scheduleList = data;
      //console.log('loadEvents',data);
      this.customDPEvents = this.scheduleList.map(schedule => this.mapScheduleToEvent(schedule));
      this.updateCalendar();
    });

    this.locationService.getLocationsById(locationId).subscribe({
      next: response => {
          this.locationName = response[0].locationName
        },      
      error: error => {
        console.error('Error fetching location data:', error);
        // Handle error here (e.g., show error message)
      }
    });
  }
  
  mapScheduleToEvent(schedule: ISchedule): ICustomDayPilotEventData {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() - eventDate.getDay() + schedule.day);
    const formattedDate = this.formatDate(eventDate.toISOString());
    //console.log(schedule,'schedule');
    return {
      accountId: schedule.accountId,
      scheduleMainId: schedule.scheduleMainId,
      scheduleLocationId: schedule.scheduleLocationId,
      id: schedule.eventId,
      text: schedule.eventName,
      start: `${formattedDate}T${this.formatTime(schedule.startTime)}`,
      end: `${formattedDate}T${this.formatTime(schedule.endTime)}`,
      resource: schedule.eventId,
      existingEventId: schedule.eventId,
      existingEventName: schedule.eventName,
      existingEventValue: String(schedule.eventId),
      existingEventDescription: schedule.eventDescription,
      reservationCount: schedule.reservationCount,
      costToAttend: schedule.costToAttend,
      selectedDate: schedule.selectedDate,
      selectedTime: schedule.selectedTime,
      locationValues: schedule.locationValues,
      day: schedule.day,
      duration: schedule.duration,
      isRepeat: schedule.isRepeat,
      isActive: schedule.isActive,
      isReservation: schedule.isReservation,
      isCostToAttend: schedule.isCostToAttend,
      startTime: this.formatTime(schedule.startTime),
      endTime: this.formatTime(schedule.endTime),
      profileId: schedule.profileId,
      altProfileId: schedule.altProfileId
    };
  }
  
  
  updateCalendar(): void {
    if (this.calendar && this.calendar.control) {
      this.customDPEvents.forEach(event => {
        if (event.profileId) {
          event.barColor = "#000000";
        } else {
          // Assign CSS class if profileId is null

          event.barColor = "#b02a37";
        }
      });

      this.calendar.control.events.list = this.customDPEvents;
      this.calendar.control.update();
    }
  }
  
  
  
  formatDate(date: string): string {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  formatTime(time: string): string {
    const [hoursMinutes, modifier] = time.split(' ');
    let [hours, minutes] = hoursMinutes.split(':').map(Number);
  
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`; // Correct time format
  }

  openAddEventDialog(enterAnimationDuration: string, exitAnimationDuration: string, isNew: boolean, event?: any): void {
    const eventDataManager = createEventDataManager();
    console.log(event,'data');
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: this.createEventData(isNew, event)
    });
  
    // Capture when the dialog closes
    dialogRef.afterClosed().subscribe(result => {
      this.loadEvents(this.locationId);
    });
  }
  
  // Example method to handle the dialog close
  handleDialogClose(result: any): void {
    // Your logic here, e.g., updating the event list, calling a service, etc.
    console.log('Handling dialog close with result:', result);
    this.loadEvents(this.locationId); // Example action: reload events after dialog closes
  }
  
  
  createEventData(isNew: boolean, event?: any): any {
    return event ? {
      accountId: event.accountId,
      scheduleMainId: event.scheduleMainId,
      scheduleLocationId: event.scheduleLocationId,
      eventName: event.text || '',
      day: event.day,
      selectedDate: event.start.toString('yyyy-MM-dd') || '',
      selectedTime: event.start.toString('HH:mm') || '',
      duration: (event.end.getTime() - event.start.getTime()) / (60 * 1000) || 60,
      existingEventId: event.existingEventId || 'blank?',
      existingEventName: event.existingEventName || '',
      existingEventValue: event.existingEventValue,
      existingEventDescription: event.existingEventDescription || '',
      isRepeat: event.isRepeat || false,
      isActive: event.isActive || false,
      locationValues: event.locationValues,
      locationName: this.locationName,
      isReservation: event.isReservation,
      reservationCount: event.reservationCount,
      isCostToAttend: event.isCostToAttend,
      costToAttend: event.costToAttend,
      primaryProfile: event.profileId,
      alternateProfile: event.altProfileId,
      isNew
    } : {};
  }

  
  createDayPilotDate(selectedDate: string, selectedTime: string): DayPilot.Date {
    
    const [time, modifier] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours !== 12) hours += 12;
    else if (modifier === 'AM' && hours === 12) hours = 0;
    
    const localSelectedDate = new Date(selectedDate);
    localSelectedDate.setHours(hours, minutes);
    
    // Adjust for local time zone
    const localTimeOffset = localSelectedDate.getTimezoneOffset() * 60000;
    const localDateTime = new Date(localSelectedDate.getTime() - localTimeOffset);
   
    return new DayPilot.Date(localDateTime);
  }
  
  updateBackendAndUI(event: any, updatedEvent: ICustomDayPilotEventData, eventIndex: number): void {
    // console.log('updatedEvent', updatedEvent);
    this.eventService.updateEvent(event.existingEventId, updatedEvent).subscribe({
      next: (eventId) => {
        const modifiedResult = { 
          ...event, 
          eventId, 
          startTime: updatedEvent.startTime, 
          endTime: updatedEvent.endTime, 
          day: updatedEvent.day,
          locationValues: updatedEvent.locationValues
        };
        this.schedulerService.updateScheduleEvent(modifiedResult).subscribe({
          next: () => {
            updatedEvent.existingEventId = event.existingEventId;
            updatedEvent.existingEventValue = event.existingEventId;
            updatedEvent.existingEventName = event.eventName || event.existingEventName;
            updatedEvent.existingEventDescription = event.eventDescription || event.existingEventDescription;
            updatedEvent.text = event.eventName || event.existingEventName;
            this.customDPEvents[eventIndex] = updatedEvent;
            this.calendar.control.update();
            this.loadEvents(this.locationId)
          },
          error: (error) => console.error('Error occurred while updating schedule event:', error)
        });
      }
    });
  }
  
  
}  

function createEventData() {
  let customDPEvents: ICustomDayPilotEventData[] = [];

  return {
    addEvent(event: ICustomDayPilotEventData) {
      customDPEvents.push(event);
    },
    updateEvent(updatedEvent: ICustomDayPilotEventData) {
      const eventIndex = customDPEvents.findIndex(event => event.id === updatedEvent.id);
      if (eventIndex !== -1) {
        customDPEvents[eventIndex] = updatedEvent;
      }
    },
    getEvents() {
      return customDPEvents;
    }
  };
}

function createEventDataManager() {
  return {
    createEvent(result: any, startDate: DayPilot.Date, endDate: DayPilot.Date): ICustomDayPilotEventData {
      // console.log('createEvent', result);
      return {
        id: DayPilot.guid(),
        start: startDate,
        end: endDate,
        text: result.eventName === "" ? result.existingEventName : result.eventName,
        existingEventId: result.existingEventId !== undefined ? Number(result.existingEventId) : 0,
        existingEventName: result.existingEventName || '',
        existingEventValue: result.existingEventValue,
        existingEventDescription: result.existingEventDescription || '',
        isRepeat: result.isRepeat,
        isActive: true,
        isReservation: result.isReservation,
        reservationCount: result.reservationCount,
        isCostToAttend: result.isCostToAttend,
        costToAttend: result.costToAttend,
        selectedDate: result.selectedDate,
        selectedTime: result.selectedTime,
        day: result.day,
        duration: result.duration,
        startTime: startDate.toString('HH:mm:ss'), // Add this property
        endTime: endDate.toString('HH:mm:ss'), // Add this property
        locationValues: result.locationValues,
        profileId: result.profileId,
        altProfileId: result.altProfileId
      };
    },
    updateEvent(existingEvent: ICustomDayPilotEventData, result: any, startDate: DayPilot.Date, endDate: DayPilot.Date): ICustomDayPilotEventData {
      // console.log('updateEvent', result);
      return {
        ...existingEvent,
        start: startDate,
        end: endDate,
        text: result.eventName === "" ? result.existingEventName : result.eventName,
        existingEventId: result.existingEventValue !== undefined ? Number(result.existingEventValue) : 0,
        existingEventName: result.existingEventName || '',
        existingEventValue: result.existingEventValue,
        existingEventDescription: result.existingEventDescription || '',
        isRepeat: result.isRepeat,
        isActive: true,
        isReservation: result.isReservation,
        reservationCount: result.reservationCount,
        isCostToAttend: result.isCostToAttend,
        costToAttend: result.costToAttend,
        selectedTime: result.selectedTime,
        selectedDate: result.selectedDate,
        day: result.day,
        duration: result.duration,
        startTime: startDate.toString('HH:mm:ss'),
        endTime: endDate.toString('HH:mm:ss'),
        locationValues: result.locationValues,
        profileId: result.profileId,
        altProfileId: result.altProfileId
      };
    }
  };
}
