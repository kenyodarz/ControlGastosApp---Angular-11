// Angular
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// RxJS
import { Observable } from "rxjs";
// Modelo
import { Proyecto } from "src/app/models/Proyecto";
/** Variable de Entorno */
import { environment } from 'src/environments/environment';

const API_URL: string = `${environment.API_URL}/proyecto/`;

@Injectable({
  providedIn: "root"
})
export class ProyectoService {
  /**
   * Constructor del Servicio
   * @param http Importacion del Servicio HTTPClient
   */
  constructor(private http: HttpClient) {}

  /**
   * Metodo que nos permite listar todos los elementos de la API_REST
   */
  getAll(): Observable<any> {
    return this.http.get(API_URL + "all");
  }

  /**
   * Metodo que nos permite guardar o editar datos de la API_REST
   * @param proyecto Objeto de tipo Proyecto enviado a la API_REST para su creacion
   * o edicion atravez del metodo post.
   */
  save(proyecto: Proyecto): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json");
    return this.http.post(API_URL + "save", JSON.stringify(proyecto), {
      headers: headers
    });
  }

  /**
   * Metodo que elimina un valor de la API_REST
   * @param id Parametro obtenido y enviado a la API_REST
   */
  delete(id: string): Observable<any> {
    return this.http.get(API_URL + "delete/" + id);
  }
}
