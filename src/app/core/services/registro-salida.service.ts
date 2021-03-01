/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/* RxJS */
import { Observable } from 'rxjs';
/* Modelo */
import { RegistroSalida } from 'src/app/models/RegistroSalida';
/** Variable de Entorno */
import { environment } from 'src/environments/environment';

const API_URL: string = `${environment.API_URL}/registroSalida/`;

@Injectable({
  providedIn: 'root',
})
export class RegistroSalidaService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(API_URL + 'all');
  }

  save(registro: RegistroSalida): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(API_URL + 'save', JSON.stringify(registro), {
      headers: headers,
    });
  }

  delete(id: number): Observable<any> {
    return this.http.get(API_URL + 'delete/' + id);
  }
}
