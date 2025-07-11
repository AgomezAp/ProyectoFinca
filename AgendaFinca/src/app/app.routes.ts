import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { ReservaComponent } from './components/reserva/reserva.component'
import { VerificarComponent } from './components/verificar/verificar.component';
import { PanelComponent } from './components/crm/panel/panel.component';
import { InfoContactoComponent } from './components/info-contacto/info-contacto.component';
import { DatosPersonalesComponent } from './components/politicas/datos-personales/datos-personales.component';
import { TerminosycondicionesComponent } from './components/politicas/terminosycondiciones/terminosycondiciones.component';
import { CalendarioComponent } from './components/crm/calendario/calendario.component';
import { correoGuard } from './core/correo.guard';
import { InicioComponent } from './components/inicio/inicio.component';

export const routes: Routes = [
    {path: '', redirectTo: 'inicio', pathMatch: 'full'},
    {path: 'inicio', component: InicioComponent},
    {path: 'bienvenida', component: LandingComponent},
    {path: 'reserva', component: ReservaComponent},
    {path: 'miReserva', component: VerificarComponent},
    {path: 'panel', component: PanelComponent , canActivate: [correoGuard]},
    {path: 'about', component: InfoContactoComponent},
    {path: 'manejodatos', component: DatosPersonalesComponent },
    {path: 'terminos', component: TerminosycondicionesComponent},
    {path: 'calendario', component: CalendarioComponent, canActivate: [correoGuard]}


];
