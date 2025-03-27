import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MensajesComponent } from './pages/mensajes/mensajes.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { FincasComponent } from './pages/fincas/fincas.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'mensajes', component: MensajesComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'fincas', component: FincasComponent, canActivate: [AuthGuard] },
  { path: 'estadisticas', component: EstadisticasComponent, canActivate: [AuthGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
