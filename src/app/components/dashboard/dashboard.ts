import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BannerNotice } from '../shared/banner-notice/banner-notice';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BannerNotice],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  fechaActual: string = '';

  avisoAgua = {
    titulo: 'Corte de agua Programado',
    subtitulo: 'Hoy 14:00 – 16:00',
    icon: 'fa-solid fa-droplet', 
    borderColor: ' ',      
    iconColor: 'var(--primary-color)',
  };

  ngOnInit(): void {
    this.obtenerFecha();
  }

  obtenerFecha() {
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    this.fechaActual = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  }
}
