import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  imports: [CommonModule, FormsModule]
})

export class RegistroComponent {
  email = '';
  nombre = '';
  telefono = '';
  password = '';

  constructor(@Inject(AuthService) private authService: AuthService, private router: Router) {}

  onSubmit() {
    const userData = {
      email: this.email,
      nombre: this.nombre,
      telefono: this.telefono,
      password: this.password
    };

    this.authService.register(userData).subscribe(
      (response: any) => {
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error('Error en el registro', error);
      }
    );
  }
}
