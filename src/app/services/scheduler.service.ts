import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { IDuration } from '../interfaces/duration';
import { IReservationCount } from '../interfaces/reservation-count';
import { environment } from '../../environments/environment';
import { ISchedule } from '../interfaces/schedule';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  private apiUrl = environment.apiUrl + '/schedule';

  constructor(private http: HttpClient, private logger: LoggerService) { }

  private handleError<T>(method: string, error: any): Observable<T> {
    this.logger.logError(`Error ${method}`, error);
    return of([] as unknown as T); // Return an empty array casted to the expected type
  }
  
  getDurations(): Observable<IDuration[]> {
    return this.http.get<IDuration[]>(`${this.apiUrl}/get-durations`)
      .pipe(catchError(error => this.handleError<IDuration[]>('getDurations', error)));
  }
  
  getReservationCount(): Observable<IReservationCount[]> {
    return this.http.get<IReservationCount[]>(`${this.apiUrl}/get-reservationCounts`)
      .pipe(catchError(error => this.handleError<IReservationCount[]>('getReservationCount', error)));
  }
  
  getSchedules(): Observable<ISchedule[]> {
    return this.http.get<ISchedule[]>(`${this.apiUrl}/get-main-schedule`)
      .pipe(catchError(error => this.handleError<ISchedule[]>('getSchedules', error)));
  }

  getSchedulesWithAssignmentsByLocation(locationId: number){
    return this.http.get<ISchedule[]>(`${this.apiUrl}/get-location-assignment-schedule/${locationId}`)
    .pipe(catchError(error => this.handleError<ISchedule[]>('getSchedules', error)));
  }

  getNextClass(locationId: number){
    return this.http.get<ISchedule[]>(`${this.apiUrl}/get-next-class/${locationId}`)
    .pipe(catchError(error => this.handleError<ISchedule[]>('getSchedules', error)));  
  }

  addScheduleEvent(eventData: any): Observable<any> {
    // console.log('addScheduleEvent', eventData);
    return this.http.post<any>(`${this.apiUrl}/add-schedule`, eventData)
      .pipe(
        map(response => response.scheduleMainId || response),
        catchError(error => this.handleError('addScheduleEvent', error))
      );
  }
  
  updateScheduleEvent(eventData: any): Observable<any> {
    // console.log('updateScheduleEvent', eventData);
    return this.http.put<any>(`${this.apiUrl}/update-schedule/${eventData.scheduleMainId}`, eventData)
      .pipe(catchError(error => this.handleError('updateScheduleEvent', error)));
  }
  
  deleteScheduleEvent(scheduleMainId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-schedule-event/${scheduleMainId}`)
      .pipe(catchError(error => this.handleError('deleteScheduleEvent', error)));
  }
  
}
