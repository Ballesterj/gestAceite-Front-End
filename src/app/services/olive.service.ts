import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OliveService {
  private apiUrlPrecios = 'http://localhost:3000/aceite-precios'; // URL para obtener precios del aceite
  private apiUrlNoticias = 'http://localhost:3000/aceite-noticias'; // URL para obtener noticias sobre aceite

  constructor(private http: HttpClient) {}

  // Obtener los precios del aceite
  getPrecios(): Observable<any> {
    return this.http.get<any>(this.apiUrlPrecios);
  }

  // Obtener las noticias sobre aceite
  getNoticias(): Observable<any> {
    return this.http.get<any>(this.apiUrlNoticias);
  }
}
