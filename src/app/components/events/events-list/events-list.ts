import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Evento } from '../../../models/events';
import { ServEventsJson } from '../../../services/events/serv-events-json';
import { TableReporteCrud } from '../../shared/table-crud/table-crud';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, TableReporteCrud, AppDialogComponent ],
  templateUrl: './events-list.html',
  styleUrls: ['./events-list.css']
})

export class EventsList implements OnInit {
  eventos = signal<Evento[]>([]);
  isModalOpen = signal<boolean>(false);
  isSuccessModalOpen = signal<boolean>(false);
  exitoConfig = signal<any>(null);
  formEvento!: FormGroup;
  editingId: number | null = null;
  eventoAEliminar: Evento | null = null;
  categorias = ['Deportivo', 'Social', 'Cultural', 'Reunión'];

  private miServicio = inject(ServEventsJson);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.cargarEventos();
    this.initForm();

    const configGuardada =
      localStorage.getItem('ultimoExitoConfig');

    if (configGuardada) {
      this.exitoConfig.set(JSON.parse(configGuardada));
      this.isSuccessModalOpen.set(true);
    }
  }

  cargarEventos() {
    this.miServicio.getEventos().subscribe(data => this.eventos.set(data));
  }

  private initForm() {
    this.formEvento = this.fb.group({
      tipoEvento: ['', Validators.required], titulo: [ '',[Validators.required, Validators.minLength(5), Validators.maxLength(70), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) ]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      ubicacion: ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s#.-]+$/)]],
      descripcion: [ '', [ Validators.required, Validators.minLength(10)]],
      estado: ['Próximo']
    });
  }

  openNew() {
    this.editingId = null;
    this.formEvento.reset({estado: 'Próximo', tipoEvento: ''});
    this.isModalOpen.set(true);
  }

  openEdit(evento: Evento) {
    this.editingId = evento.id!;
    this.formEvento.patchValue(evento);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  save() {
    if (this.formEvento.invalid) {
      this.formEvento.markAllAsTouched();
      return;
    }

    const data = this.formEvento.value;

    if (this.editingId) {

      this.miServicio.updateEvento({...data, id: this.editingId }).subscribe((res) => {
        this.eventos.update(list =>list.map(e =>e.id === this.editingId ? res : e));
        this.mostrarFeedback( '¡Evento Actualizado!', 'La información del evento ha sido actualizada.', res,'SUCCESS');
      });
    } else {
      this.miServicio.addEvento(data).subscribe((newEvento) => {
          this.eventos.update(actuales => [ ...actuales, newEvento ]);
          this.mostrarFeedback('¡Evento Creado!', 'El evento ha sido registrado correctamente.', newEvento, 'SUCCESS');
        });
    }
  }

  delete(evento: Evento) {
    this.eventoAEliminar = evento;
    this.mostrarFeedback(
      '¿Estás seguro?',
      '¿Deseas eliminar este evento?',
      evento,
      'CONFIRM'
    );
  }

  cerrarModalExito() {
    this.isSuccessModalOpen.set(false);
    localStorage.removeItem('ultimoExitoConfig');
  }

  confirmarAccionDialog() {
    if (this.eventoAEliminar) {
      this.miServicio.deleteEvento(this.eventoAEliminar.id!).subscribe(() => {
          this.eventos.update(list =>list.filter(e => e.id !== this.eventoAEliminar?.id));
          this.cerrarModalExito();
          this.eventoAEliminar = null;
        });
    }
  }

  private mostrarFeedback( tituloParam: string, subtituloParam: string, eventoParam: any, type: 'SUCCESS' | 'CONFIRM') {
    this.closeModal();
    const isConfirm = type === 'CONFIRM';

    const config = {
      titulo: tituloParam,
      subtitulo: subtituloParam,
      nombreItem: 'Evento',
      reporte: eventoParam,
      footerText: isConfirm? 'Esta acción no se puede deshacer' : 'Gracias por mantener informada a la comunidad.',
      iconFooter: isConfirm ? '⚠️' : '📅',
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
}