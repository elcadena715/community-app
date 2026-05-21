import { Routes } from '@angular/router';
import { ReportsList } from './components/reports/reports-list/reports-list';
import { Dashboard } from './components/dashboard/dashboard';
import { FollowsList } from './components/follows/follows-list/follows-list';
import { EventsList } from './components/events/events-list/events-list';
//import { Market } from './components/market/market';

export const routes: Routes = [
    //Ruta para el dashboard
    { path: "dashboard", component: Dashboard },  
    // Ruta para reportes
    { path: "reports-list", component: ReportsList }, 
    //Ruta para comunidad con rutas hijas para eventos y mercado
    { 
        path: "comunity", 
        children: [
            // Ruta para seguimiento
            { path: "events", component: EventsList }, 
            //{ path: "market", component: Market } 
        ]
    }, 
    // Ruta para seguimiento
    { path: "follows-list", component: FollowsList }, 
    
    
    // Rutas por defecto 
    { path: "", redirectTo: "reports-list", pathMatch: 'full' },
    { path: "**", redirectTo: "reports-list" }
];
