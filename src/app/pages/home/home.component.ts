import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OliveService } from '../../services/olive.service';  // Asegúrate de importar el servicio

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  precios: any;  // Variable para almacenar los precios del aceite
  noticias: any[] = []; // Variable para almacenar las noticias sobre aceite como un array

  // Inyectar el servicio OliveService en el constructor
  constructor(private oliveService: OliveService) {}

  // Llamar a los métodos del servicio cuando el componente se inicialice
  ngOnInit(): void {
    this.loadPrecios();
    this.loadNoticias();
  }

  // Método para obtener los precios
  loadPrecios(): void {
    this.oliveService.getPrecios().subscribe({
      next: (data) => {
        this.precios = data;
        console.log('Precios:', this.precios); // Aquí puedes ver los datos en la consola
      },
      error: (err) => console.error('Error al obtener precios', err)
    });
  }

  // Método para obtener las noticias
  loadNoticias(): void {
    this.oliveService.getNoticias().subscribe({
      next: (data) => {
        this.noticias = data;  // Asumimos que 'data' es un array de noticias
        console.log('Noticias:', this.noticias); // Aquí puedes ver los datos en la consola
      },
      error: (err) => console.error('Error al obtener noticias', err)
    });
  }
}
