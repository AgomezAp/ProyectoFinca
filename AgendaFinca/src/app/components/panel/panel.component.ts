import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaService } from '../../services/agenda.service';
import { ImagenService } from '../../services/imagen.service';
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
    // localStorage.clear()
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


}
