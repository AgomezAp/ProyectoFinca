import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AgendaService } from '../../../services/agenda.service';
interface DiaCalendario {
  numero: number;
  fecha: Date;
  otroMes: boolean;
  esHoy: boolean;
  seleccionado: boolean;
  reservas: any[];
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  imports: [DatePipe, CommonModule]
})
export class CalendarioComponent implements OnInit {
  mesActual: number = new Date().getMonth();
  anioActual: number = new Date().getFullYear();
  
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  diasMes: DiaCalendario[] = [];
  diaSeleccionado: DiaCalendario | null = null;
  
  // Datos de ejemplo - reemplazar con tu servicio
  reservas: any[] = [];

  constructor(private router: Router, private agendaService: AgendaService) {}

  ngOnInit() {
    this.mostrarReservas();
    this.generarCalendario();
  }

  mostrarReservas() {
    this.agendaService.reservasCalendario().subscribe((data: any[]) => {
      const start = performance.now();
      this.reservas = data;
      const end = performance.now();
      console.log(`Tiempo en obtener y procesar reservas: ${(end - start).toFixed(2)} ms`);
      console.log(this.reservas)
    })
  }
  generarCalendario() {
    const primerDia = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDia = new Date(this.anioActual, this.mesActual + 1, 0);
    const primerDiaSemana = primerDia.getDay();
    const hoy = new Date();
    
    this.diasMes = [];
    
    // Días del mes anterior
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const fecha = new Date(this.anioActual, this.mesActual, -i);
      this.diasMes.push({
        numero: fecha.getDate(),
        fecha,
        otroMes: true,
        esHoy: this.esMismaFecha(fecha, hoy),
        seleccionado: false,
        reservas: this.obtenerReservasPorFecha(fecha)
      });
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fecha = new Date(this.anioActual, this.mesActual, dia);
      this.diasMes.push({
        numero: dia,
        fecha,
        otroMes: false,
        esHoy: this.esMismaFecha(fecha, hoy),
        seleccionado: false,
        reservas: this.obtenerReservasPorFecha(fecha)
      });
    }
    
    // Completar con días del mes siguiente
    const diasRestantes = 42 - this.diasMes.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual + 1, dia);
      this.diasMes.push({
        numero: dia,
        fecha,
        otroMes: true,
        esHoy: this.esMismaFecha(fecha, hoy),
        seleccionado: false,
        reservas: this.obtenerReservasPorFecha(fecha)
      });
    }
  }

  esMismaFecha(fecha1: Date, fecha2: Date): boolean {
    return fecha1.getFullYear() === fecha2.getFullYear() &&
           fecha1.getMonth() === fecha2.getMonth() &&
           fecha1.getDate() === fecha2.getDate();
  }

  obtenerReservasPorFecha(fecha: Date): any[] {
    return this.reservas.filter(reserva => {
      const llegada = new Date(reserva.fechaLlegada);
      const salida = new Date(reserva.fechaSalida);
      return fecha >= llegada && fecha <= salida;
    });
  }

  mesAnterior() {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.generarCalendario();
  }

  mesSiguiente() {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.generarCalendario();
  }

  irAHoy() {
    const hoy = new Date();
    this.mesActual = hoy.getMonth();
    this.anioActual = hoy.getFullYear();
    this.generarCalendario();
  }

  seleccionarDia(dia: DiaCalendario) {
    // Limpiar selección anterior
    this.diasMes.forEach(d => d.seleccionado = false);
    
    // Seleccionar nuevo día
    dia.seleccionado = true;
    this.diaSeleccionado = dia;
  }

  cerrarModal() {
    this.diaSeleccionado = null;
  }

  obtenerNombreMes(mes: number): string {
    return this.nombresMeses[mes];
  }

  obtenerInfoMes(): string {
    const totalDias = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    const reservasDelMes = this.reservas.filter(reserva => {
      const fecha = new Date(reserva.fechaLlegada);
      return fecha.getMonth() === this.mesActual && fecha.getFullYear() === this.anioActual;
    }).length;
    
    return `${totalDias} días • ${reservasDelMes} reservas`;
  }

  obtenerReservasConfirmadas(): number {
    return this.reservas.filter(reserva => {
      const fecha = new Date(reserva.fechaLlegada);
      return fecha.getMonth() === this.mesActual && 
             fecha.getFullYear() === this.anioActual && 
             reserva.confirmado === true;
    }).length;
  }

  obtenerReservasPendientes(): number {
    return this.reservas.filter(reserva => {
      const fecha = new Date(reserva.fechaLlegada);
      return fecha.getMonth() === this.mesActual && 
             fecha.getFullYear() === this.anioActual && 
             reserva.confirmado === null;
    }).length;
  }

  esDiaOcupado(dia: DiaCalendario): boolean {
    return dia.reservas.some(reserva => reserva.confirmado === true);
  }

  tieneReservaConfirmada(dia: DiaCalendario): boolean {
    return dia.reservas.some(reserva => reserva.confirmado === true);
  }

  tieneReservaPendiente(dia: DiaCalendario): boolean {
    return dia.reservas.some(reserva => reserva.confirmado === null);
  }

  irAGestionReservas() {
    this.router.navigate(['/panel'], { skipLocationChange: false });
    this.cerrarModal();
  }
}
