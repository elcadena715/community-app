import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServProfileJson } from '../../../services/profile/serv-profile-json';

@Component({
  selector: 'app-profile-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-crud.html',
  styleUrls: ['./profile-crud.css']
})
export class ProfileCrud implements OnInit {
  @Input() type: 'mascota' | 'vehiculo' = 'mascota';
  @Input() data: any = null;
  @Output() onCerrar = new EventEmitter<{ recargar: boolean }>();

  formProfile!: FormGroup;
  categoriasMascota = ['Perro', 'Gato', 'Otro'];
  categoriasVehiculo = ['Sedán', 'SUV', 'Moto', 'Camioneta'];

  private perfilService = inject(ServProfileJson);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initFormulario();
    if (this.data) {
      this.formProfile.patchValue(this.data);
    }
  }

  private initFormulario() {
    if (this.type === 'mascota') {
      this.formProfile = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        especie: ['', Validators.required],
        edad: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
        vacunado: [false]
      });
    } else {
      this.formProfile = this.fb.group({
        marca: ['', [Validators.required, Validators.minLength(2)]],
        modelo: ['', Validators.required],
        tipo: ['', Validators.required],
        asegurado: [false]
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.formProfile.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.formProfile.get(field);
    return !!(control && control.hasError(errorType));
  }

  save() {
    if (this.formProfile.invalid) {
      this.formProfile.markAllAsTouched();
      return;
    }

    const payload = this.formProfile.value;
    const esEdicion = !!this.data;
    const esMascota = this.type === 'mascota';

    if (esMascota) {
      if (esEdicion) {
        const itemEditado = { ...payload, id: this.data.id };
        this.perfilService.updateMascota(itemEditado).subscribe(() => {
          this.mostrarFeedback('¡Mascota Actualizada!', 'La información de tu mascota ha sido modificada con éxito.', itemEditado);
        });
      } else {
        this.perfilService.addMascota(payload).subscribe((nueva) => {
          this.mostrarFeedback('¡Mascota Registrada!', 'Tu mascota ha sido ingresada exitosamente al sistema.', nueva);
        });
      }
    } else {
      if (esEdicion) {
        const itemEditado = { ...payload, id: this.data.id };
        this.perfilService.updateVehiculo(itemEditado).subscribe(() => {
          this.mostrarFeedback('¡Vehículo Actualizado!', 'La información de tu vehículo fue modificada correctamente.', itemEditado);
        });
      } else {
        this.perfilService.addVehiculo(payload).subscribe((nuevo) => {
          this.mostrarFeedback('¡Vehículo Registrado!', 'El vehículo fue vinculado a tu propiedad con éxito.', nuevo);
        });
      }
    }
  }

  // 🟢 PERSISTENCIA EN LOCALSTORAGE IGUALITA A TU MODULO DE INCIDENTES
  private mostrarFeedback(tituloParam: string, subtituloParam: string, itemData: any) {
    const esMascota = this.type === 'mascota';
    
    const config = {
      titulo: tituloParam,
      subtitulo: subtituloParam,
      nombreItem: esMascota ? 'Mascota' : 'Vehículo',
      showCancel: false,
      confirmText: 'Entendido',
      btnClass: 'btn-dark',
      iconFooter: esMascota ? '🐾' : '🚗',
      footerText: 'Gracias por mantener tus registros actualizados.',
      reporte: {
        id: itemData.id || 'Nuevo',
        col1Val: esMascota ? itemData.nombre : itemData.marca,
        col2Val: esMascota ? itemData.especie : itemData.modelo,
        col3Val: esMascota ? `${itemData.edad} años` : itemData.tipo
      },
      col1Label: esMascota ? 'Nombre:' : 'Marca:',
      col2Label: esMascota ? 'Especie:' : 'Modelo:',
      col3Label: esMascota ? 'Edad:' : 'Tipo Auto:'
    };

    // Almacenamos en el almacenamiento local antes de dar la orden de cierre asíncrono
    localStorage.setItem('ultimoExitoConfigProfile', JSON.stringify(config));
    
    // Cerramos el CRUD mandando la orden de recarga al componente de la lista
    this.onCerrar.emit({ recargar: true });
  }
}