import { Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Reporte } from '../../../models/reports';
import { ServReportesJson } from '../../../services/serv-reports-json';

declare const bootstrap: any; 

@Component({
  selector: 'app-reporte-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reports-crud.html',
  styleUrls: ['./reports-crud.css']
})
export class ReporteCrud implements OnInit {
  formReporte!: FormGroup;
  editingId: number | null = null;
  categorias = ['Ruido', 'Mascota', 'Parqueo', 'Otros'];
  
  @ViewChild('modalElement') modalElement!: ElementRef;
  modalInstance: any;

  @Output() recargar = new EventEmitter<void>();
  
  private fb = inject(FormBuilder);
  private miServicio = inject(ServReportesJson);

  ngOnInit(): void {
    this.formReporte = this.fb.group({
      tipoReporte: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      ubicacion: ['', Validators.required],
      evidencia: [''],
      estado: ['Pendiente']
    });
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  openNew(): void {
    this.editingId = null;
    this.formReporte.reset({ estado: 'Pendiente' });
    this.modalInstance.show();
  }

  openEdit(reporte: Reporte): void {
    this.editingId = reporte.id!;
    this.formReporte.patchValue(reporte);
    this.modalInstance.show();
  }

  cerrarModal(): void {
    this.modalInstance.hide();
  }

  save(): void {
    if (this.formReporte.invalid) {
      this.formReporte.markAllAsTouched();
      return;
    }

    const data = this.formReporte.value;
    if (this.editingId) {
      this.miServicio.updateReporte({ ...data, id: this.editingId }).subscribe(() => {
        this.recargar.emit(); // Avisamos que recargue la tabla
        this.cerrarModal();
      });
    } else {
      this.miServicio.addReporte(data).subscribe(() => {
        this.recargar.emit(); // Avisamos que recargue la tabla
        this.cerrarModal();
      });
    }
  }
}
