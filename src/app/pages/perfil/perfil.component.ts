import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PerfilComponent {
  user: any = {
    id: null,
    name: '',
    email: '',
    password: '********',
    rol: 'agricultor',
    cooperativa: null,
    phone: '',
  };

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.obtenerPerfil();
  }

  guardarPerfil() {
    this.userService.updateUserProfile(this.user).subscribe(response => {
      console.log('Perfil actualizado', response);
    }, error => {
      console.error('Error actualizando el perfil', error);
    });
  }

  obtenerPerfil() {
    this.userService.getUserProfile().subscribe(response => {
      this.user = response;
    }, error => {
      console.error('Error obteniendo el perfil', error);
    });
  }
}
