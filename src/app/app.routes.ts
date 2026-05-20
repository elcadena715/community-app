import { Routes } from '@angular/router';
import { ReportsList } from './components/reports/reports-list/reports-list';
import { Dashboard } from './components/dashboard/dashboard';
//import { Market } from './components/market/market';

export const routes: Routes = [
    //Ruta para el dashboard
    { path: "dashboard", component: Dashboard },  
    // Ruta para reportes
    { path: "reports-list", component: ReportsList }, 
    //Ruta para el dashboard
    { 
        path: "comunity", 
        children: [
            // { path: "events", component: ReportsList }, 
            //{ path: "market", component: Market } 
        ]
    }, 
    
    // Rutas por defecto 
    { path: "", redirectTo: "reports-list", pathMatch: 'full' },
    { path: "**", redirectTo: "reports-list" }
];
