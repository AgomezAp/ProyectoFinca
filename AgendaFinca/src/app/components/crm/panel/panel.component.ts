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
      this.reservas = data.map(reserva => ({
        ...reserva,
        fechaLlegada: reserva.fechaLlegada ? reserva.fechaLlegada.split('T')[0] : '',
        // Si tienes más fechas, puedes hacer lo mismo:
        fechaSalida: reserva.fechaSalida ? reserva.fechaSalida.split('T')[0] : ''
      }));
      console.log(this.reservas)
    });

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
    })
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
  }
}
