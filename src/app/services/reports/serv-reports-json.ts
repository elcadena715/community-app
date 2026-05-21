import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Reporte } from '../../models/reports';

@Injectable({
  providedIn: 'root',
})
export class ServReportesJson {
  private reportesUrl = 'http://127.0.0.1:3000/reportes';

  constructor(private http: HttpClient) {}

  getReportes(): Observable<Reporte[]> { 
    return this.http.get<Reporte[]>(this.reportesUrl);
  }

  getReporteById(id: string): Observable<Reporte> {
    return this.http.get<Reporte>(`${this.reportesUrl}/${id}`);
  }

  searchReportes(titulo: string): Observable<Reporte[]> { 
    return this.http.get<Reporte[]>(this.reportesUrl)
      .pipe(map((reportes) => reportes.filter(r => r.titulo.toLowerCase().includes(titulo.toLowerCase()))));
  }

  addReporte(reporte: Reporte): Observable<Reporte> {
    return this.http.post<Reporte>(this.reportesUrl, reporte);
  }
    
  updateReporte(reporte: Reporte): Observable<Reporte> {
    const urlReporteAEditar = `${this.reportesUrl}/${reporte.id}`;
    return this.http.put<Reporte>(urlReporteAEditar, reporte);
  }

  deleteReporte(id: number): Observable<void> {
    const urlReporteAEliminar = `${this.reportesUrl}/${id}`;
    return this.http.delete<void>(urlReporteAEliminar);
  }

  patchEstadoReporte(id: string | number, nuevoEstado: string): Observable<Reporte> {
    const url = `${this.reportesUrl}/${id}`;
    return this.http.patch<Reporte>(url, { estado: nuevoEstado });
  }
}
