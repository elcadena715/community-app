import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reporte } from '../../../models/reports';
import { ServReportesJson } from '../../../services/reports/serv-reports-json';
import { TableReporteCrud } from '../../shared/table-crud/table-crud'; 
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog';
import { ReportsView } from '../reports-view/reports-view';
import { ServFollowsJson } from '../../../services/follows/serv-follows-json';
import { ReporteCrud } from '../reports-crud/reports-crud';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule, TableReporteCrud, AppDialogComponent, ReportsView, ReporteCrud],
  templateUrl: './reports-list.html',
  styleUrls: ['./reports-list.css']
})
export class ReportsList implements OnInit {
  reportes = signal<Reporte[]>([]);
  isSuccessModalOpen = signal<boolean>(false);
  exitoConfig = signal<any>(null);

  isViewOpen = signal<boolean>(false);      
  selectedReport = signal<any>(null);       
  seguimientos = signal<any[]>([]);

  private servFollows = inject(ServFollowsJson);
  reporteAEliminar: Reporte | null = null;

  private miServicio = inject(ServReportesJson);

  @ViewChild(ReporteCrud) crudModal!: ReporteCrud;

  ngOnInit(): void {
    this.cargarReportes();

    const configGuardada = localStorage.getItem('ultimoExitoConfig');
    if (configGuardada) {
      this.exitoConfig.set(JSON.parse(configGuardada));
      this.isSuccessModalOpen.set(true);
    }

    this.servFollows.getSeguimientos().subscribe(data => this.seguimientos.set(data));
  }

  cargarReportes(eventoHijo?: any) {
    this.miServicio.getReportes().subscribe(data => {
      this.reportes.set(data);
      if (eventoHijo) {
        if (eventoHijo.accion === 'EDIT') {
          this.mostrarFeedback('¡Actualizado con Éxito!', 'La información ha sido actualizada.', eventoHijo.reporte, 'SUCCESS');
        } else if (eventoHijo.accion === 'CREATE') {
          this.mostrarFeedback('¡Incidente Ingresado con Éxito!', 'Hemos recibido tu reporte correctamente.', eventoHijo.reporte, 'SUCCESS');
        }
      }
    });
  }

  openNew() {
    this.crudModal.openNew();
  }

  openEdit(reporte: Reporte) {
    this.crudModal.openEdit(reporte);
  }

  delete(reporte: Reporte) {
    this.reporteAEliminar = reporte;
    this.mostrarFeedback(
      '¿Estás seguro?', 
      '¿Deseas eliminar permanentemente este incidente?', 
      reporte, 
      'CONFIRM'
    );
  }

  cerrarModalExito() {
    this.isSuccessModalOpen.set(false);
    localStorage.removeItem('mostrarExito');
    localStorage.removeItem('ultimoReporte');
    localStorage.removeItem('ultimoExitoConfig');
  }

  confirmarAccionDialog() {
    if (this.reporteAEliminar) {
      this.miServicio.deleteReporte(this.reporteAEliminar.id!).subscribe(() => {
        this.reportes.update(list => list.filter(r => r.id !== this.reporteAEliminar?.id));
        this.cerrarModalExito();
        this.reporteAEliminar = null;
      });
    }
  }

  private mostrarFeedback(tituloParam: string, subtituloParam: string, reporteParam: any, type: 'SUCCESS' | 'CONFIRM') {
    
    const isConfirm = type === 'CONFIRM';

    const config = {
      titulo: tituloParam,            
      subtitulo: subtituloParam,      
      nombreItem: 'Reporte',
      reporte: reporteParam,          
      footerText: isConfirm ? 'Esta acción no se puede deshacer' : 'Gracias por contribuir a la comunidad.',
      iconFooter: isConfirm ? '⚠️' : '🤝',
      confirmText: isConfirm ? 'Sí, Eliminar' : 'Entendido',
      showCancel: isConfirm, 
      btnClass: isConfirm ? 'btn-danger' : 'btn-secondary-custom',
      cancelText: 'Volver'
    };

    if (!isConfirm) {
      localStorage.setItem('ultimoExitoConfig', JSON.stringify(config));
    }
    
    this.exitoConfig.set(config);
    this.isSuccessModalOpen.set(true);
  }

  verHistorial(reporte: any) {
    this.selectedReport.set(reporte);
    this.isViewOpen.set(true);
  }
}