import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { ReservaComponent } from './components/reserva/reserva.component'

export const routes: Routes = [
    {path: '', redirectTo: 'bienvenida', pathMatch: 'full'},
    {path:'bienvenida', component: LandingComponent},
    {path: 'reserva', component: ReservaComponent}
];
