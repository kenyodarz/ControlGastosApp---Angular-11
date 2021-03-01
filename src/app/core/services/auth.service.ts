import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


// Contante que lleva la URL de la API_REST
const AUTH_API: string = `${environment.API_URL}/auth/`;
// Contante que nos permite enviar los datos como JSON usando HttpHeaders
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  
  /**
   * Constructor del Servicio
   * @param http Importacion del servicio HttpClient
   */
  constructor(private http: HttpClient) {}
  
  /**
   * Metodo para Logearnos en la API_REST
   * @param credentials Parametros obtenidos desde el formulario del login
   */
  login (credentials): Observable<any>{
    return this.http.post(AUTH_API+"signin",{
      username: credentials.username,
      password: credentials.password
    },httpOptions)
  }

  /**
   * Metodo para crear un Usuario en la API_REST
   * @param user Parametros Obtenidos desde el Formulario de Registro
   */
  register(user): Observable<any>{
    return this.http.post(AUTH_API+"signup",{
      username: user.username,
      name: user.name,
      email: user.email,
      password: user.password
    }, httpOptions)
  }


}
