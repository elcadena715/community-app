import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mascota, Vehiculo } from '../../../models/profile';
import { ServProfileJson } from '../../../services/profile/serv-profile-json';
import { TableReporteCrud } from '../../shared/table-crud/table-crud';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog';
import { ProfileCrud } from '../profile-crud/profile-crud';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [CommonModule, TableReporteCrud, AppDialogComponent, ProfileCrud],
  templateUrl: './profile-list.html',
  styleUrls: ['./profile-list.css']
})
export class ProfileList implements OnInit {
  residente = { nombre: 'David Sayay', iniciales: 'DS', ubicacion: 'Villa 4, Manzana 32' };

  mascotas = signal<any[]>([]);
  vehiculos = signal<any[]>([]);

  isModalOpen = signal<boolean>(false);
  crudType: 'mascota' | 'vehiculo' = 'mascota';
  selectedData: any = null;

  isSuccessModalOpen = signal<boolean>(false);
  exitoConfig = signal<any>(null);
  itemAEliminar: { tipo: 'mascota' | 'vehiculo'; data: any } | null = null;

  private perfilService = inject(ServProfileJson);

  ngOnInit(): void {
    this.cargarDatosGrillas();

    const configGuardada = localStorage.getItem('ultimoExitoConfigProfile');
    if (configGuardada) {
      this.exitoConfig.set(JSON.parse(configGuardada));
      this.isSuccessModalOpen.set(true);
    }
  }

  cargarDatosGrillas() {
    this.perfilService.getMascotas().subscribe(data => {
      const mascotasFormateadas = data.map(mascota => ({
        ...mascota,
        vacunado: mascota.vacunado ? 'Sí' : 'No'
      }));
      this.mascotas.set(mascotasFormateadas);
    });

    this.perfilService.getVehiculos().subscribe(data => {
      const vehiculosFormateados = data.map(vehiculo => ({
        ...vehiculo,
        asegurado: vehiculo.asegurado ? 'Sí' : 'No'
      }));
      this.vehiculos.set(vehiculosFormateados);
    });
  }

  openNew(tipo: 'mascota' | 'vehiculo') {
    this.crudType = tipo;
    this.selectedData = null;
    this.isModalOpen.set(true);
  }

  openEdit(tipo: 'mascota' | 'vehiculo', data: any) {
    this.crudType = tipo;
    this.selectedData = data;
    this.isModalOpen.set(true);
  }

  manejarCierreCrud(event: { recargar: boolean }) {
    this.isModalOpen.set(false);
    if (event.recargar) {
      this.cargarDatosGrillas();
      
      const configGuardada = localStorage.getItem('ultimoExitoConfigProfile');
      if (configGuardada) {
        this.exitoConfig.set(JSON.parse(configGuardada));
        setTimeout(() => {
          this.isSuccessModalOpen.set(true);
        }, 50);
      }
    }
  }

  solicitarEliminar(tipo: 'mascota' | 'vehiculo', item: any) {
    this.itemAEliminar = { tipo, data: item };
    const esMascota = tipo === 'mascota';

    const config = {
      titulo: esMascota ? '¿Eliminar Mascota?' : '¿Retirar Vehículo?',
      subtitulo: esMascota ? 'Esta acción removerá el registro del sistema de la urbanización.' : 'Se revocarán los permisos automáticos de acceso para este auto.',
      nombreItem: esMascota ? 'Mascota' : 'Vehículo',
      showCancel: true,
      confirmText: esMascota ? 'Sí, Eliminar' : 'Sí, Desvincular',
      cancelText: 'Volver',
      btnClass: 'btn-danger',
      iconFooter: esMascota ? '🐾' : '🚗',
      footerText: 'Esta acción no se puede deshacer',
      reporte: {
        id: item.id || 'Nuevo',
        titulo: esMascota 
        ? `Tu mascota "${item.nombre}"` 
        : `Tu vehículo marca ${item.marca}`,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Pendiente'
      },
    };

    this.exitoConfig.set(config);
    this.isSuccessModalOpen.set(true);
  }

  cerrarModalExito() {
    this.isSuccessModalOpen.set(false);
    localStorage.removeItem('mostrarExito');
    localStorage.removeItem('ultimoReporte');
    localStorage.removeItem('ultimoExitoConfigProfile');
  }

  confirmarAccionDialog() {
    if (this.itemAEliminar) {
      const target = this.itemAEliminar;
      this.itemAEliminar = null;

      if (target.tipo === 'mascota') {
        this.perfilService.deleteMascota(target.data.id).subscribe(() => {
          this.cerrarModalExito();
          this.cargarDatosGrillas();
        });
      } else {
        this.perfilService.deleteVehiculo(target.data.id).subscribe(() => {
          this.cerrarModalExito();
          this.cargarDatosGrillas();
        });
      }
    } else {
      this.cerrarModalExito();
    }
  }
}