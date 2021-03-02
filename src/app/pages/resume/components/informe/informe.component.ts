//Angular
import { Component, OnInit } from '@angular/core';
// PrimeNG
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
// Servicios
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { RegistroService } from 'src/app/core/services/registro.service';
import { RegistroSalidaService } from 'src/app/core/services/registro-salida.service';
import { InformeService } from 'src/app/core/services/informe.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ProyectoService } from 'src/app/core/services/proyecto.service';
// Modelos
import { User } from 'src/app/core/models/User';
import { RegistroEntrada } from 'src/app/core/models/RegistroEntrada';
import { RegistroSalida } from 'src/app/core/models/RegistroSalida';
import { Informe } from 'src/app/core/models/Informe';
import { Proyecto } from 'src/app/core/models/Proyecto';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css'],
})
export class InformeComponent implements OnInit {
  newInforme: boolean;
  total: number = 0;
  debito: number = 0;
  credito: number = 0;
  informes: Informe[] = [];
  informe: Informe = {
    anulado: null,
    fecha: null,
    credito: null,
    debito: null,
    idInforme: null,
    total: null,
    users: null,
    proyecto: null,
  };
  selectedInforme: Informe;
  usuarios: User[];
  selectedUsuario: User;
  gastos: RegistroSalida[];
  selectedGastos: RegistroSalida[] = [];
  desembolsos: RegistroEntrada[];
  selectedDesembolsos: RegistroEntrada[] = [];
  proyectos: Proyecto[];
  selectedProyecto: Proyecto = {
    idProyecto: null,
    nombre: null,
  };
  colsDesembolsos: any[];
  colsGastos: any[];
  habilitarGuardarInforme: boolean = false;
  currentUser: any;
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard: boolean = false;

  constructor(
    private usuarioService: UsuariosService,
    private rEntrada: RegistroService,
    private rSalida: RegistroSalidaService,
    private informeService: InformeService,
    private proyectoService: ProyectoService,
    private token: TokenStorageService,
    private messageService: MessageService
  ) {}

  obtenerUsuarios() {
    this.usuarioService.getAll().subscribe((result: any) => {
      let usuarios: User[] = [];
      for (let index = 0; index < result.length; index++) {
        let usuario = result[index] as User;
        usuarios.push(usuario);
      }
      this.usuarios = usuarios.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
    });
  }

  obtenerDesembolsos() {
    this.rEntrada.getAll().subscribe((result: any) => {
      let desembolsos: RegistroEntrada[] = [];
      for (let index = 0; index < result.length; index++) {
        let e = result[index] as RegistroEntrada;
        if (this.showAdminBoard) {
          if (this.selectedUsuario.username === e.users.username) {
            if (e.informe === null) {
              desembolsos.push(e);
            }
          }
        } else {
          if (this.currentUser.username === e.users.username) {
            if (e.informe === null) {
              desembolsos.push(e);
            }
          }
        }
      }
      this.desembolsos = desembolsos.sort(function (a, b) {
        if (a.fecha > b.fecha) {
          return 1;
        }
        if (a.fecha < b.fecha) {
          return -1;
        }
        return 0;
      });
    });
    // this.sumTotal();
  }
  obtenerGastos() {
    this.rSalida.getAll().subscribe((result: any) => {
      let gastos: RegistroSalida[] = [];
      for (let index = 0; index < result.length; index++) {
        let e = result[index] as RegistroSalida;
        if (this.showAdminBoard) {
          if (this.selectedUsuario.username === e.users.username) {
            if (e.informe === null) {
              gastos.push(e);
            }
          }
        } else {
          if (this.currentUser.username === e.users.username) {
            if (e.informe === null) {
              gastos.push(e);
            }
          }
        }
      }
      this.gastos = gastos.sort(function (a, b) {
        if (a.fecha > b.fecha) {
          return 1;
        }
        if (a.fecha < b.fecha) {
          return -1;
        }
        return 0;
      });
      this.selectedGastos = this.gastos;
      this.sumTotal();
    });
  }

  nuevoInforme() {
    this.newInforme = false;
  }
  verInforme() {
    this.newInforme = true;
    this.obtenerInformes();
  }

  onUserChange() {
    this.selectedDesembolsos = [];
    this.selectedGastos = [];
    this.obtenerDesembolsos();
    this.obtenerGastos();
  }
  onProyectoChange() {}

  sumTotal() {
    this.total = 0;
    this.debito = 0;
    this.credito = 0;
    if (this.selectedDesembolsos.length > 0) {
      this.selectedDesembolsos.forEach((e) => {
        this.debito += e.cantidad;
      });
    }
    // console.log(this.selectedGastos.length > 0);
    if (this.selectedGastos.length > 0) {
      this.selectedGastos.forEach((e) => {
        this.credito += e.cantidad;
      });
    }
    this.total = this.debito - this.credito;
    if (this.selectedDesembolsos.length > 0 && this.selectedGastos.length > 0) {
      this.habilitarGuardarInforme = true;
    }
    // if (this.selectedGastos.length > 0 && this.total >= 0) {
    //   this.habilitarGuardarInforme = true;
    // } else {
    //   this.habilitarGuardarInforme = false;
    // }
    // console.log(this.habilitarGuardarInforme);
  }

  generarInforme() {
    if (
      this.selectedProyecto == null ||
      this.selectedProyecto.idProyecto == null
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'error',
        detail: 'Debe Seleccionar un proyecto',
      });
      return;
    }
    this.informe.anulado = false;
    this.informe.fecha = new Date();
    this.informe.users = this.selectedUsuario;
    this.informe.debito = this.debito;
    this.informe.credito = this.credito;
    this.informe.total = this.total;
    this.informe.proyecto = this.selectedProyecto;
    // console.log(this.informe);
    this.guardarInforme();
    this.selectedUsuario = null;
  }

  /* 
  Aqui Arme un Enrredo tratando con el informe negativo para ahorrar
  tiempo decidi usar dos funciones la normal operativoa cuando es positiva y otra que
  modifique cuando es negativa para poder resolver el problema
   */

  operacionDesembolso(informe: Informe): void {
    console.log('Positivo');
    let credito = 0 - this.credito;
    let s = informe.idInforme;
    let desembolso: RegistroEntrada;
    this.selectedDesembolsos.forEach((e) => {
      if (credito + e.cantidad < 0) {
        credito = credito + e.cantidad;
        e.cerrado = true;
        e.informe = informe;
        this.guardarDesembolso(e);
      } else {
        desembolso = e;
        e.informe = informe;
        e.cerrado = true;
        this.guardarDesembolso(e);
      }
    });
    desembolso.cantidad = desembolso.cantidad + credito;
    desembolso.observaciones = desembolso.observaciones + ' - S';
    //  + s;
    desembolso.idRegistro = null;
    desembolso.cerrado = null;
    desembolso.informe = null;
    this.guardarDesembolso(desembolso);
    this.selectedDesembolsos = [];
  }

  operacionDesembolsoNegativo(informe: Informe): void {
    console.log('Negativo');
    let credito: number;
    if (this.credito < 0) {
      credito = this.credito;
    } else {
      credito = 0 - this.credito;
    }
    console.log(`credito ${credito}`);
    let desembolso: RegistroEntrada;
    this.selectedDesembolsos.forEach((e) => {
      if (credito + e.cantidad < 0) {
        console.log(
          `Aca estamos con cantidad+credito < 0 ${credito + e.cantidad < 0}`
        );

        desembolso = e;
        credito = credito + e.cantidad;
        e.cerrado = true;
        e.informe = informe;
        this.guardarDesembolso(e);
      } else {
        console.log(
          `aca entramos si ${credito + e.cantidad < 0} entoces ${this.credito}`
        );

        desembolso = e;
        e.informe = informe;
        e.cerrado = true;
        this.guardarDesembolso(e);
      }
    });
    if (credito < 0) {
      let newDesembolso = new RegistroEntrada();
      newDesembolso.cantidad = credito;
      newDesembolso.observaciones = desembolso.observaciones + ' - S';
      newDesembolso.description = desembolso.description;
      newDesembolso.users = desembolso.users;
      console.log(newDesembolso);
      this.guardarDesembolso(newDesembolso);
    } else {
      desembolso.cantidad = credito + desembolso.cantidad;
      desembolso.observaciones = desembolso.observaciones + ' - S';
      //  + s;
      desembolso.idRegistro = null;
      desembolso.cerrado = null;
      desembolso.informe = null;
      console.log(desembolso);
      this.guardarDesembolso(desembolso);
    }
    this.selectedDesembolsos = [];
    this.desembolsos = [];
  }

  operacionGasto(informe: Informe) {
    let gastos = this.selectedGastos;
    gastos.forEach((e) => {
      e.informe = informe;
      this.guardarGasto(e);
    });
    this.selectedGastos = [];
    this.gastos = [];
    console.log(this.total);
    if (this.total < 0) {
      console.log('Vamos al negativo');
      this.operacionDesembolsoNegativo(informe);
    } else {
      console.log('Vamos al Positivo');
      this.operacionDesembolso(informe);
    }
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getToken();
    if (this.isLoggedIn) {
      const user = this.token.getUser();
      this.roles = user.roles;
      this.currentUser = user;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      // console.log(this.showAdminBoard);
      // this.username = user.username;
    }
    if (this.showAdminBoard) {
      this.obtenerUsuarios();
    } else {
      this.selectedDesembolsos = [];
      this.selectedGastos = [];
      this.obtenerDesembolsos();
      this.obtenerGastos();
    }
    this.obtenerProyectos();
    this.colsDesembolsos = [
      { field: 'observaciones', header: 'Descripcion' },
      { field: 'description', subfield: 'nombre', header: 'Tipo Descripcion' },
      // { field: 'tipo', header: 'Registro' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'users', subfield: 'name', header: 'Usuario' },
    ];
    this.colsGastos = [
      { field: 'fecha', header: 'Fecha' },
      { field: 'description', subfield: 'nombre', header: 'Descripcion' },
      { field: 'observaciones', header: 'Observaciones' },
      { field: 'cantidad', header: 'Cantidad' },
    ];
  }

  obtenerInformes() {
    this.informeService.getAll().subscribe((result: any) => {
      let informes: Informe[] = [];
      for (let index = 0; index < result.length; index++) {
        let e = result[index] as Informe;
        informes.push(e);
      }
      this.informes = informes.sort((a, b) => {
        if (a.idInforme > b.idInforme) return 1;
        if (a.idInforme < b.idInforme) return -1;
        return 0;
      });
    });
  }

  obtenerProyectos() {
    this.proyectoService.getAll().subscribe(
      (result: any) => {
        let proyectos: Proyecto[] = [];
        for (let i = 0; i < result.length; i++) {
          let proyecto = result[i] as Proyecto;
          proyectos.push(proyecto);
        }
        this.proyectos = proyectos.sort(function (a, b) {
          if (a.nombre > b.nombre) {
            return 1;
          }
          if (a.nombre < b.nombre) {
            return -1;
          }
          // Cuando Son Iguales Retornamos 0
          return 0;
        });
        // console.log(this.proyectos);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  guardarDesembolso(desembolso: RegistroEntrada) {
    this.rEntrada.save(desembolso).subscribe((result: any) => {
      let registro = result as RegistroEntrada;
      this.messageService.add({
        severity: 'success',
        summary: 'Resultado',
        detail:
          'Se ha Editado el Registro' +
          registro.observaciones +
          ' Correctamente',
      });
    });
  }
  guardarGasto(gasto: RegistroSalida) {
    this.rSalida.save(gasto).subscribe((result: any) => {
      let gasto = result as RegistroSalida;
      this.messageService.add({
        severity: 'success',
        summary: 'Resultado',
        detail:
          'Se has Editado los siguientes gastos' +
          gasto.observaciones +
          ' Correctamente',
      });
    });
  }
  guardarInforme() {
    this.informeService.save(this.informe).subscribe((res: any) => {
      let informe = res as Informe;
      this.messageService.add({
        severity: 'success',
        summary: 'Resultado',
        detail:
          'Se ha creado el informe nro.' + informe.idInforme + ' Correctamente',
      });
      this.operacionGasto(informe);
    });
  }
}
