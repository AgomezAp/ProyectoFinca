import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-reserva',
  imports: [CommonModule, FormsModule ],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent {
  fechaInicio: string = '';
  fechaFin: string = ''; 
  personas: number = 0; 
  
  ngOnInit() {
    const formDataString = localStorage.getItem('reservaFormData');
    if (formDataString) {
      const formData = JSON.parse(formDataString);
      this.fechaInicio = formData.FechaInicio || '';
      this.fechaFin = formData.FechaFin || '';
      this.personas = formData.Personas;
    }
    console.log(formDataString)
  }
  
  mostrarVistaPrevia(event: any, lado: 'frente' | 'atras') {
    const archivo = event.target.files[0];
    if (archivo && archivo.type.startsWith('image/')) {
      const lector = new FileReader();
      lector.onload = function(e: any) {
        const img = document.getElementById(lado === 'frente' ? 'vistaPreviaFrente' : 'vistaPreviaAtras') as HTMLImageElement;
        img.src = e.target.result;
        img.style.display = 'block';
      };
      lector.readAsDataURL(archivo);
    }
  }
  
}
