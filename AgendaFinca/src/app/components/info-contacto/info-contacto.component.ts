import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-info-contacto',
  imports: [CommonModule],
  templateUrl: './info-contacto.component.html',
  styleUrl: './info-contacto.component.css'
})
export class InfoContactoComponent implements OnInit, OnDestroy{

  constructor (private router: Router) {}

  @ViewChild('carouselTrack', { static: true }) carouselTrack!: ElementRef;
  @ViewChild('prevBtn', { static: true }) prevBtn!: ElementRef;
  @ViewChild('nextBtn', { static: true }) nextBtn!: ElementRef;

  currentSlide = 0;
  totalSlides = 0;
  autoPlayInterval: any;
  slides: any[] = [];
  indicators: any[] = [];

  galleryItems = [
    {src: 'assets/images/Piscina.webp', alt: 'Piscina', titulo: 'Área de Piscina', descripcion: 'Piscina amplia para disfrutar en familia o con amigos.'},
    {src: 'assets/images/Parrilla.webp', alt: 'Parrilla', titulo: 'Zona de Parrilla', descripcion: 'Área de parrilla para disfrutar de asados y comidas al aire libre.'},
    {src: 'assets/images/Baños.webp', alt: 'Baños', titulo: 'Baños', descripcion: 'Cómodos baños para tu confort durante la visita.'},
    {src: 'assets/images/Estacionamiento.webp', alt: 'Estacionamiento', titulo: 'Estacionamiento', descripcion: 'Amplio estacionamiento para la comodidad de los visitantes.'},
    {src: 'assets/images/Jardines.webp', alt: 'Jardines', titulo: 'Jardines', descripcion: 'Hermosos jardines para pasear y relajarse al aire libre.'},
    {src: 'assets/images/Eventos.webp', alt: 'Eventos', titulo: 'Salón de Eventos', descripcion: 'Salón equipado para reuniones y celebraciones especiales.'},
    {src: 'assets/images/Juegos.webp', alt: 'Juegos', titulo: 'Zona de Juegos', descripcion: 'Espacio dedicado para la diversión de los niños.'},
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.initCarousel();
    })
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  initCarousel(): void {
    this.totalSlides = this.galleryItems.length;

    this.prevBtn.nativeElement.addEventListener('click', () => this.prevSlide());
    this.nextBtn.nativeElement.addEventListener('click', () => this.nextSlide());

    this.indicators = Array.from(document.querySelectorAll('.indicator'));
    this.indicators.forEach((indicator: HTMLElement, index: number) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    this.startAutoPlay();
    this.carouselTrack.nativeElement.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.carouselTrack.nativeElement.addEventListener('mouseleave', () => this.startAutoPlay());

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href')!);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  updateCarousel(): void {
    const tranlateX = -this.currentSlide * 100;
    this.carouselTrack.nativeElement.style.transform = `translateX(${tranlateX}%)`;

    this.indicators.forEach((indicator: HTMLElement, index: number) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
  }
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1) % this.totalSlides;
    this.updateCarousel();
  }

  goToSlide(index:  number): void {
    this.currentSlide = index;
    this.updateCarousel();
  }

  startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000)
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  irABienvenida() {
    this.router.navigate(['/bienvenida']);
  }

  irAInicio() {
    this.router.navigate(['/inicio']);

  }

}
