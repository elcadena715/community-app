import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { Reporte } from '../../../models/reports';
import { ServReportesJson } from '../../../services/serv-reports-json';
import { TableReporteCrud } from '../../shared/table-crud/table-crud';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule, TableReporteCrud], 
  templateUrl: './reports-list.html',
  styleUrls: ['./reports-list.css']
})
export class ReportsList implements OnInit {
  reportes = signal<Reporte[]>([]);
  private miServicio = inject(ServReportesJson);
  private router = inject(Router);

  ngOnInit(): void {
    this.miServicio.getReportes().subscribe(data => this.reportes.set(data));
  }

  nuevoReporte(): void { this.router.navigate(['/reporte-crud']); }
  editarReporte(reporte: Reporte): void { this.router.navigate(['/reporte-crud', reporte.id]); }
  
  eliminarReporte(reporte: Reporte): void {
    if (confirm(`¿Eliminar reporte: ${reporte.titulo}?`)) {
      this.miServicio.deleteReporte(reporte.id!).subscribe(() => {
        this.reportes.update(lista => lista.filter(r => r.id !== reporte.id));
      });
    }
  }
}
