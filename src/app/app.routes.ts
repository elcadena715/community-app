import { Routes } from '@angular/router';
import { ReportsList } from './components/reports/reports-list/reports-list';
import { Dashboard } from './components/dashboard/dashboard';
import { FollowsList } from './components/follows/follows-list/follows-list';
import { EventsList } from './components/events/events-list/events-list';
import { MarketList } from './components/market/market-list/market-list';
import { MarketCrud } from './components/market/market-crud/market-crud';
import { ProfileList } from './components/profile/profile-list/profile-list';
import { LoginAuth } from './components/login/login-auth/login-auth';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    
    { path: 'login', component: LoginAuth},
    { path: "dashboard", component: Dashboard, canActivate: [authGuard] },  
    { path: "reports-list", component: ReportsList, canActivate: [authGuard] }, 
    { 
        path: 'comunity', 
        canActivate: [authGuard], 
        children: [
            { path: 'events', component: EventsList }, 
            { path: 'market', component: MarketList },
            { path: 'market-crud', component: MarketCrud }
        ]           
    },
    { path: "follows-list", component: FollowsList, canActivate: [authGuard], data: { roles: ['Administrador'] } }, 
    { path: "profile", component: ProfileList, canActivate: [authGuard] }, 
    
    
    // Rutas por defecto 
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: "**", redirectTo: "login" }
];
