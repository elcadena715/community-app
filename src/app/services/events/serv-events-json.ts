import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Evento } from '../../models/events';

@Injectable({
  providedIn: 'root',
})
export class ServEventsJson {
  private eventsUrl = 'http://localhost:3000/eventos';

  constructor(private http: HttpClient) {}

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.eventsUrl);
  }

  getEventoById(id: string): Observable<Evento> {
    return this.http.get<Evento>(`${this.eventsUrl}/${id}`);
  }

  searchEventos(titulo: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.eventsUrl)
      .pipe(
        map((eventos) =>
          eventos.filter(e =>
            e.titulo.toLowerCase().includes(titulo.toLowerCase())
          )
        )
      );
  }

  addEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.eventsUrl, evento);
  }

  updateEvento(evento: Evento): Observable<Evento> {
    const urlEventoAEditar = `${this.eventsUrl}/${evento.id}`;

    return this.http.put<Evento>(urlEventoAEditar, evento);
  }

  deleteEvento(id: number): Observable<void> {
    const urlEventoAEliminar = `${this.eventsUrl}/${id}`;
    return this.http.delete<void>(urlEventoAEliminar);
  }
}