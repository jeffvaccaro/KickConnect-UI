import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl + '/event';

  constructor(private http: HttpClient) { }

  private handleError<T>(method: string, error: any): Observable<T> {
    console.error(`Error occurred in ${method}`, error);
    return of([] as unknown as T); // Return an empty array casted to the expected type
  }
  

  getEvents(accountId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-event-list/${accountId}`)
      .pipe(catchError(error => this.handleError('getEvents', error)));
  }

  getActiveEvents(accountId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-active-event-list/${accountId}`)
      .pipe(catchError(error => this.handleError('getActiveEvents', error)));
  }
  
  getEventById(accountId: number, eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-event-by-id/${accountId}/${eventId}`)
      .pipe(catchError(error => this.handleError('getEventById', error)));
  }

  addEvent(eventData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-event`, eventData)
      .pipe(map(response => response.eventId || response), catchError(error => this.handleError('addEvent', error)));
  }

  updateEvent(eventId: number, eventData: any): Observable<any> {
    console.log('updateEvent', eventData);
    return this.http.put<any>(`${this.apiUrl}/update-event/${eventId}`, eventData)
      .pipe(catchError(error => this.handleError('updateEvent', error)));
  }

  deactivateEvent(accountId: number, eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deactivate-event/${accountId}/${eventId}`)
      .pipe(catchError(error => this.handleError('deactivateEvent', error)));
  }
}
