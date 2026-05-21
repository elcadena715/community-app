import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Seguimiento } from '../../../models/follow';

import { Reporte } from '../../../models/reports';

import { ServFollowsJson } from '../../../services/follows/serv-follows-json';

import { ServReportesJson } from '../../../services/reports/serv-reports-json';

@Component({
  selector: 'app-follows-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './follows-crud.html',
  styleUrls: ['./follows-crud.css'],
})
export class FollowsCrud implements OnInit {
  formFollow!: FormGroup;

  editingId: number | null = null;

  reportes: Reporte[] = [];

  isModalOpen = signal<boolean>(false);
  @Output()
  success = new EventEmitter<any>();

  estados: Array<'Pendiente' | 'En revisión' | 'Resuelto'> = [
    'Pendiente',
    'En revisión',
    'Resuelto',
  ];

  private fb = inject(FormBuilder);

  private miServicio = inject(ServFollowsJson);

  private reportesService = inject(ServReportesJson);

  ngOnInit(): void {
    this.formFollow = this.fb.group({
      idReporte: [0, Validators.min(1)],

      tituloReporte: [''],

      estado: ['Pendiente', Validators.required],

      autoridad: ['', Validators.required],

      mensaje: ['', [Validators.required, Validators.minLength(10)]],

      fecha: ['', Validators.required],

      hora: ['', Validators.required],

      publicar: [true],
    });

    this.cargarReportes();
  }

  cargarReportes(): void {
    this.reportesService.getReportes().subscribe((data) => {
      this.reportes = data;
    });
  }

  onReporteChange(): void {
    const reporteId = this.formFollow.value.idReporte;

    const reporte = this.reportes.find((r) => r.id === reporteId);

    if (reporte) {
      this.formFollow.patchValue({
        tituloReporte: reporte.titulo,
      });
    }
  }

  openNew(): void {
    this.editingId = null;

    this.formFollow.reset({
      idReporte: 0,

      tituloReporte: '',

      estado: 'Pendiente',

      autoridad: '',

      mensaje: '',

      fecha: '',

      hora: '',

      publicar: true,
    });

    this.isModalOpen.set(true);
  }

  openEdit(seguimiento: Seguimiento): void {
    this.editingId = seguimiento.id!;

    this.formFollow.patchValue(seguimiento);

    this.isModalOpen.set(true);
  }

  cerrarModal(): void {
    this.isModalOpen.set(false);
  }

  save(): void {
    if (this.formFollow.invalid) {
      this.formFollow.markAllAsTouched();
      return;
    }

    const data = this.formFollow.value;

    if (this.editingId) {
      this.miServicio
        .updateSeguimiento({
          ...data,
          id: this.editingId,
        })
        .subscribe((res) => {
          this.cerrarModal();

          this.success.emit({
            titulo: '¡Seguimiento Actualizado!',
            subtitulo: 'El seguimiento fue actualizado correctamente.',
            reporte: res,
            type: 'SUCCESS',
          });
        });
    } else {
      this.miServicio.addSeguimiento(data).subscribe((res) => {
        this.cerrarModal();

        this.success.emit({
          titulo: '¡Seguimiento Guardado!',
          subtitulo: 'La actualización fue registrada correctamente.',
          reporte: res,
          type: 'SUCCESS',
        });
      });
    }
  }
}

