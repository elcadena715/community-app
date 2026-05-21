import { Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Evento } from '../../../models/events';
import { ServEventsJson } from '../../../services/events/serv-events-json';

declare const bootstrap: any;

@Component({
  selector: 'app-events-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './events-crud.html',
  styleUrls: ['./events-crud.css']
})
export class EventsCrud implements OnInit {
  formEvento!: FormGroup;
  editingId: number | null = null;
  categorias = ['Deportivo', 'Social', 'Cultural', 'Reunión'];

  @ViewChild('modalElement')
  modalElement!: ElementRef;

  modalInstance: any;

  @Output()
  recargar = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private miServicio = inject(ServEventsJson);

  ngOnInit(): void {
    this.formEvento = this.fb.group({
      tipoEvento: ['', Validators.required],
      titulo: ['', [ Validators.required, Validators.minLength(5)]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      ubicacion: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      estado: ['Próximo']
    });
  }

  ngAfterViewInit(): void {
    this.modalInstance =
      new bootstrap.Modal(this.modalElement.nativeElement);
  }

  openNew(): void {
    this.editingId = null;
    this.formEvento.reset({
      estado: 'Próximo'
    });
    this.modalInstance.show();
  }

  openEdit(evento: Evento): void {
    this.editingId = evento.id!;
    this.formEvento.patchValue(evento);
    this.modalInstance.show();
  }

  cerrarModal(): void {
    this.modalInstance.hide();
  }

  save(): void {
    if (this.formEvento.invalid) {
      this.formEvento.markAllAsTouched();
      return;
    }

    const data = this.formEvento.value;
    if (this.editingId) {
      this.miServicio.updateEvento({
        ...data,
        id: this.editingId
      }).subscribe(() => {
        this.recargar.emit();
        this.cerrarModal();
      });

    } else {
      this.miServicio.addEvento(data).subscribe(() => {
        this.recargar.emit();
        this.cerrarModal();
      });
    }
  }
}