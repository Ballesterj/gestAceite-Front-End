import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';
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
    MatButtonModule
  ],
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss']
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
        console.log('Mensajes cargados:', this.mensajes);
      },
      error: (err) => {
        console.error('Error al cargar mensajes:', err);
      }
    });
  }
}