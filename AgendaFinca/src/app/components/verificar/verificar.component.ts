import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../services/agenda.service';

@Component({
  selector: 'app-verificar',
  imports: [MatFormFieldModule, CommonModule, FormsModule],
  templateUrl: './verificar.component.html',
  styleUrl: './verificar.component.css'
})
export class VerificarComponent {
  email: string = '';
  errorMessage: string = '';

  constructor (private reservaService: AgendaService) {}

  buscar() {
    this.errorMessage = '';
    this.reservaService.reserva(this.email).subscribe({
      next: (response) => {
        // Manejar la respuesta exitosa aquí si es necesario
      },
      error: (error) => {
        this.errorMessage = 'Error al verificar la reserva.';
      }
    });
  }
}