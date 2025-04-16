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

  /**
   * Trae los mensajes con un contacto específico
   */
  getMensajes(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.apiUrl}`,{ headers });
  }

  /**
   * Envia un mensaje a un contacto
   */
  enviarMensaje(destinatarioId: string, contenido: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${this.apiUrl}/enviar`, {
      destinatarioId,
      contenido
    }, { headers });
  }
}
