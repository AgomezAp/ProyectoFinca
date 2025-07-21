import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaService } from '../../../services/agenda.service';
import { ImagenService } from '../../../services/imagen.service';
import { application, response } from 'express';
@Component({
  selector: 'app-panel',
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {
  reservas: any[] = [];
  imagenSeleccionada: string | null = null;
  actual: boolean = true;
  todasReservas: any[] = [];

  constructor(private agendaService: AgendaService, private imagenService: ImagenService) {}

  ngOnInit() {
    console.log(localStorage)
    
    let tiempoRestante = 5 * 60; // segundos
    const intervalo = setInterval(() => {
      tiempoRestante--;
      console.log(`Tiempo restante para limpiar localStorage: ${tiempoRestante} segundos`);
      if (tiempoRestante <= 0) {
      clearInterval(intervalo);
      localStorage.clear();
      console.log('localStorage limpiado');
      }
    }, 1000);
    this.agendaService.reservas().subscribe((data: any[]) => {
      this.todasReservas = data.map(reserva => ({
        ...reserva,
        fechaLlegada: reserva.fechaLlegada ? reserva.fechaLlegada.split('T')[0] : '',
        // Si tienes más fechas, puedes hacer lo mismo:
        fechaSalida: reserva.fechaSalida ? reserva.fechaSalida.split('T')[0] : ''
      }));
      this.filtrarReservas();
      console.log(this.todasReservas)
    });

  }

  filtrarReservas() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (this.actual) {
      this.reservas = this.todasReservas.filter(reserva => {
        let fechaSalida = new Date(reserva.fechaSalida);
        return fechaSalida >= hoy
      });
    } else {
      this.reservas = this.todasReservas.filter(reserva => {
        let fechaSalida = new Date(reserva.fechaSalida);
        return fechaSalida < hoy;
      });
    }
  }

  toggleReservas() {
    this.actual = !this.actual;
    this.filtrarReservas();
  }

  getTextoBoton(): string {
    return this.actual ? 'Ver Reservas Pasadas' : 'Ver Reservas Futuras';
  }

  getTituloSeccion(): string {
    return this.actual ? 'Reservas Futuras' : 'Reservas Pasadas';
  }

  getInfoReservas(): string {
    const total = this.reservas.length;
    const tipo = this.actual ? 'futuras' : 'pasadas';
    return `${total} reserva${total !== 1 ? 's' : ''} ${tipo}`;
  }

  getImagenUrl(nombre: string): string {
    return this.imagenService.getImagenUrl(nombre);
  }

  abrirImagen(url: string) {
    this.imagenSeleccionada = url;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

  actualizar(reserva: any, nuevoEstado: boolean) {
    this.agendaService.estado({
      email: reserva.email,
      fechallegada: reserva.fechaLlegada,
      estado: nuevoEstado}).subscribe(() => {
        reserva.confirmado = nuevoEstado;
        
        // Actualizar también en todasLasReservas
        const index = this.todasReservas.findIndex(r => 
          r.email === reserva.email && r.fechaLlegada === reserva.fechaLlegada
        );
        if (index !== -1) {
          this.todasReservas[index].confirmado = nuevoEstado;
        }
    });
  }

  facturar(reserva: any) {
    this.agendaService.factura({
      email: reserva.email,
      fechallegada: reserva.fechaLlegada
    }).subscribe({
      next: (response) => {
        const blob = new Blob([response], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a')
        a.href = url;
        a.download = `factura_${reserva.cc}.pdf`
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al crear la factura', err)
      }
    })
  };

  enviarFactura(reserva: any) {
    this.agendaService.facturaCorreo({
        email: reserva.email,
        fechallegada: reserva.fechaLlegada,
    }).subscribe({
        next: (response) => {
            console.log('Factura enviada exitosamente');
            // Mostrar mensaje de éxito
        },
        error: (err) => {
            console.error('Error al enviar factura:', err);
            // Mostrar mensaje de error
        }
    });
  }
}
