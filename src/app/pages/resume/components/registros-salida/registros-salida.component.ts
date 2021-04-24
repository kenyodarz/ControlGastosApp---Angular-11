// Angular
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Servicios
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { DescriptionService } from 'src/app/core/services/description.service';
import { ProyectoService } from 'src/app/core/services/proyecto.service';
import { RegistroService } from 'src/app/core/services/registro.service';
import { RegistroSalidaService } from 'src/app/core/services/registro-salida.service';
import { SaldoService } from 'src/app/core/services/saldo.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
// Modelos
import { RegistroEntrada } from 'src/app/core/models/RegistroEntrada';
import { RegistroSalida } from 'src/app/core/models/RegistroSalida';
import { Description } from 'src/app/core/models/description';
import { Proyecto } from 'src/app/core/models/Proyecto';
import { Saldo } from 'src/app/core/models/Saldo';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-registros-salida',
  templateUrl: './registros-salida.component.html',
  styleUrls: ['./registros-salida.component.css'],
})
export class RegistrosSalidaComponent implements OnInit {
  currentUser: User = {
    id: null,
    username: null,
    name: null,
    email: null,
  };
  private roles: string[];
  isLoggedIn = false;
  usuarios: User[];
  selectedUsuario: User;
  descriptions: Description[];
  selectedDescription: Description;
  proyectos: Proyecto[];
  selectedProyecto: Proyecto = {
    idProyecto: null,
    nombre: null,
  };
  registrosSalida: RegistroSalida[] = [];
  registroSalida: RegistroSalida = {
    idRegistroSalida: null,
    cantidad: null,
    description: null,
    fecha: null,
    observaciones: null,
    tipo: null,
    users: null,
    informe: null,
  };
  selectedRegistroSalida: RegistroSalida;
  registrosEntrada: RegistroEntrada[] = [];
  saldos: Saldo[] = [];
  selectedSaldo: Saldo[] = [];
  es: any;
  cols: any[];
  items: MenuItem[];
  form: any = {};
  isSuccessful: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage: string = '';
  displaySaveEditDialog: boolean = false;
  total: number = 0;
  debito: number = 0;
  credito: number = 0;
  formRegistroSalida: FormGroup;
  showAdminBoard = false;
  showActions = false;
  hablilitarBotonCerrar = false;
  cerrarTodosRegistros: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private descriptionService: DescriptionService,
    private proyectoService: ProyectoService,
    private registroService: RegistroService,
    private registroSalidaService: RegistroSalidaService,
    private saldoService: SaldoService,
    private usuariosService: UsuariosService,
    private token: TokenStorageService
  ) {}

  obtenerUsuarios(): void {
    if (this.showAdminBoard) {
      this.usuariosService.getAll().subscribe(
        (result: any) => {
          let users: User[] = [];
          for (let index = 0; index < result.length; index++) {
            let user = result[index] as User;
            users.push(user);
          }
          this.usuarios = users;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  obtenerDescripciones(): void {
    this.descriptionService.getAll().subscribe((result: any) => {
      let descriptions: Description[] = [];
      for (let index = 0; index < result.length; index++) {
        let description = result[index] as Description;
        if (description.tipoDescripcion == 'GASTO') {
          descriptions.push(description);
        }
      }
      this.descriptions = descriptions.sort(function (a, b) {
        if (a.nombre > b.nombre) {
          return 1;
        }
        if (a.nombre < b.nombre) {
          return -1;
        }
        // Cuando a y b Son iguales
        return 0;
      });
    });
  }

  obtenerRegistrosEntrada(): void {
    this.registroService.getAll().subscribe(
      (result: any) => {
        let registrosEntradas: RegistroEntrada[] = [];
        for (let index = 0; index < result.length; index++) {
          let registroEntrada = result[index] as RegistroEntrada;
          if (this.showAdminBoard) {
            if (this.currentUser.username == registroEntrada.users.username) {
              if (registroEntrada.informe === null) {
                registrosEntradas.push(registroEntrada);
              }
              // console.log(registroEntrada);
            }
          } else {
            if (this.currentUser.username == registroEntrada.users.username) {
              if (registroEntrada.informe === null) {
                registrosEntradas.push(registroEntrada);
              }
            }
          }
        }
        this.registrosEntrada = registrosEntradas.sort(function (a, b) {
          if (a.fecha > b.fecha) {
            return 1;
          }
          if (a.fecha < b.fecha) {
            return -1;
          }
          // Si a y b son iguales
          return 0;
        });
        this.sumTotal();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  obtenerRegistrosSalid() {
    this.registroSalidaService.getAll().subscribe(
      (result: any) => {
        let registrosSalidas: RegistroSalida[] = [];
        for (let index = 0; index < result.length; index++) {
          let registroSalida = result[index] as RegistroSalida;
          if (this.showAdminBoard) {
            if (this.currentUser.username == registroSalida.users.username) {
              if (registroSalida.informe === null) {
                registrosSalidas.push(registroSalida);
              }
            }
          } else {
            if (this.currentUser.username == registroSalida.users.username) {
              if (registroSalida.informe === null) {
                registrosSalidas.push(registroSalida);
              }
            }
          }
        }
        this.registrosSalida = registrosSalidas.sort(function (a, b) {
          if (a.fecha > b.fecha) {
            return 1;
          }
          if (a.fecha < b.fecha) {
            return -1;
          }
          // Si a y b son iguales
          return 0;
        });
        this.sumTotal();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  obtenerSaldos() {
    this.saldoService.getAll().subscribe((result: any) => {
      let saldos: Saldo[] = [];
      for (let index = 0; index < result.length; index++) {
        let saldo = result[index] as Saldo;
        if (true) {
          saldos.push(saldo);
        }
      }
      this.saldos = saldos.sort(function (a, b) {
        if (a.fecha > b.fecha) {
          return 1;
        }
        if (a.fecha < b.fecha) {
          return 0;
        }
        // Cuando Son Iguales Retornamos 0
        return 0;
      });
      // console.log(this.saldos);
    });
  }
  guardarRegistroSalida(): void {
    this.registroSalidaService
      .save(this.registroSalida)
      .subscribe((result: any) => {
        let registroSalida = result as RegistroSalida;
        this.validarRegistroSalida(registroSalida);
        this.messageService.add({
          severity: 'success',
          summary: 'Resultado',
          detail: 'Se guardo el registro correctamente',
        });
        this.displaySaveEditDialog = false;
      });
    (error) => {
      console.log(error);
      this.messageService.add({
        severity: 'danger',
        summary: 'Error',
        detail: 'Se genero un error al guardar el Registro',
      });
    };
    this.formRegistroSalida.reset();
  }
  validarRegistroSalida(registroSalida: RegistroSalida) {
    let index = this.registrosSalida.findIndex(
      (e) => e.idRegistroSalida == registroSalida.idRegistroSalida
    );
    if (index != -1) {
      this.registrosSalida[index] = registroSalida;
    } else {
      this.registrosSalida.push(registroSalida);
    }
    this.obtenerRegistrosSalid();
  }
  guardarSaldo(s: Saldo, stado: string) {
    this.saldoService.save(s).subscribe(
      (result: any) => {
        let saldo = result as Saldo;
        this.messageService.add({
          severity: 'info',
          summary: 'Correcto',
          detail:
            'Se ha ' +
            stado +
            ' el saldo: ' +
            saldo.observaciones +
            ' correctamente',
        });
        // this.visibleSidebarSaldo = false;
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: '¡¡Error!!',
          detail: 'Se ha Producido el siguiente Error: ' + error,
        });
      }
    );
  }

  mostrarDialogoGuardar(editar: boolean) {
    if (editar) {
      if (
        this.selectedRegistroSalida != null &&
        this.selectedRegistroSalida.idRegistroSalida != null
      ) {
        this.formRegistroSalida.patchValue({
          idRegistroSalida: this.selectedRegistroSalida.idRegistroSalida,
        });
        this.formRegistroSalida.patchValue({
          observaciones: this.selectedRegistroSalida.observaciones,
        });
        this.formRegistroSalida.patchValue({
          description: this.selectedRegistroSalida.description,
        });
        this.formRegistroSalida.patchValue({
          fecha: this.selectedRegistroSalida.fecha,
        });
        this.formRegistroSalida.patchValue({
          cantidad: this.selectedRegistroSalida.cantidad,
        });
        this.formRegistroSalida.patchValue({
          users: this.selectedRegistroSalida.users,
        });

        this.registroSalida = this.selectedRegistroSalida;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'No ha Seleccionado ningun Registro',
        });
        return;
      }
    }
    // else {
    //   this.registroSalida = new RegistroSalida();
    // }
    // this.displaySaveEditDialog = true;
  }

  eliminar(): void {
    if (
      this.selectedRegistroSalida == null ||
      this.selectedRegistroSalida.idRegistroSalida == null
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advertencia!!!',
        detail: 'No ha seleccionado ningun registro',
      });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Está serguro que desea eliminar el registro?',
      accept: () => {
        this.registroSalidaService
          .delete(this.selectedRegistroSalida.idRegistroSalida)
          .subscribe((result: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Resultado',
              detail:
                'Se elimino el registro de ' +
                result.observaciones +
                ' correctamente',
            });
            this.eliminarRegistroSalida(result.idRegistro);
          });
      },
    });
  }
  eliminarRegistroSalida(idRegistro: number) {
    let index = this.registrosSalida.findIndex(
      (e) => e.idRegistroSalida == idRegistro
    );
    if (index != -1) {
      this.registrosSalida.splice(index, 1);
    }
    this.obtenerRegistrosSalid();
  }

  sumTotal() {
    this.total = 0;
    let debito: number = 0;
    let credito: number = 0;
    if (this.registrosEntrada) {
      this.registrosEntrada.forEach((e) => {
        debito += e.cantidad;
      });
    }
    if (this.selectedSaldo) {
      this.selectedSaldo.forEach((e) => {
        debito += e.cantidad;
      });
    }
    if (this.registrosSalida) {
      this.registrosSalida.forEach((e) => {
        credito += e.cantidad;
      });
    }
    this.debito = debito
    this.credito = credito
    this.total = debito - credito;
    // console.log(this.registrosEntrada.length !== 0);
    if (this.registrosEntrada) {
      if (this.registrosEntrada.length > 0) {
        this.showActions = true;
      }
    }
  }

  cargarValores() {
    this.cerrarTodosRegistros = false;
    this.obtenerRegistrosSalid();
    this.obtenerRegistrosEntrada();
    this.saldoxRegistros();
    this.formRegistroSalida.reset();
  }
  saldoxRegistros() {
    this.selectedSaldo = [];
    if (this.saldos.length != 0) {
      this.saldos.forEach((e) => {
        if (e.users == this.currentUser.username) {
          this.selectedSaldo.push(e);
        }
      });
    }
  }

  onSubmit() {
    this.formRegistroSalida.patchValue({
      // registroEntrada: this.selectedRegistroEntrada,
    });
    this.formRegistroSalida.patchValue({
      proyecto: this.selectedProyecto,
    });
    this.formRegistroSalida.patchValue({
      users: this.currentUser,
    });
    this.registroSalida = this.formRegistroSalida.value;
    /* El siguiente codigo queda en desuso por cambio de politicas del cliente */
    // if (this.selectedRegistroSalida) {
    //   let a =
    //     this.selectedRegistroSalida.cantidad - this.registroSalida.cantidad;
    //   if (this.total + a < 0) {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Se excede la cantidad disponible por' + (this.total + a),
    //       closable: true,
    //     });
    //     this.formRegistroSalida.reset();
    //     this.selectedRegistroSalida = null;
    //     return;
    //   }
    //   this.guardarRegistroSalida();
    //   this.selectedRegistroSalida = null;
    // } else {
    //   if (this.total >= this.formRegistroSalida.value.cantidad) {
    //     this.guardarRegistroSalida();
    //   } else {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'El gasto ingresado excede el dinero disponible',
    //       closable: true,
    //     });
    //   }
    // }
    this.guardarRegistroSalida();
    this.sumTotal();
  }
  onUserChange() {
    this.currentUser = this.selectedUsuario;
    this.showActions = false;
    this.total = 0;
    this.debito = 0;
    this.credito = 0;
    this.hablilitarBotonCerrar = false;
    this.selectedProyecto = null;
    this.registrosEntrada = null;
    this.obtenerDescripciones();
    this.obtenerRegistrosEntrada();
    this.obtenerSaldos();
  }

  habilitarCierre() {}

  cerrarRegistros() {}

  cerrandoRegistroEntrada() {}
  abriendoRegistroEntrada() {}
  cerrandoSaldos() {}
  abriendoSaldos() {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getToken();
    if (this.isLoggedIn) {
      const user = this.token.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');

      // this.currentUser = null;
      // this.username = user.username;
    }

    const byuser = this.token.getUser();
    this.currentUser.id = byuser.id;
    this.currentUser.email = byuser.email;
    this.currentUser.username = byuser.username;
    this.currentUser.name = byuser.name;
    if (this.showAdminBoard) {
      this.selectedUsuario = this.currentUser;
      this.registrosEntrada = null;
      this.obtenerUsuarios();
      this.currentUser = null;
    }
    this.obtenerDescripciones();
    this.obtenerRegistrosEntrada();
    this.obtenerSaldos();
    this.obtenerRegistrosSalid();
    this.formRegistroSalida = this.fb.group({
      idRegistroSalida: new FormControl(),
      observaciones: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      fecha: new FormControl(null, Validators.required),
      cantidad: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(1),
      ]),
      users: new FormControl(),
    });

    this.es = {
      firstDayOfWeek: 1,
      dayNames: [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
      ],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
      ],
      monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic',
      ],
      today: 'Hoy',
      clear: 'Borrar',
    };

    this.cols = [
      { field: 'fecha', header: 'Fecha' },
      { field: 'description', subfield: 'nombre', header: 'Descripcion' },
      { field: 'observaciones', header: 'Observaciones' },
      { field: 'cantidad', header: 'Cantidad' },
    ];
    this.items = [
      // {
      //   label: 'Nuevo',
      //   icon: 'pi pi-fw pi-plus',
      //   // command: () => this.showSaveDialog(false),
      // },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.mostrarDialogoGuardar(true),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: () => this.eliminar(),
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerRegistrosSalid(),
      },
    ];
  }
}
