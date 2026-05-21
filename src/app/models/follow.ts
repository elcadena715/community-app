export interface Seguimiento {
id?: number;

  idReporte: number;

  tituloReporte: string;

  estado: 'Pendiente' | 'En revisión' | 'Resuelto';

  autoridad: string;

  mensaje: string;

  fecha: string;

  hora: string;

  publicar: boolean;

}