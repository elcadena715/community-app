import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServAuth {

  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:5031/api/Auth'; 
  private tokenKey = 'token';

  currentUser = signal<any>(null);

  constructor() {
    this.restaurarSesion();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { Email: email, Password: password }).pipe(
      tap(res => {
        this.saveToken(res.token);
        this.restaurarSesion();
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.clear();
    this.currentUser.set(null); 
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded['role'] || null;
  }

  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded['email'] || null; 
  }

  hasRole(role: string): boolean {
  return this.currentUser()?.rol === role;
  }

  private restaurarSesion() {
    if (this.isLoggedIn()) {
    const email = this.getEmail();
    const rol = this.getUserRole();

    if (email && rol) {
      this.currentUser.set({
        email: email,
        rol: rol
      });
    } else {
      this.logout();
    }
  }
  }

}
