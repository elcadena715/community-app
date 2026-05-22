import { Routes } from '@angular/router';
import { ReportsList } from './components/reports/reports-list/reports-list';
import { Dashboard } from './components/dashboard/dashboard';
import { FollowsList } from './components/follows/follows-list/follows-list';
import { EventsList } from './components/events/events-list/events-list';
import { MarketList } from './components/market/market-list/market-list';
import { MarketCrud } from './components/market/market-crud/market-crud';
import { ProfileList } from './components/profile/profile-list/profile-list';

export const routes: Routes = [
    { path: "dashboard", component: Dashboard },  
    { path: "reports-list", component: ReportsList }, 
    { 
        path: "comunity", 
        children: [
            { path: "events", component: EventsList }, 
            { path: "market", component: MarketList },
            { path: "market-crud", component: MarketCrud }
        ]
    }, 
    { path: "follows-list", component: FollowsList }, 
    { path: "profile", component: ProfileList }, 
    
    
    // Rutas por defecto 
    { path: "", redirectTo: "reports-list", pathMatch: 'full' },
    { path: "**", redirectTo: "reports-list" }
];
