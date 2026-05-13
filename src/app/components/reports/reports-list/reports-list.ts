import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reporte } from '../../../models/reports';
import { ServReportesJson } from '../../../services/serv-reports-json';
import { TableReporteCrud } from '../../shared/table-crud/table-crud'; 

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableReporteCrud],
  templateUrl: './reports-list.html',
  styleUrls: ['./reports-list.css']
})
export class ReportsList implements OnInit {
  reportes = signal<Reporte[]>([]);
  isModalOpen = signal<boolean>(false); 
  
  formReporte!: FormGroup;
  editingId: number | null = null;
  categorias = ['Alumbrado', 'Mascota', 'Basura', 'Vandalismo', 'Otros'];

  private miServicio = inject(ServReportesJson);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.cargarReportes();
    this.initForm();
  }

  cargarReportes() {
    this.miServicio.getReportes().subscribe(data => this.reportes.set(data));
  }

  private initForm() {
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


  openNew() {
    this.editingId = null;
    this.formReporte.reset({ estado: 'Pendiente', tipoReporte: '' });
    this.isModalOpen.set(true); 
  }

  openEdit(reporte: Reporte) {
    this.editingId = reporte.id!;
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
      this.miServicio.updateReporte({ ...data, id: this.editingId }).subscribe(() => {
        this.cargarReportes();
        this.closeModal(); 
      });
    } else {
      this.miServicio.addReporte(data).subscribe(() => {
        this.cargarReportes();
        this.closeModal(); 
      });
    }
  }

  delete(reporte: Reporte) {
    if (confirm(`¿Eliminar reporte "${reporte.titulo}"?`)) {
      this.miServicio.deleteReporte(reporte.id!).subscribe(() => {
        this.reportes.update(list => list.filter(r => r.id !== reporte.id));
      });
    }
  }
}