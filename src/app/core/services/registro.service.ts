/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/* RxJS */
import { Observable } from 'rxjs';
/* Modelo */
import { RegistroEntrada } from 'src/app/core/models/RegistroEntrada';
/** Variable de Entorno */
import { URL_API } from 'src/environments/environment';

const API_URL: string = `${URL_API}/registro/`;

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(API_URL + 'all');
  }

  save(registro: RegistroEntrada): Observable<any> {
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
