import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reporte } from '../../../models/reports';
import { ServReportesJson } from '../../../services/reports/serv-reports-json';
import { TableReporteCrud } from '../../shared/table-crud/table-crud'; 
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog';
import { ReportsView } from '../reports-view/reports-view';
import { ServFollowsJson } from '../../../services/follows/serv-follows-json';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableReporteCrud, AppDialogComponent, ReportsView],
  templateUrl: './reports-list.html',
  styleUrls: ['./reports-list.css']
})
export class ReportsList implements OnInit {
  reportes = signal<Reporte[]>([]);
  isModalOpen = signal<boolean>(false); 
  fotoSeleccionada = signal<string | null>(null);
  isSuccessModalOpen = signal<boolean>(false);
  exitoConfig = signal<any>(null);

  isViewOpen = signal<boolean>(false);      
  selectedReport = signal<any>(null);       
  seguimientos = signal<any[]>([]);

  private servFollows = inject(ServFollowsJson);
  
  formReporte!: FormGroup;
  editingId: number | null = null;
  reporteAEliminar: Reporte | null = null;
  categorias = ['Alumbrado', 'Mascota', 'Basura', 'Vandalismo', 'Ruido','Otros'];

  private miServicio = inject(ServReportesJson);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.cargarReportes();
    this.initForm();

    const configGuardada = localStorage.getItem('ultimoExitoConfig');

    if (configGuardada) {
      this.exitoConfig.set(JSON.parse(configGuardada));
      this.isSuccessModalOpen.set(true);
    }

    this.servFollows.getSeguimientos().subscribe(data => this.seguimientos.set(data));
  }

  cargarReportes() {
    this.miServicio.getReportes().subscribe(data => this.reportes.set(data));
  }

  private initForm() {
    this.formReporte = this.fb.group({
      tipoReporte: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(70)]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      ubicacion: ['', Validators.required],
      evidencia: ['Sin evidencia'],
      estado: ['Pendiente']
    });
  }


  openNew() {
    this.editingId = null;
    this.fotoSeleccionada.set(null);
    this.formReporte.reset({ estado: 'Pendiente', tipoReporte: '', evidencia: 'Sin evidencia' });
    this.isModalOpen.set(true); 
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      this.fotoSeleccionada.set(file.name);
      this.formReporte.patchValue({ evidencia: file.name });
    }
  }

  removerFoto() {
    this.fotoSeleccionada.set(null);
    this.formReporte.patchValue({ evidencia: 'Sin evidencia' });
  }

  openEdit(reporte: Reporte) {
    this.editingId = reporte.id!;
    if (reporte.evidencia && reporte.evidencia !== 'Sin evidencia') {
      this.fotoSeleccionada.set(reporte.evidencia);
    } else {
      this.fotoSeleccionada.set(null);
    }
    this.formReporte.patchValue(reporte);
    this.isModalOpen.set(true); 
  }

  closeModal() {
    this.isModalOpen.set(false); 
  }

  save() {
    if (this.formReporte.invalid) {
      this.formReporte.markAllAsTouched();
      return;
    }

    const data = this.formReporte.value;

    if (this.editingId) {
      this.miServicio.updateReporte({ ...data, id: this.editingId }).subscribe((res) => {
        this.reportes.update(list => list.map(r => r.id === this.editingId ? res : r));
        this.mostrarFeedback('¡Actualizado con Éxito!', 'La información ha sido actualizada.', res, 'SUCCESS');
      });
    } else {
      this.miServicio.addReporte(data).subscribe((newReporte) => {
        this.reportes.update(actuales => [...actuales, newReporte]);
        this.mostrarFeedback('¡Incidente Ingresado con Éxito!', 'Hemos recibido tu reporte correctamente.', newReporte, 'SUCCESS');
      });
    }
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
    this.closeModal();
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