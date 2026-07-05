import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Reporte } from '../models/reports';

@Injectable({
  providedIn: 'root',
})
export class ServCommunityApi {

  private reportesUrl = 'http://localhost:5031/api/Reports';
  
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

    searchReportes2(search?: string, tipoReporte?: string): Observable<Reporte[]> {
      let params = new HttpParams();
      
      if (search) params = params.set('search', search);
      if (tipoReporte) params = params.set('tipoReporte', tipoReporte);

      // Reemplaza por tu URL base real de la API
      return this.http.get<Reporte[]>(`${this.reportesUrl}/search`, { params });
    }

    deactivateReport(id:number): Observable<void> {
    const url = `${this.reportesUrl}/deactivate/${id}`;
    return this.http.put<void>(url, {}); // PUT request with an empty body
  }

}
