import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  private apiUrl = 'http://localhost:3000/mensaje'; // ajustá según tu backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getMensajes(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.apiUrl}`, { headers });
  }

  enviarMensaje(destinatarioId: string, contenido: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${this.apiUrl}/enviar`, {
      destinatarioId,
      contenido
    }, { headers });
  }

  crearMensajePresidencial(mensaje: {
    issue: string;
    message: string;
  }): Observable<any> {
    console.log('Mensaje a enviar:', mensaje);
    const headers = this.createHeaders();
    return this.http.post(`${this.apiUrl}`, mensaje, { headers });
  }
}
