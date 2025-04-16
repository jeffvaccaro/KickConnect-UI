import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked, Inject } from '@angular/core';
import { DayPilot, DayPilotCalendarComponent, DayPilotModule } from '@daypilot/daypilot-lite-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { DataService } from '../../../services/data.service';
import { AddEditDialogComponent } from './add-edit-dialog/add-edit-dialog.component';
import { ICustomDayPilotEventData } from '../../../interfaces/customDayPilotEventData';
import { EventService } from '../../../services/event.service';
import { SchedulerService } from '../../../services/scheduler.service';
import { IEvent } from '../../../interfaces/event';
import { ISchedule } from '../../../interfaces/schedule';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-scheduler',
    standalone: true,
    imports: [DayPilotModule, MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './scheduler.component.html',
    styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent implements AfterViewInit {
  @ViewChild('calendar') calendar!: DayPilotCalendarComponent;
  private createEventDataManager = createEventData(); 
  
  eventObj : IEvent;
  scheduleList : ISchedule[] = [];
  customDPEvents: ICustomDayPilotEventData[] = [];


  // Define the configCalendar property here
  configCalendar: DayPilot.CalendarConfig = {
    viewType: 'Week',
    onTimeRangeSelected: args => {
      // Override default behavior by not calling any default function
      // Do nothing here to prevent the default add event dialog
    },
    onEventClick: (args) => {
      const updatedEvent = args.e.data;
      console.log('args', args.e.data);
      const eventIndex = this.customDPEvents.findIndex(event => event.id === updatedEvent.id);
      const eventData = {
        ...args.e.data,
        accountId: args.e.data.accountId,
        scheduleMainId: args.e.data.scheduleMainId,
        existingEventId: args.e.data.existingEventId,
        existingEventValue: args.e.data.existingEventValue,
        existingEventName: args.e.data.existingEventName || 'defaultName',
        eventDescription: args.e.data.eventDescription || '',
        eventName: args.e.data.text || '',
        selectedDate: args.e.data.start.toString('yyyy-MM-dd'),
        day: new Date(args.e.data.start).getDay(), // Use getDay to get the day of the week (0-6)
        selectedTime: args.e.data.start.toString('HH:mm'),
        duration: (args.e.data.end.getTime() - args.e.data.start.getTime()) / (60 * 1000),
        locationValues: args.e.data.locationValues !== undefined ? args.e.data.locationValues : -99,
        reservationCount: args.e.data.reservationCount,
        costToAttend: args.e.data.costToAttend,
        isRepeat: args.e.data.isRepeat || false,
        isActive: args.e.data.isActive || false,
        isReservation: args.e.data.isReservation,
        isCostToAttend: args.e.data.isCostToAttend,
      };
      // console.log('eventData onClick:', eventData);
    
      this.openAddEventDialog('300ms', '100ms', false, eventData);
    },    
    onEventMoved: (args) => {
      const updatedEvent = {
        ...args.e.data,
        start: new DayPilot.Date(args.newStart), // Ensure start is a Date object
        end: new DayPilot.Date(args.newEnd) // Ensure end is a Date object
    };
      this.openAddEventDialog('300ms', '100ms', false, updatedEvent);
    },
    onEventResized: (args) => {
      const updatedEvent = {
        ...args.e.data,
        duration: (args.newEnd.getTime() - args.newStart.getTime()) / (60 * 1000)
    };
    
      updatedEvent.duration = (args.newEnd.getTime() - args.newStart.getTime()) / (60 * 1000); // Calculate duration in minutes
      this.openAddEventDialog('300ms', '100ms', false, updatedEvent);
    }
    
  };
  
  constructor(public dialog: MatDialog, private ds: DataService, private schedulerService: SchedulerService, 
    private eventService: EventService, private snackBarService: SnackbarService) {
    
  }
  ngOnInit():void{
    this.loadEvents()
  }

  ngAfterViewInit(): void {
    if (this.calendar && this.calendar.control) {
      this.calendar.control.events.list = this.customDPEvents;
      this.calendar.control.update();
    }
  }

  checkAndLoadEvents(): void {
    if (this.calendar && this.calendar.control) {
      this.loadEvents();
    }
  }  
  loadEvents(): void {
    this.schedulerService.getSchedules().subscribe((data: ISchedule[]) => {
      this.scheduleList = data;
      console.log('scheduleList',this.scheduleList);
      this.customDPEvents = this.scheduleList.map(schedule => this.mapScheduleToEvent(schedule));
      this.updateCalendar();
      // console.log('loadEvents: scheduleList:', this.scheduleList);
    });  
     
  }
  
  mapScheduleToEvent(schedule: ISchedule): ICustomDayPilotEventData {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() - eventDate.getDay() + schedule.day);
    const formattedDate = this.formatDate(eventDate.toISOString());
    
    return {
      accountId: schedule.accountId,
      scheduleMainId: schedule.scheduleMainId,
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
    const dialogRef = this.dialog.open(AddEditDialogComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: this.createEventData(isNew, event)
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleEventDialogClose(event, result, eventDataManager);
      } else {
        this.loadEvents();
      }
    });
  }
  
  createEventData(isNew: boolean, event?: any): any {
    return event ? {
      accountId: event.accountId,
      scheduleMainId: event.scheduleMainId,
      eventName: event.text || '',
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
      isReservation: event.isReservation,
      reservationCount: event.reservationCount,
      isCostToAttend: event.isCostToAttend,
      costToAttend: event.costToAttend,
      isNew
    } : {};
  }

  handleEventDialogClose(event: any, result: any, eventDataManager: any): void {
    //console.log('onClose', result);
    const startDate = this.createDayPilotDate(result.selectedDate, result.selectedTime);
    const endDate = new DayPilot.Date(new Date(startDate.getTime() + result.duration * 60 * 1000));
  
    result.costToAttend = result.costToAttend === '' ? 0 : result.costToAttend;
  
    const standardDate = new Date(startDate.toString());
    result.day = new Date(startDate.toString()).getDay(); // Correctly capture the day of the week (0-6)
  
    result.selectedDate = startDate.toString('yyyy-MM-dd');
    result.startTime = startDate.toString('HH:mm:ss');
    result.endTime = endDate.toString('HH:mm:ss');

    if (event) {
      const eventIndex = this.customDPEvents.findIndex(evt => evt.scheduleMainId === event.scheduleMainId);
      if (eventIndex !== -1) {
        result.existingEventDescription = event.existingEventDescription;
        const updatedEvent = eventDataManager.updateEvent(event, result, startDate, endDate);
        this.updateBackendAndUI(event, updatedEvent, eventIndex);
      }
    } else {
      this.addNewEvent(result, startDate, endDate, eventDataManager);
    }
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
            this.loadEvents()
          },
          error: (error) => console.error('Error occurred while updating schedule event:', error)
        });
      }
    });
  }
  
  addNewEvent(result: any, startDate: DayPilot.Date, endDate: DayPilot.Date, eventDataManager: any): void {
    const eDataItem = eventDataManager.createEvent(result, startDate, endDate);
  
    if (eDataItem.existingEventValue === "newEvent") {
      const eventObj: IEvent = {
        eventId: 0,
        eventName: result.eventName,
        eventDescription: result.eventDescription,
        isReservation: result.isReservation,
        reservationCount: result.reservationCount,
        isCostToAttend: result.isCostToAttend,
        costToAttend: result.costToAttend,
        isActive: true,
        createdBy: '',
        accountId: result.accountId
      };
  
      this.eventService.addEvent(eventObj).subscribe({
        next: (eventId) => {
          const modifiedResult = { ...result, eventId };
          // console.log('modifiedResult:', modifiedResult);
          this.schedulerService.addScheduleEvent(modifiedResult).subscribe({
            next: (scheduleMainId) => {
              eDataItem.existingEventDescription = result.eventDescription;
              this.customDPEvents.push({ ...eDataItem, scheduleMainId });
              this.calendar.control.update();
              this.loadEvents()
            },
            error: (error) => console.error('Error occurred while adding schedule event:', error)
          });
        },
        error: (error) => console.error('Error occurred while adding event:', error)
      });
    } else {

      result.eventId = result.existingEventValue;
      const modifiedResult = { ...result };
      this.schedulerService.addScheduleEvent(modifiedResult).subscribe({
        next: (scheduleMainId) => {
          eDataItem.existingEventId = modifiedResult.existingEventId;
          eDataItem.existingEventValue = modifiedResult.existingEventId;
          eDataItem.existingEventName = modifiedResult.eventName || modifiedResult.existingEventName;
          eDataItem.text = modifiedResult.eventName || modifiedResult.existingEventName;
          eDataItem.existingEventDescription = modifiedResult.existingEventDescription;
          this.customDPEvents.push({ ...eDataItem, scheduleMainId });
          this.calendar.control.update();
          this.loadEvents()
        },
        error: (error) => console.error('Error occurred while adding schedule event:', error)
      });
    }
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
        locationValues: result.locationValues
      };
    }
  };
}
