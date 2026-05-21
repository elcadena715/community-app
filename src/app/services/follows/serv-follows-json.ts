import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {  map, Observable, switchMap} from 'rxjs';

import { Seguimiento } from '../../models/follow';
import { ServReportesJson } from '../reports/serv-reports-json';

@Injectable({
  providedIn: 'root'
})
export class ServFollowsJson {

  private http = inject(HttpClient);
  private servReportes = inject(ServReportesJson);

  private followsUrl = 'http://localhost:3000/seguimientos';

  getSeguimientos(): Observable<Seguimiento[]> {

    return this.http.get<Seguimiento[]>(this.followsUrl);

  }

  addSeguimiento(seguimiento: Seguimiento): Observable<Seguimiento> {
    return this.http.post<Seguimiento>(this.followsUrl, seguimiento).pipe(
      switchMap((nuevoSeguimiento) => {
        // Al terminar el POST del seguimiento, disparamos el PATCH al reporte padre usando su idReporte
        return this.servReportes.patchEstadoReporte(nuevoSeguimiento.idReporte, nuevoSeguimiento.estado).pipe(
          // Retornamos el nuevoSeguimiento para que el componente de tu compañero reciba lo que espera
          map(() => nuevoSeguimiento)
        );
      })
    );
  }

  updateSeguimiento(seguimiento: Seguimiento): Observable<Seguimiento> {
    const urlSeguimientoEditar = `${this.followsUrl}/${seguimiento.id}`;

    return this.http.put<Seguimiento>(urlSeguimientoEditar, seguimiento).pipe(
      switchMap((seguimientoEditado) => {
        return this.servReportes.patchEstadoReporte(seguimientoEditado.idReporte, seguimientoEditado.estado).pipe(
          map(() => seguimientoEditado)
        );
      })
    );
  }

  deleteSeguimiento(id: number): Observable<void> {
    const urlSeguimientoEliminar = `${this.followsUrl}/${id}`;
    return this.http.delete<void>(urlSeguimientoEliminar);

  }

}