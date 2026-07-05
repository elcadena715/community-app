export interface Role {
  id: number;
  nombre: string;
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  idRol: number;
  activo: boolean;
  fechaRegistro?: string;
}