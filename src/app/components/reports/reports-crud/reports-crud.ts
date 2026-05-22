import { Component, ElementRef, EventEmitter, inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reporte } from '../../../models/reports';
import { ServReportesJson } from '../../../services/reports/serv-reports-json';


declare const bootstrap: any;
@Component({
  selector: 'app-reporte-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reports-crud.html',
  styleUrls: ['./reports-crud.css']
})
export class ReporteCrud implements OnInit {
  @Output() recargar = new EventEmitter<any>();

  @ViewChild('modalElement') modalElement!: ElementRef;
  modalInstance: any;

  
  isModalOpen = signal<boolean>(false); 
  evidenciaSeleccionada = signal<string | null>(null);

  formReporte!: FormGroup;
  editingId: number | null = null;
  categorias = ['Alumbrado', 'Mascota', 'Basura', 'Vandalismo', 'Ruido', 'Otros'];

  private miServicio = inject(ServReportesJson);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  private initForm() {
    this.formReporte = this.fb.group({
      tipoReporte: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(70)]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      ubicacion: ['', Validators.required],
      evidencia: [null, Validators.required],
      estado: ['Pendiente']
    });
  }

  openNew() {
    this.editingId = null;
    this.evidenciaSeleccionada.set(null);
    this.formReporte.reset({ estado: 'Pendiente', tipoReporte: '', evidencia: null });
    this.isModalOpen.set(true); 
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.evidenciaSeleccionada.set(file.name);
      this.formReporte.patchValue({ evidencia: file.name });
      this.formReporte.get('evidencia')?.markAsTouched();
    }
  }

  esVideo(nombreArchivo: string | null): boolean {
    if (!nombreArchivo) return false;
    const ext = nombreArchivo.split('.').pop()?.toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext || '');
  }

  removerEvidencia() {
    this.evidenciaSeleccionada.set(null);
    this.formReporte.patchValue({ evidencia: null });
    this.formReporte.get('evidencia')?.markAsTouched();
  }

  openEdit(reporte: Reporte) {
    this.editingId = reporte.id!;
    if (reporte.evidencia && reporte.evidencia !== 'Sin evidencia') {
      this.evidenciaSeleccionada.set(reporte.evidencia);
    } else {
      this.evidenciaSeleccionada.set(null);
    }
    this.formReporte.patchValue(reporte);
    this.isModalOpen.set(true); 
    this.modalInstance.show();
  }

  closeModal() {
    this.isModalOpen.set(false); 
    this.modalInstance.hide();
  }

  save() {
    if (this.formReporte.invalid) {
      this.formReporte.markAllAsTouched();
      return;
    }

    const data = this.formReporte.value;

    if (this.editingId) {
      this.miServicio.updateReporte({ ...data, id: this.editingId }).subscribe((res) => {
        this.recargar.emit({ accion: 'EDIT', reporte: res });
        this.closeModal();
      });
    } else {
      this.miServicio.addReporte(data).subscribe((newReporte) => {
        this.recargar.emit({ accion: 'CREATE', reporte: newReporte });
        this.closeModal();
      });
    }
  }
}