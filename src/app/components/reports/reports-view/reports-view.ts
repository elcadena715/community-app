import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-reports-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-view.html',
  styleUrls: ['./reports-view.css']
})
export class ReportsView {
  @Input() isOpen = false;
  @Input() todosLosSeguimientos: any[] = [];
  @Output() close = new EventEmitter<void>();

  reporteSignal = signal<any>(null);

  @Input() set reporte(value: any) {
    this.reporteSignal.set(value);
  }

  get reporte(): any {
    return this.reporteSignal();
  }

  hitosTimeline = computed(() => {
    const rep = this.reporteSignal();
    if (!rep) return [];

    const hitoApertura = {
      id: 'apertura-' + rep.id,
      estado: 'Pendiente',
      autoridad: 'Incidente Reportado',
      mensaje: `Tipo de Reporte "${rep.tipoReporte}". Ubicación especificada: ${rep.ubicacion}.`,
      fecha: rep.fecha,
      hora: rep.hora
    };

    const seguimientosFiltrados = this.todosLosSeguimientos.filter(s => 
      s.idReporte === rep.id
    );

    return [hitoApertura, ...seguimientosFiltrados];
  });

  cerrar() {
    this.close.emit();
  }
}
