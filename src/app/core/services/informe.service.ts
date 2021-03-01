// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// Modelo
import { Informe } from 'src/app/core/models/Informe';
/** Variable de Entorno */
import { URL_API } from 'src/environments/environment';

const API_URL: string = `${URL_API}/informe/`;

@Injectable({
  providedIn: 'root',
})
export class InformeService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(API_URL + 'all');
  }

  save(informe: Informe): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(API_URL + 'save', JSON.stringify(informe), {
      headers: headers,
    });
  }

  delete(id: number): Observable<any> {
    return this.http.get(API_URL + 'delete/' + id);
  }

}
