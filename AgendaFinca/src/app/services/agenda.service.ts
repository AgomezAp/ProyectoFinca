import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environments.development';

@Injectable({
    providedIn: 'root'
})
export class AgendaService {
    private appUrl : string;
    private apiUrl : string;

    constructor(private http: HttpClient) {
        this.appUrl = environment.apiUrl
        this.apiUrl = 'api/reserva'
    }

    Disponibilidad(body: any): Observable<any> {
        return this.http.post(`${this.appUrl}${this.apiUrl}/disponibilidad`, body)
    }

    fechas(): Observable<any> {
        return this.http.get(`${this.appUrl}${this.apiUrl}/fechas`)
    }

    reservas(): Observable<any> {
        return this.http.get(`${this.appUrl}${this.apiUrl}/obtenerReservas`)
    }

    crearReserva(body: any): Observable<any> {
        return this.http.post(`${this.appUrl}${this.apiUrl}/crearReserva`, body)
    }

    reservaEmail(correo: string): Observable<any> {
        return this.http.get(`${this.appUrl}${this.apiUrl}/obtenerReserva/email/${correo}`)
    }

    reservaCc(cc: string): Observable<any> {
        return this.http.get(`${this.appUrl}${this.apiUrl}/obtenerReserva/cc/${cc}`)
    }

}