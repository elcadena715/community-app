import { Routes } from '@angular/router';
import { ReportsList } from './components/reports/reports-list/reports-list';

export const routes: Routes = [
    // Rutas para reportes
    { path: "reports-list", component: ReportsList },   
    
    // Rutas por defecto 
    { path: "", redirectTo: "reports-list", pathMatch: 'full' },
    { path: "**", redirectTo: "reports-list" }
];
