import { Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/pipes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-reporte-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './table-crud.html',
})
export class TableReporteCrud {
  @Input() data: any[] = [];
  @Input() columnas: { key: string, label: string }[] = [];
  
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  searchText: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  get totalPaginas(): number {
    return Math.ceil(this.data.length / this.itemsPorPagina);
  }

  get dataPaginada() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.data.slice(inicio, inicio + this.itemsPorPagina);
  }
}
