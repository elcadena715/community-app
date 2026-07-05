import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BannerNotice } from '../shared/banner-notice/banner-notice';
import { ServReportesJson } from '../../services/reports/serv-reports-json';
import { Reporte } from '../../models/reports';
import { TableReporteCrud } from '../shared/table-crud/table-crud';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BannerNotice, TableReporteCrud],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private todosLosReportes = signal<Reporte[]>([]);
  private miServicio = inject(ServReportesJson);

  fechaActual: string = '';

  avisoAgua = {
    titulo: 'Corte de agua Programado',
    subtitulo: 'Hoy 14:00 – 16:00',
    icon: 'fa-solid fa-droplet', 
    borderColor: ' ',      
    iconColor: 'var(--primary-color)',
  };

  columnasConfig = [
    { key: 'tipoReporte', label: 'Tipo de Incidente' },
    { key: 'titulo', label: 'Detalle del incidente' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'estado', label: 'Estado' }
  ];

  incidentesActivos = computed(() => {
    return this.todosLosReportes().filter(reporte => 
      reporte.estado === 'Pendiente' || reporte.estado === 'En Revisión' || reporte.estado === 'En revisión'
    );
  });
  
  ngOnInit(): void {
    this.obtenerFecha();
    this.cargarReportesDelSistema();
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

  cargarReportesDelSistema() {
    this.miServicio.getReportes().subscribe(data => {
      this.todosLosReportes.set(data);
    });
  }
}
