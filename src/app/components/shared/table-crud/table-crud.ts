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
  private _data: any[] = [];

  @Input() set data(value: any[]) {
    this._data = value;
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = 1;
    }
  }

  get data(): any[] {
    return this._data;
  }

  @Input() columnas: { key: string, label: string }[] = [];
  
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  searchText: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  get totalPaginas(): number {
    return Math.ceil(this._data.length / this.itemsPorPagina);
  }

  get dataPaginada() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this._data.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }
}
