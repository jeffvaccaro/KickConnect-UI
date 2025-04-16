import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = environment.apiUrl + '/skill'; 
  
  constructor(private http: HttpClient)  { }

  getAllSkills(): Observable<any> {
    let url = `${this.apiUrl}/get-all-skills`;
    return this.http.get<any>(url);
  }
  
  getSkillsById(skillId: number): Observable<any> {
    let url = `${this.apiUrl}/get-skill-by-id`;
    
    const params = new HttpParams().set('skillId', skillId.toString());
    return this.http.get<any>(url, { params });
  }

  updateSkill(skillId: number, skillData: any){
    return this.http.put(`${this.apiUrl}/update-skill?skillId=${skillId}`, skillData);
  }

  addSkill(skillData: any){
    return this.http.post(`${this.apiUrl}/add-Skill`, skillData);
  }  
}
