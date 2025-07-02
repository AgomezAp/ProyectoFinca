import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environments.development';

@Injectable({
    providedIn: 'root'
})
export class ImagenService {
    private appUrl : string;
    private apiUrl : string;

    constructor(private http: HttpClient) {
        this.appUrl = environment.apiUrl
        this.apiUrl = 'api/imagen'
    }

    getImagenUrl(nombreDocumento: string): string {
        return `${this.appUrl}${this.apiUrl}/${nombreDocumento}`;
    }

}