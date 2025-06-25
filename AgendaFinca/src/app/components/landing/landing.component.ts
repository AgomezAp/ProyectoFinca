import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AgendaService } from '../../services/agenda.service';
@Component({
  selector: 'app-landing',
  imports: [CommonModule],
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
    const huespedesCantidad = parseInt(huespedes)
    
    const formData = {
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
      Personas: huespedesCantidad
    };

    this.reservaServices.Disponibilidad({FechaInicio: `${fechaInicio}T10:00:00.000Z`, FechaFin: `${fechaFin}T10:00:00.000Z`}).subscribe((response) => {
      if(response.disponible) {
      localStorage.setItem('reservaFormData', JSON.stringify(formData));
      window.location.href = '/reserva'
      } else {
      alert(response.mensaje)
      }
    })
  }
}