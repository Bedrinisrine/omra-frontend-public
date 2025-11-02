import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientFeedbackService {
  private apiUrl = `${environment.apiUrl}/hotels/feedback/`; // GET
  private submitUrl = `${environment.apiUrl}/hotels/feedback/submit/`; // POST

  constructor(private http: HttpClient) {}

  getFeedback(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  submitFeedback(formData: FormData): Observable<any> {
    return this.http.post<any>(this.submitUrl, formData);
  }
} 