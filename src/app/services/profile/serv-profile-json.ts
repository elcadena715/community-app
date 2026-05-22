import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Mascota, Vehiculo } from '../../models/profile';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServProfileJson {
  private mascotasUrl = 'http://localhost:3000/mascotas'; 
  private vehiculosUrl = 'http://localhost:3000/vehiculos'; 

  private http = inject(HttpClient);

  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.mascotasUrl);
  }

  addMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.mascotasUrl, mascota);
  }

  updateMascota(mascotaActualizada: Mascota): Observable<Mascota> {
    const urlEditar = `${this.mascotasUrl}/${mascotaActualizada.id}`;
    return this.http.put<Mascota>(urlEditar, mascotaActualizada);
  }

  deleteMascota(id: number): Observable<any> {
    const urlEliminar = `${this.mascotasUrl}/${id}`;
    return this.http.delete<any>(urlEliminar);
  }

  getVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.vehiculosUrl);
  }

  addVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.vehiculosUrl, vehiculo);
  }

  updateVehiculo(vehiculoActualizado: Vehiculo): Observable<Vehiculo> {
    const urlEditar = `${this.vehiculosUrl}/${vehiculoActualizado.id}`;
    return this.http.put<Vehiculo>(urlEditar, vehiculoActualizado);
  }

  deleteVehiculo(id: number): Observable<any> {
    const urlEliminar = `${this.vehiculosUrl}/${id}`;
    return this.http.delete<any>(urlEliminar);
  }
}
