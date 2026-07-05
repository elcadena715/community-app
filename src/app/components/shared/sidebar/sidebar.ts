import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ServAuth } from '../../../services/serv-auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isComunidadOpen = signal<boolean>(false);
  private authService = inject(ServAuth);

  toggleComunidad() {
    this.isComunidadOpen.update(state => !state);
  }
  onCerrarSesion(event: Event) {
  event.preventDefault(); 
  this.authService.logout(); 
}
}
