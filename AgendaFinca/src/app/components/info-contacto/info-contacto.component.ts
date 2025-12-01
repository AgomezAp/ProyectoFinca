import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeoService } from '../../services/seo.service';
@Component({
  selector: 'app-info-contacto',
  imports: [CommonModule],
  templateUrl: './info-contacto.component.html',
  styleUrl: './info-contacto.component.css'
})
export class InfoContactoComponent implements OnInit, OnDestroy{

  constructor (
    private router: Router,
    private seoService: SeoService
  ) {}

  @ViewChild('carouselTrack', { static: true }) carouselTrack!: ElementRef;
  @ViewChild('prevBtn', { static: true }) prevBtn!: ElementRef;
  @ViewChild('nextBtn', { static: true }) nextBtn!: ElementRef;

  currentSlide = 0;
  totalSlides = 0;
  autoPlayInterval: any;
  slides: any[] = [];
  indicators: any[] = [];

  galleryItems = [
    {src: 'assets/images/Piscina.webp', alt: 'Finca con piscina y jacuzzi para 30 personas - eventos y hospedaje en Pereira', titulo: 'Área de Piscina', descripcion: 'Piscina amplia para disfrutar en familia o con amigos.'},
    {src: 'assets/images/Parrilla.webp', alt: 'Zona BBQ y sonido listos para tu celebración', titulo: 'Zona de Parrilla', descripcion: 'Área de parrilla para disfrutar de asados y comidas al aire libre.'},
    {src: 'assets/images/Baños.webp', alt: 'Baños completos en finca para eventos Pereira', titulo: 'Baños', descripcion: 'Cómodos baños para tu confort durante la visita.'},
    {src: 'assets/images/Estacionamiento.webp', alt: 'Parqueadero interno dentro de la finca - acceso cómodo y seguro', titulo: 'Estacionamiento', descripcion: 'Amplio estacionamiento para la comodidad de los visitantes.'},
    {src: 'assets/images/Jardines.webp', alt: 'Zona verde y jardines para eventos familiares Pereira', titulo: 'Jardines', descripcion: 'Hermosos jardines para pasear y relajarse al aire libre.'},
    {src: 'assets/images/Eventos.webp', alt: 'Salón de eventos finca campestre Pereira', titulo: 'Salón de Eventos', descripcion: 'Salón equipado para reuniones y celebraciones especiales.'},
    {src: 'assets/images/Juegos.webp', alt: 'Zona de juegos infantiles finca familiar Pereira', titulo: 'Zona de Juegos', descripcion: 'Espacio dedicado para la diversión de los niños.'},
  ];

  ngOnInit(): void {
    this.setupSEO();
    setTimeout(() => {
      this.initCarousel();
    })
  }

  setupSEO(): void {
    this.seoService.updateMetaTags({
      title: 'Finca El Progreso en Pereira para 30 personas – Jacuzzi y Piscina',
      description: 'Reserva tu evento sin estrés: piscina, jacuzzi, BBQ, sonido y parqueadero interno. Cotiza por WhatsApp y asegura tu fecha hoy.',
      keywords: 'Finca para eventos en Pereira, Alquiler de finca campestre, finca para fiestas en Pereira, finca para reuniones familiares, Zona verde, Piscina, Zona BBQ, Fogata, Parqueadero, Hospedaje grupos',
      type: 'website',
      url: 'https://www.fincaelprogreso.com'
    });

    // Datos estructurados para Google
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'EventVenue',
      'name': 'Finca El Progreso',
      'description': 'Finca campestre en Pereira con capacidad para 30 personas, piscina, jacuzzi, zona BBQ y parqueadero interno',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Pereira',
        'addressRegion': 'Risaralda',
        'addressCountry': 'CO'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '4.7309281',
        'longitude': '-75.7306993'
      },
      'telephone': '+573011208541',
      'email': 'fincaelprogreso6@gmail.com',
      'amenityFeature': [
        {'@type': 'LocationFeatureSpecification', 'name': 'Piscina'},
        {'@type': 'LocationFeatureSpecification', 'name': 'Jacuzzi'},
        {'@type': 'LocationFeatureSpecification', 'name': 'Zona BBQ'},
        {'@type': 'LocationFeatureSpecification', 'name': 'Fogata'},
        {'@type': 'LocationFeatureSpecification', 'name': 'Parqueadero Interno'},
        {'@type': 'LocationFeatureSpecification', 'name': 'Sistema de Sonido'}
      ],
      'maximumAttendeeCapacity': 30
    };

    this.seoService.updateStructuredData(structuredData);
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
