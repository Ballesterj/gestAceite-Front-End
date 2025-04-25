import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, CommonModule } from '@angular/common';
import { MensajesService } from '../../services/mensajes.service';
@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [
    NgFor, 
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss'],
})
export class MensajesComponent implements OnInit {
  mensajes: any[] = [];

  constructor(private mensajesService: MensajesService) {}

  ngOnInit(): void {
    this.cargarMensajes();
  }
  cargarMensajes(): void {
    const contactoId = '123'; // 🔁 temporal — lo reemplazarás con el ID del contacto real seleccionado
    this.mensajesService.getMensajes().subscribe({
      next: (data) => {
        this.mensajes = data;
  
        // Primero, ordenamos los mensajes de más reciente a más antiguo
        this.mensajes.sort((a, b) => {
          const dateA = Date.parse(a.sending_date); // Convierte a milisegundos
          const dateB = Date.parse(b.sending_date); // Convierte a milisegundos
          return dateB - dateA; // Ordena de más reciente a más antiguo
        });
  
        // Luego, formateamos la fecha y la añadimos como propiedad "hora" en cada mensaje
        this.mensajes.forEach(mensaje => {
          const sendingDate = new Date(mensaje.sending_date);
          
          // Extraemos el día, mes y año
          const day = String(sendingDate.getDate()).padStart(2, '0'); // Aseguramos que el día tenga dos dígitos
          const month = String(sendingDate.getMonth() + 1).padStart(2, '0'); // El mes empieza desde 0 (enero)
          const year = sendingDate.getFullYear();
  
          // Asignamos el valor formateado a la propiedad hora
          mensaje.hora = `${day}/${month}/${year}`;
        });
  
        console.log('Mensajes cargados:', this.mensajes);
      },
      error: (err) => {
        console.error('Error al cargar mensajes:', err);
      }
    });
  }  

  mensajeSeleccionado: any = null;

  seleccionarMensaje(mensaje: any) {
    this.mensajeSeleccionado = mensaje;
  }

}