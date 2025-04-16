import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HtmlGeneratorService {
  private apiUrl = environment.apiUrl + '/htmlGen'; 
  constructor(private http: HttpClient) { }

  uploadBGImage(file: File): Observable<any> {
    const url = `${this.apiUrl}/upload-bgImage`;
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<any>(url, formData);
  }

  convertToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  getFileAsBlob(filePath: string): Observable<Blob> {
    return this.http.get(filePath, { responseType: 'blob' });
  }
}
