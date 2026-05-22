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
  categoriasMascota = ['Perro', 'Gato', 'Hámster', 'Pez','Pajaro/ave','Otros'];

  categoriasVehiculo = ['Sedán', 'SUV', 'Moto', 'Camioneta','Todoterreno ','Furgoneta ','Otros'];

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
        nombre: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(30), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        especie: ['', [Validators.required]],
        edad: ['', [Validators.required, Validators.min(0), Validators.max(30), Validators.pattern('^[0-9]+$')]],
        vacunado: [false]
      });

    } else {
      this.formProfile = this.fb.group({
        marca: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(30),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        modelo: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
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
        const itemEditado = { ...payload, id: this.data.id, actualizado: true };
        this.perfilService.updateMascota(itemEditado).subscribe(() => {
          this.mostrarFeedback('¡Mascota actualizada!', 'La información de tu mascota ha sido modificada con éxito.', itemEditado);
        });

      } else {

        this.perfilService.addMascota(payload).subscribe((nueva) => {
          this.mostrarFeedback('¡Mascota registrada!', 'Tu mascota ha sido ingresada exitosamente al sistema.', nueva);
        });
      }

    } else {
      if (esEdicion) {
        const itemEditado = { ...payload, id: this.data.id, actualizado: true };
        this.perfilService.updateVehiculo(itemEditado).subscribe(() => {
          this.mostrarFeedback('¡Vehículo actualizado!', 'La información de tu vehículo fue modificada correctamente.', itemEditado);
        });

      } else {
        this.perfilService.addVehiculo(payload).subscribe((nuevo) => {
          this.mostrarFeedback('¡Vehículo registrado!', 'El vehículo fue vinculado a tu propiedad con éxito.', nuevo);
        });
      }
    }
  }

  private mostrarFeedback(tituloParam: string, subtituloParam: string, itemData: any) {
    const esMascota = this.type === 'mascota';
    
    const config = {
      titulo: tituloParam,
      subtitulo: subtituloParam,
      nombreItem: esMascota ? 'Mascota' : 'Vehículo',
      showCancel: false,
      confirmText: 'Entendido',
      iconFooter: esMascota ? '🐾' : '🚗',
      footerText: 'Gracias por mantener tus registros actualizados.',
      
      reporte: {
        id: itemData.id || 'Nuevo',
        titulo: esMascota 
        ? `Tu mascota "${itemData.nombre}"` 
        : `Tu vehículo marca ${itemData.marca}`,
        fecha: new Date().toISOString().split('T')[0],
        estado: itemData.actualizado ? 'Actualizado' : 'Guardado'
      },
    };

    localStorage.setItem('ultimoExitoConfigProfile', JSON.stringify(config));
    
    this.onCerrar.emit({ recargar: true });
  }
}