import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AgendaFinca';
  isMobileMenuOpen = false;
  currentRoute: string = ''
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}
  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });

    // Obtener ruta inicial
    this.currentRoute = this.router.url;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  shouldShowCalendario(): boolean {
    return this.currentRoute === '/panel';
  }

  // Método para determinar si mostrar el enlace panel
  shouldShowPanel(): boolean {
    return this.currentRoute === '/calendario';
  }

  // Cerrar menú al redimensionar ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768) {
      this.isMobileMenuOpen = false;
    }
  }

  // Cerrar menú con la tecla Escape
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.closeMobileMenu();
  }
}
