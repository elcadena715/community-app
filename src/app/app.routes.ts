import { Routes } from '@angular/router';
import { ReportsList } from './components/reports/reports-list/reports-list';
import { ReporteCrud } from './components/reports/reports-crud/reports-crud';

export const routes: Routes = [
    // Rutas para reportes
    { path: "reports-list", component: ReportsList },
    { path: "reports-crud", component: ReporteCrud },           
    { path: "reports-crud/:id", component: ReporteCrud },       
    
    // Rutas por defecto 
    { path: "", redirectTo: "reports-list", pathMatch: 'full' },
    { path: "**", redirectTo: "reports-list" }
];
