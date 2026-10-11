import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth-service';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  usuario: UsuarioSesion | null;
  rolTexto: string;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.obtenerUsuario();
    this.rolTexto = this.authService.textoRol(this.usuario?.rol);
  }

  // cierra sesion y redirige a login
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}