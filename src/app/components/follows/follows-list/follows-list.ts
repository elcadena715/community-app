import { Component, ViewChild, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seguimiento } from '../../../models/follow';
import { ServFollowsJson } from '../../../services/follows/serv-follows-json';
import { TableReporteCrud } from '../../shared/table-crud/table-crud';
import { FollowsCrud } from '../follows-crud/follows-crud';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog';

@Component({
  selector: 'app-follows-list',
  standalone: true,
  imports: [CommonModule, TableReporteCrud, FollowsCrud, AppDialogComponent],
  templateUrl: './follows-list.html',
  styleUrls: ['./follows-list.css'],
})
export class FollowsList implements OnInit {
  seguimientos = signal<Seguimiento[]>([]);

  @ViewChild(FollowsCrud)
  crudComponent!: FollowsCrud;

  private miServicio = inject(ServFollowsJson);
  isSuccessModalOpen = signal<boolean>(false);

  exitoConfig = signal<any>(null);
  seguimientoAEliminar: Seguimiento | null = null;
  ngOnInit(): void {
    this.cargarSeguimientos();
    const configGuardada = localStorage.getItem('ultimoExitoConfigFollow');
    if (configGuardada) {
      this.exitoConfig.set(JSON.parse(configGuardada));
      this.isSuccessModalOpen.set(true);
    }
  }

  cargarSeguimientos() {
    this.miServicio.getSeguimientos().subscribe((data) => this.seguimientos.set(data));
  }

  openNew() {
    this.crudComponent.openNew();
  }

  openEdit(seguimiento: Seguimiento) {
    this.crudComponent.openEdit(seguimiento);
  }

  delete(seguimiento: Seguimiento) {
    this.seguimientoAEliminar = seguimiento;

    this.mostrarFeedback(
      '¿Eliminar Seguimiento?',

      '¿Deseas eliminar este seguimiento?',

      seguimiento,

      'CONFIRM',
    );
  }
  confirmarAccionDialog() {
    if (this.seguimientoAEliminar) {
      this.miServicio.deleteSeguimiento(this.seguimientoAEliminar.id!).subscribe(() => {
        this.seguimientos.update((list) =>
          list.filter((s) => s.id !== this.seguimientoAEliminar?.id),
        );

        this.cerrarModalExito();

        this.seguimientoAEliminar = null;
      });
    }
  }
  cerrarModalExito() {
    this.isSuccessModalOpen.set(false);
    localStorage.removeItem('ultimoExitoConfigFollow');

  }
  private mostrarFeedback(
    tituloParam: string,
    subtituloParam: string,
    seguimientoParam: any,
    type: 'SUCCESS' | 'CONFIRM',
  ) {
    const isConfirm = type === 'CONFIRM';

    const config = {
      titulo: tituloParam,

      subtitulo: subtituloParam,

      nombreItem: 'Seguimiento',

      reporte: seguimientoParam,

      footerText: isConfirm
        ? 'Esta acción no se puede deshacer'
        : 'Seguimiento guardado correctamente.',

      iconFooter: isConfirm ? '⚠️' : '📋',

      confirmText: isConfirm ? 'Sí, Eliminar' : 'Entendido',

      showCancel: isConfirm,

      btnClass: isConfirm ? 'btn-danger' : 'btn-secondary-custom',

      cancelText: 'Volver',
    };

    this.exitoConfig.set(config);

    this.isSuccessModalOpen.set(true);
  }
  mostrarFeedbackDesdeCrud(event: any) {
    const config = {
      titulo: event.titulo,
      subtitulo: event.subtitulo,
      nombreItem: 'Seguimiento',
      reporte: event.reporte,
      footerText: 'Seguimiento guardado correctamente.',
      iconFooter: '📋',
      confirmText: 'Entendido',
      showCancel: false,
      btnClass: 'btn-secondary-custom',
      cancelText: 'Volver',
    };
    localStorage.setItem('ultimoExitoConfigFollow', JSON.stringify(config));

    this.exitoConfig.set(config);
    this.isSuccessModalOpen.set(true);
    this.seguimientos.update(actuales => {
      const index = actuales.findIndex(s => s.id === event.reporte.id);
      if (index !== -1) {
        return actuales.map(s => s.id === event.reporte.id ? event.reporte : s);
      }
      return [...actuales, event.reporte];
    });
  }
}
