import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Reporte } from '../../../models/reports';
import { ServReportesJson } from '../../../services/serv-reports-json';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reporte-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reports-crud.html'
})
export class ReporteCrud implements OnInit {
  formReporte!: FormGroup;
  editingId: number | null = null;
  
  tipos = ['Bache', 'Alumbrado', 'Basura', 'Vandalismo'];
  
  private fb = inject(FormBuilder);
  private miServicio = inject(ServReportesJson);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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

    // Detectar si venimos a editar o a crear
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = Number(id);
      this.miServicio.getReporteById(id).subscribe(data => this.formReporte.patchValue(data));
    }
  }

  save(): void {
    if (this.formReporte.invalid) {
      this.formReporte.markAllAsTouched();
      return;
    }

    const data = this.formReporte.value;
    if (this.editingId) {
      this.miServicio.updateReporte({ ...data, id: this.editingId }).subscribe(() => this.router.navigate(['/reporte-list']));
    } else {
      this.miServicio.addReporte(data).subscribe(() => this.router.navigate(['/reporte-list']));
    }
  }

  cancel(): void {
    this.router.navigate(['/reporte-list']);
  }
}
