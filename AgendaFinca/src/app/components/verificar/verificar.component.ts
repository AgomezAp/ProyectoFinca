import { Component, HostListener } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../services/agenda.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-verificar',
  imports: [MatFormFieldModule, CommonModule, FormsModule, MatInputModule, MatIcon],
  templateUrl: './verificar.component.html',
  styleUrl: './verificar.component.css'
})
export class VerificarComponent {
  data: string = '';
  reserva: any[] = [];
  errorMessage: string = '';
  listaBlanca: any[] = ['admin@example.com'];

  constructor (private reservaService: AgendaService) {}

  buscar() {
    if (this.data.includes('@')) {
      if ((this.listaBlanca as string[]).includes(this.data)) {
        localStorage.setItem('correo', this.data);
        window.location.href = '/panel';
      } else {
        this.reservaService.reservaEmail(this.data).subscribe({
          next: (response) => {
            this.reserva = this.filtrarReservaProxima(response);
            console.log(this.reserva)
          },
          error: (error) => {
            this.errorMessage = error?.error?.error || 'Ocurrió un error';
            console.log(error)
          }
        })
      }
    } else {
      this.reservaService.reservaCc(this.data).subscribe({
        next: (response) => {
          this.reserva = this.filtrarReservaProxima(response);
          console.log(this.reserva)
        },
        error: (error) => {
          this.errorMessage = error?.error?.error || 'Ocurrió un error';
        }
      })
    }
  }

  // Filtrar y obtener la reserva más próxima hacia adelante
  filtrarReservaProxima(reservas: any[]): any[] {
    if (!reservas || reservas.length === 0) return [];
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear la hora para comparar solo fechas
    
    // Filtrar solo reservas con fechaLlegada >= hoy
    const reservasFuturas = reservas.filter(reserva => {
      const fechaLlegada = new Date(reserva.fechaLlegada);
      fechaLlegada.setHours(0, 0, 0, 0);
      return fechaLlegada >= hoy;
    });
    
    // Si no hay reservas futuras, retornar array vacío
    if (reservasFuturas.length === 0) {
      this.errorMessage = 'No tienes reservas próximas. Las reservas anteriores ya no están disponibles.';
      return [];
    }
    
    // Ordenar por fecha de llegada (más cercana primero)
    reservasFuturas.sort((a, b) => {
      const fechaA = new Date(a.fechaLlegada).getTime();
      const fechaB = new Date(b.fechaLlegada).getTime();
      return fechaA - fechaB;
    });
    
    // Retornar solo la primera (más cercana)
    return [reservasFuturas[0]];
  }

  cerrarModal() {
    this.reserva = [];
    // También puedes limpiar otros datos si es necesario
    this.data = '';
    this.errorMessage = '';
  }

  // Cerrar modal con tecla Escape
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    this.cerrarModal();
  }

  // Obtener el estado de la reserva
  getEstadoReserva(): 'aceptado' | 'pendiente' | 'rechazado' {
    if (this.reserva.length === 0) return 'pendiente';
    const confirmado = this.reserva[0].confirmado;
    if (confirmado === true) return 'aceptado';
    if (confirmado === false) return 'rechazado';
    return 'pendiente';
  }

  // Obtener el icono según el estado
  getIconoEstado(): string {
    const estado = this.getEstadoReserva();
    if (estado === 'aceptado') return 'check_circle';
    if (estado === 'rechazado') return 'cancel';
    return 'schedule'; // pendiente
  }

  // Obtener mensaje según el estado
  getMensajePrincipal(): string {
    const estado = this.getEstadoReserva();
    if (estado === 'aceptado') {
      return 'Recuerda que tienes una reserva para disfrutar entre los días';
    }
    if (estado === 'rechazado') {
      return 'Lamentablemente tu reserva para los días';
    }
    return 'Tu reserva está en proceso de revisión para los días';
  }

  getMensajeSecundario(): string {
    const estado = this.getEstadoReserva();
    if (estado === 'aceptado') {
      return 'Te esperamos en <strong>El Progreso</strong> para que vivas una experiencia inolvidable.<br>Si tienes alguna duda, contáctanos.<br>¡Gracias por elegirnos!';
    }
    if (estado === 'rechazado') {
      return 'No hemos podido confirmar tu reserva en estas fechas. Por favor, contáctanos para más información o intenta con otras fechas.<br>Disculpa las molestias.';
    }
    return 'Estamos revisando tu solicitud. Te notificaremos por correo electrónico o telefono cuando tu reserva sea confirmada.<br>Gracias por tu paciencia.';
  }

  getTextoEstado(): string {
    const estado = this.getEstadoReserva();
    if (estado === 'aceptado') return '✓ Reserva Confirmada';
    if (estado === 'rechazado') return '✗ Reserva Rechazada';
    return '⏳ Reserva Pendiente';
  }
}
