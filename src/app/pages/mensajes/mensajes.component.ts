import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, CommonModule } from '@angular/common';
import { MensajesService } from '../../services/mensajes.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

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
    CommonModule,
    FormsModule
  ],
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss'],
})
export class MensajesComponent implements OnInit {
  mensajes: any[] = [];
  mensajeSeleccionado: any = null;

  mostrarModalMensaje: boolean = false;

  user: any = {
    id: null,
    name: '',
    cooperativa: null,
    president: false,
  };

  nuevoMensaje = {
    issue: '',
    message: '',
  };

  constructor(private mensajesService: MensajesService, private userService: UserService) {}

  ngOnInit(): void {
    this.cargarMensajes();
    this.obtenerPerfil();
  }

  cargarMensajes(): void {
    const contactoId = '123';
    this.mensajesService.getMensajes().subscribe({
      next: (data) => {
        this.mensajes = data;

        this.mensajes.sort((a, b) => {
          const dateA = Date.parse(a.sending_date);
          const dateB = Date.parse(b.sending_date);
          return dateB - dateA;
        });

        this.mensajes.forEach(mensaje => {
          const sendingDate = new Date(mensaje.sending_date);
          const day = String(sendingDate.getDate()).padStart(2, '0');
          const month = String(sendingDate.getMonth() + 1).padStart(2, '0');
          const year = sendingDate.getFullYear();
          mensaje.hora = `${day}/${month}/${year}`;
        });

        console.log('Mensajes cargados:', this.mensajes);
      },
      error: (err) => {
        console.error('Error al cargar mensajes:', err);
      }
    });
  }

  seleccionarMensaje(mensaje: any) {
    this.mensajeSeleccionado = mensaje;
  }

  abrirModalMensaje() {
    this.nuevoMensaje = {
      issue: '',
      message: '',
    };
    this.mostrarModalMensaje = true;
  }

  cerrarModalMensaje() {
    this.mostrarModalMensaje = false;
  }

  guardarMensaje() {
    this.mensajesService.crearMensajePresidencial(this.nuevoMensaje).subscribe({
      next: (mensajeCreado) => {
        this.mensajes.unshift({
          ...mensajeCreado,
          hora: new Date().toLocaleDateString()
        });
        this.cerrarModalMensaje();
      },
      error: (err) => {
        console.error('Error al enviar el mensaje:', err);
      }
    });
  }
    obtenerPerfil() {
    this.userService.getUserProfile().subscribe(response => {
      this.user = response;
      this.user.rol = (this.user.rol || 'Agricultor').charAt(0).toUpperCase() + (this.user.rol || 'Agricultor').slice(1);
    }, error => {
      console.error('Error obteniendo el perfil', error);
    });
  }
}
