import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrl + '/account';
  
  constructor(private http: HttpClient, private logger: LoggerService) {}

  getAccounts(): Observable<any> {
    const url = `${this.apiUrl}/get-accounts`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.logger.logError('Error fetching accounts', error);
        throw error;
      })
    );
  }

  addAccount(accountData: any): Observable<any> {
    const url = `${this.apiUrl}/add-account`;
    console.log('accountData',accountData);
    return this.http.post<any>(url, accountData).pipe(
      catchError(error => {
        this.logger.logError('Error Adding Account', error);
        throw error;
      })
    );
  }
}
