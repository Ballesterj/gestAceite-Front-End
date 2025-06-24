import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OliveService } from '../../services/olive.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  precios: any;
  noticias: any[] = [];

  constructor(private oliveService: OliveService) {}

  ngOnInit(): void {
    this.loadPrecios();
    this.loadNoticias();
  }

  loadPrecios(): void {
    this.oliveService.getPrecios().subscribe({
      next: (data) => {
        this.precios = data;
        console.log('Precios:', this.precios); 
      },
      error: (err) => console.error('Error al obtener precios', err)
    });
  }

  loadNoticias(): void {
    this.oliveService.getNoticias().subscribe({
      next: (data) => {
        this.noticias = data;  
        console.log('Noticias:', this.noticias); 
      },
      error: (err) => console.error('Error al obtener noticias', err)
    });
  }
}
