import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { AgendaService } from '../../services/agenda.service';
@Component({
  selector: 'app-reserva',
  imports: [CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatCheckboxModule,
    MatButtonModule, MatIconModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})


export class ReservaComponent {
  fechaInicio: string = '';
  fechaFin: string = ''; 
  personas: number = 0; 
  Frontal: File | null = null;
  Atras: File | null = null;
  Rostro: File | null = null;
  FrontalName: string = '';
  AtrasName: string = '';
  RostroName: string = '';

  nombre: string = '';
  cc: string = ''; 
  email: string = '';
  telefono: string = '';
  terminos: boolean = false;
  datos: boolean = false;
  veridica: boolean = false;
  @ViewChild('fileFrente') fileFrente!: ElementRef<HTMLInputElement>;
  @ViewChild('fileAtras') fileAtras!: ElementRef<HTMLInputElement>;
  @ViewChild('fileRostro') fileRostro!: ElementRef<HTMLInputElement>;
  terminosResumen: boolean = false

  huespedes = Array.from({ length: 40 }, (_, i) => i + 2);
  
  constructor(private  reservaService: AgendaService) {}
  ngOnInit() {
    const formDataString = localStorage.getItem('reservaFormData');
    if (formDataString) {
      const formData = JSON.parse(formDataString);
      this.fechaInicio = formData.FechaInicio || formData.fechaInicio  || '';
      this.fechaFin = formData.FechaFin || formData.fechaFin || '';
      this.personas = formData.Personas;
    }
    console.log(formDataString)
  }
  
  mostrarVistaPrevia(event: any, lado: 'frente' | 'atras' | 'rostro') {
    const archivo = event.target.files[0];
    if (archivo) {
      if (lado === 'atras') {
        this.Atras = archivo;
        this.AtrasName = archivo.name
      } else if (lado === 'frente') {
        this.Frontal = archivo;
        this.FrontalName = archivo.name
      } else if (lado === 'rostro') {
        this.Rostro = archivo;
        this.RostroName = archivo.name
      }

      if (archivo.type.startsWith('image/')) {
        const lector = new FileReader();
        lector.onload = (e: any) => {
          let imgId = '';
          if (lado === 'frente') imgId = 'vistaPreviaFrente';
          else if (lado === 'atras') imgId = 'vistaPreviaAtras';
          else if (lado === 'rostro') imgId = 'vistaPreviaRostro';
          const img = document.getElementById(imgId) as HTMLImageElement;
          if (img) {
            img.src = e.target.result;
            img.style.display = 'block';
          }
        };
        lector.readAsDataURL(archivo);
      }
    }
  }

  volver() {
    window.location.href = '/bienvenida'
  }


  enviarData() {
    this.terminosResumen = this.terminos && this.datos && this.veridica

    const reservaData = new FormData();
    reservaData.append('nombre', this.nombre);
    reservaData.append('cc', this.cc);
    reservaData.append('email', this.email);
    reservaData.append('telefono', this.telefono);
    reservaData.append('fechaLlegada', this.fechaInicio);
    reservaData.append('fechaSalida', this.fechaFin);
    reservaData.append('cantidad', this.personas.toString());
    reservaData.append('terminos', this.terminosResumen.toString());
    if (this.Frontal) reservaData.append('documento_f', this.Frontal)
    if (this.Atras) reservaData.append('documento_p', this.Atras)
    if (this.Rostro) reservaData.append('rostro', this.Rostro)


    console.log('=== CONTENIDO DEL FORMDATA ===');
    for (let pair of reservaData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }
    this.reservaService.crearReserva(reservaData).subscribe({
      
      next: (response) => {
        console.log('Reserva enviada correctamente', response);
        window.location.href = '/miReserva'

      },
      error: (error) => {
        console.error('Error al enviar la reserva', error);
      }
    });
  }
}
