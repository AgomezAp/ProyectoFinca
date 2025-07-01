import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AgendaService } from '../../services/agenda.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-landing',
  imports: [CommonModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule ,MatInputModule, MatSelectModule], 
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  currentSlideIndex = 0;
  autoPlayInterval: any;
  isInView = false;
  animatedGuestCount = 2;
  guestArray = Array(15).fill(0);
  private observer!: IntersectionObserver;
  fechasOcupadas: any = []
  errorMessage: string = '';
  huespedesSeleccionados: number = 2;
  numeroHuespedes: number[] = Array.from({length: 14}, (_, i) => i + 2);
  constructor(
    private reservaServices: AgendaService,
  ) {}

  @ViewChild('infoSection', { static: false }) infoSection!: ElementRef;
  
  images = [
    'fondo.png',
    'fondo2.png', 
    'fondo3.png'
  ];

  ngOnInit() {
    this.startAutoPlay();
    this.reservaServices.fechas().subscribe((resp) => {
    this.fechasOcupadas = resp.fechasOcupadas || []; 
    console.log("Ocuapadas" + this.fechasOcupadas)
  });
    console.log('Component initialized');
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    if (this.observer) {
      this.observer.disconnect();
    }
  }
  filtrarFechas = (d: Date | null): boolean => {
    if (!d) return true;
    const fecha = d.toISOString().split('T')[0];
    return !this.fechasOcupadas.includes(fecha);
  };

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3 // Se activa cuando 30% de la sección es visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isInView) {
          console.log('Section is now visible, starting animations');
          this.isInView = true;
          this.startGuestCountAnimation();
          
          // Agregar clases de animación a los elementos
          setTimeout(() => {
            this.addAnimationClasses();
          }, 100);
        }
      });
    }, options);

    if (this.infoSection) {
      this.observer.observe(this.infoSection.nativeElement);
    }
  }

  addAnimationClasses() {
    const sectionHeader = document.querySelector('.section-header');
    const featureItems = document.querySelectorAll('.feature-item');
    
    if (sectionHeader) {
      sectionHeader.classList.add('animate-in');
    }
    
    featureItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in');
      }, index * 200); // Animación escalonada
    });
  }

startGuestCountAnimation() {
  if (this.isInView) {
    console.log('🔄 Starting advanced repeating guest count animation');
    
    const patterns = [
      { start: 2, end: 15, speed: 150, pauseTime: 1500 },  // Patrón 1: 2 a 15
      { start: 5, end: 12, speed: 200, pauseTime: 1000 },  // Patrón 2: 5 a 12
      { start: 1, end: 10, speed: 120, pauseTime: 1200 },  // Patrón 3: 1 a 10
      { start: 8, end: 15, speed: 180, pauseTime: 900 }    // Patrón 4: 8 a 15
    ];
    
    let currentPatternIndex = 0;
    
    const animateWithPattern = () => {
      const pattern = patterns[currentPatternIndex];
      let count = pattern.start;
      
      // console.log(`🎯 Starting pattern ${currentPatternIndex + 1}: ${pattern.start} to ${pattern.end}`);
      
      const countInterval = setInterval(() => {
        this.animatedGuestCount = count;
        // console.log(`👥 Pattern ${currentPatternIndex + 1} - Count: ${count}`);
        
        // Efecto visual
        const guestCounter = document.querySelector('.guest-counter');
        if (guestCounter) {
          guestCounter.classList.add('number-change');
          setTimeout(() => {
            guestCounter.classList.remove('number-change');
          }, 200);
        }
        
        count++;
        
        if (count > pattern.end) {
          clearInterval(countInterval);
          
          // Pausa antes del siguiente patrón
          setTimeout(() => {
            currentPatternIndex = (currentPatternIndex + 1) % patterns.length;
            animateWithPattern(); // Siguiente patrón
          }, pattern.pauseTime);
        }
      }, pattern.speed);
    };

    // Iniciar el primer patrón
    animateWithPattern();
  }
}

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.changeSlide(1);
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
  
  changeSlide(direction: number) {
    console.log('BUTTON CLICKED! Direction:', direction);
    
    this.currentSlideIndex += direction;
    
    if (this.currentSlideIndex >= this.images.length) {
      this.currentSlideIndex = 0;
    } else if (this.currentSlideIndex < 0) {
      this.currentSlideIndex = this.images.length - 1;
    }
    
    console.log('New slide index:', this.currentSlideIndex);
    this.onUserInteraction();
  }
  
  goToSlide(index: number) {
    console.log('INDICATOR CLICKED! Index:', index);
    this.currentSlideIndex = index;
    this.onUserInteraction();
  }

  onUserInteraction() {
    this.stopAutoPlay();
    setTimeout(() => {
      this.startAutoPlay();
    }, 10000);
  }

  redirectToReserva() {
    // Obtener los datos del formulario (ejemplo usando template-driven forms)
    const fechaInicio = (document.getElementById('llegada') as HTMLInputElement)?.value || '';
    const fechaFin = (document.getElementById('salida') as HTMLInputElement)?.value || '';
    const huespedes = (document.getElementById('huesped') as HTMLInputElement)?.value || '';

    if (!fechaInicio || !fechaFin) {
    this.errorMessage = 'Debes seleccionar la fecha de llegada y la fecha de salida.';
    return;
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicioDate = new Date(fechaInicio);
    const finDate = new Date(fechaFin);
    if (inicioDate < hoy || finDate < hoy) {
      this.errorMessage = 'Las fechas no pueden ser anteriores a hoy.';
      return;
    }
    if (inicioDate >= finDate) {
      this.errorMessage = 'La fecha de llegada debe ser anterior a la fecha de salida.';
      return;
    }
    const formData = {
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
      Personas: this.huespedesSeleccionados
    };
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      let [month, day, year] = dateStr.split('/');
      month = month.padStart(2, '0');
      day = day.padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const inicio = fechaInicio ? `${formatDate(fechaInicio)}T10:00:00.000Z` : '';
    const fin = fechaFin ? `${formatDate(fechaFin)}T10:00:00.000Z` : '';

    console.log(formData)

    this.reservaServices.Disponibilidad({FechaInicio: inicio, FechaFin: fin}).subscribe((response) => {
      if(response.disponible) {
      localStorage.setItem('reservaFormData', JSON.stringify(formData));
      window.location.href = '/reserva'
      } else {
      this.errorMessage = response.mensaje;
      }
    }
  )
  }
  onHuespedesChange(): void {
    console.log('Huéspedes seleccionados:', this.huespedesSeleccionados);
  }


}