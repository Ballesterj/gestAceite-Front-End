import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OliveService {
  private apiUrlPrecios = 'http://localhost:3000/aceite-precios';
  private apiUrlNoticias = 'http://localhost:3000/aceite-noticias';

  constructor(private http: HttpClient) {}

  getPrecios(): Observable<any> {
    return this.http.get<any>(this.apiUrlPrecios);
  }

  getNoticias(): Observable<any> {
    return this.http.get<any>(this.apiUrlNoticias);
  }
}
