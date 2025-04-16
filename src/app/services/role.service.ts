import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl + '/role'; 
  
  constructor(private http: HttpClient)  { }

  getAllRoles(): Observable<any> {
    let url = `${this.apiUrl}/get-all-roles`;
    return this.http.get<any>(url);
  }
  getRoles(): Observable<any> {
    let url = `${this.apiUrl}/get-roles`;
    return this.http.get<any>(url);
  }

  getRolesById(roleId: number): Observable<any> {
    // console.log('roleId param?', roleId);
    let url = `${this.apiUrl}/get-role-by-id`;
    
    const params = new HttpParams().set('roleId', roleId.toString());
    return this.http.get<any>(url, { params });
  }

  updateRole(roleId: number, roleData: any){
    return this.http.put(`${this.apiUrl}/update-role?roleId=${roleId}`, roleData);
  }

  addRole(roleData: any){
    return this.http.post(`${this.apiUrl}/add-role`, roleData);
  }  
}
