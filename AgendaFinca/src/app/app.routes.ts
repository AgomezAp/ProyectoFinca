import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { ReservaComponent } from './components/reserva/reserva.component'
import { VerificarComponent } from './components/verificar/verificar.component';
import { PanelComponent } from './components/panel/panel.component';
import { InfoContactoComponent } from './components/info-contacto/info-contacto.component';
import { DatosPersonalesComponent } from './components/politicas/datos-personales/datos-personales.component';
import { TerminosycondicionesComponent } from './components/politicas/terminosycondiciones/terminosycondiciones.component';
import { correoGuard } from './core/correo.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'bienvenida', pathMatch: 'full'},
    {path: 'bienvenida', component: LandingComponent},
    {path: 'reserva', component: ReservaComponent},
    {path: 'miReserva', component: VerificarComponent},
    {path: 'panel', component: PanelComponent , canActivate: [correoGuard]},
    {path: 'about', component: InfoContactoComponent},
    {path: 'manejodatos', component: DatosPersonalesComponent },
    {path: 'terminos', component: TerminosycondicionesComponent}


];
