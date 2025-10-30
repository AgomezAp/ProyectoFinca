import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor(private router: Router) {}

  irABienvenida() {
    this.router.navigate(['/bienvenida']);
  }

  irAAbout() {
    this.router.navigate(['/about']);
  }

  whatsapp() {
    window.open('https://wa.me/573003918651', '_blank');
  }

}
