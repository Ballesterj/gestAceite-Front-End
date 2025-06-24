import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FincasService {

  private apiUrl = 'http://localhost:3000/finca';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  getUserFincas(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.apiUrl}/socio`, { headers });
  }

  crearFinca(finca: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${this.apiUrl}`, finca, { headers });
  }

  actualizarFinca(finca: any): Observable<any> {
    const headers = this.createHeaders();
    const { _id, __v, ...fincaSinId } = finca;

    return this.http.patch(`${this.apiUrl}/${finca._id}`, fincaSinId, { headers });
  }
}
