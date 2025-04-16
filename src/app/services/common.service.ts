import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = environment.apiUrl + '/common'; 

  constructor(private http: HttpClient)  { }

  getCityState(zip:number): Observable<any> {
    const url = `${this.apiUrl}/get-address-info-by-zip/${zip}`;
    return this.http.get<any>(url);
  }
}
