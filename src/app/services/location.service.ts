import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { LoggerService } from './logger.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = environment.apiUrl + '/location';

  constructor(private http: HttpClient, private logger: LoggerService) {}

  getLocations(status: string): Observable<any> {
    let url = `${this.apiUrl}`;
    switch (status) {
      case 'Active':
        url = `${this.apiUrl}/get-active-locations`;
        break;
      case 'InActive':
        url = `${this.apiUrl}/get-inactive-locations`;
        break;
      default:
        url = `${this.apiUrl}/get-locations`;
        break;
    }

    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.logger.logError('Error fetching locations', error);
        throw error;
      })
    );
  }


  getLocationsById(locationId: number): Observable<any> {
    const url = `${this.apiUrl}/get-locations-by-id/${locationId}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.logger.logError('Error fetching locations by Id', error);
        throw error;
      })
    );
  }

  addLocation(locationData: any): Observable<any> {
    const url = `${this.apiUrl}/add-location`;
    return this.http.post<any>(url, locationData).pipe(
      catchError(error => {
        this.logger.logError('Error Adding Location', error);
        throw error;
      })
    );
  }
  updateLocation(locationId: number, locationData: any) {
    console.log('locationData', locationData);
    return this.http.put(`${this.apiUrl}/update-location/${locationId}`, { locationData: JSON.stringify(locationData) }).pipe(
      catchError(error => {
        this.logger.logError('Error Updating Location', error);
        throw error;
      })
    );
  }
  
}
