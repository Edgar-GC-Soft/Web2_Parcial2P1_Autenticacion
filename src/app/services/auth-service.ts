import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// estructuras de datos
export interface Credenciales { // datos enviados al backend
  correo: string;
  contrasena: string;
}

export interface RespuestaLogin { // datos recibidos del backend
  token: string;
  nombre: string;
  correo: string;
  rol: string;
}

export interface UsuarioSesion { // datos que se guardan en el navegador
  nombre: string;
  correo: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiServerUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // localStorage solo existe en el navegador (no en el servidor de SSR)
  private get almacen(): Storage | null {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  }

  // enviar credenciales al backend
  login(credenciales: Credenciales): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${this.apiServerUrl}/login`, credenciales);
  }

  // sesion
  guardarSesion(respuesta: RespuestaLogin): void {
    this.almacen?.setItem('token', respuesta.token);
    this.almacen?.setItem('usuario', JSON.stringify({
      nombre: respuesta.nombre,
      correo: respuesta.correo,
      rol: respuesta.rol
    }));
  }

  obtenerToken(): string | null {
    return this.almacen?.getItem('token') ?? null;
  }

  obtenerUsuario(): UsuarioSesion | null {
    const datos = this.almacen?.getItem('usuario');
    return datos ? JSON.parse(datos) : null;
  }

  cerrarSesion(): void {
    this.almacen?.removeItem('token');
    this.almacen?.removeItem('usuario');
  }

  // lee el contenido del JWT: { id, rol, iat, exp }
  private decodificarToken(token: string): { id: number; rol: string; exp: number } | null {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  // true si hay token y todavia no ha expirado
  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    if (!token) {
      return false;
    }
    const datos = this.decodificarToken(token);
    if (!datos || datos.exp * 1000 < Date.now()) {
      this.cerrarSesion(); // token invalido o vencido
      return false;
    }
    return true;
  }

  // rol
  obtenerRol(): string | null {
    const token = this.obtenerToken();
    return token ? (this.decodificarToken(token)?.rol ?? null) : null;
  }

  tieneRol(rolesPermitidos: string[]): boolean {
    const rol = this.obtenerRol();
    return rol !== null && rolesPermitidos.includes(rol);
  }

  // texto para los mensajes: admin -> administrador
  textoRol(rol: string | null | undefined): string {
    return rol === 'admin' ? 'administrador' : (rol ?? '');
  }
}