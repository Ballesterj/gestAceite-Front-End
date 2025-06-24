import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/socio';

  constructor(private http: HttpClient, private authService: AuthService) {}

    private createHeaders(): HttpHeaders {
      const token = this.authService.getToken();
      let headers = new HttpHeaders();
      
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    }

    updateUserProfile(userData: any): Observable<any> {
      const headers = this.createHeaders();
      return this.http.put(`${this.apiUrl}/${userData.id}`, userData, { headers });
    }
  
    getUserProfile(): Observable<any> {
      const headers = this.createHeaders();
      return this.http.get(`${this.apiUrl}/me`, { headers });
    }
}
