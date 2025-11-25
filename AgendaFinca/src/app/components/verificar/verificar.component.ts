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
            this.reserva = response;
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
          this.reserva = response;
          console.log(this.reserva)
        },
        error: (error) => {
          this.errorMessage = error?.error?.error || 'Ocurrió un error';
        }
      })
    }
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
}
