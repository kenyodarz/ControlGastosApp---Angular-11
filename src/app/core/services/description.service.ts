// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// Modelo
import { Description } from 'src/app/models/description';
/** Variable de Entorno */
import { environment } from 'src/environments/environment';

const API_URL: string = `${environment.API_URL}/description/`;

@Injectable({
  providedIn: 'root',
})
export class DescriptionService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(API_URL + 'all');
  }

  save(description: Description): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(API_URL + 'save', JSON.stringify(description), {
      headers: headers,
    });
  }

  delete(id: number): Observable<any> {
    return this.http.get(API_URL + 'delete/' + id);
  }
}
