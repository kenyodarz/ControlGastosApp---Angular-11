// Angular
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService} from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Servicios
import { DescriptionService } from 'src/app/core/services/description.service';
import { RegistroService } from 'src/app/core/services/registro.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { ProyectoService } from 'src/app/core/services/proyecto.service';
// Modelos
import { RegistroEntrada } from 'src/app/core/models/RegistroEntrada';
import { Description } from 'src/app/core/models/description';
import { Proyecto } from 'src/app/core/models/Proyecto';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-registros-entrada',
  templateUrl: './registros-entrada.component.html',
  styleUrls: ['./registros-entrada.component.css'],
})
export class RegistrosEntradaComponent implements OnInit {
  registros: RegistroEntrada[];
  registro: RegistroEntrada = {
    idRegistro: null,
    cantidad: null,
    description: null,
    fecha: null,
    observaciones: null,
    tipo: null,
    users: null,
    cerrado: null,
    informe: null,
  };
  selectedRegistro: RegistroEntrada;
  descriptions: Description[];
  selectedDescription: Description;
  usuarios: User[];
  selectedUsuario: User;
  cols: any[];
  items: MenuItem[];
  form: any = {};
  isSuccessful: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage: string = '';
  displaySaveEditDialog: boolean = false;
  formRegistro: FormGroup;
  es: any;
  date1: Date;
  proyectos: Proyecto[];
  selectedProyecto: Proyecto;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private descriptionService: DescriptionService,
    private registroService: RegistroService,
    private usuariosService: UsuariosService,
    private proyectoService: ProyectoService
  ) {}

  obtenerDescripciones(): void {
    this.descriptionService.getAll().subscribe((result: any) => {
      let descriptions: Description[] = [];
      for (let index = 0; index < result.length; index++) {
        let description = result[index] as Description;
        if (description.tipoDescripcion == 'INGRESO') {
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

  obtenerUsuarios(): void {
    this.usuariosService.getAll().subscribe(
      (result: any) => {
        let users: User[] = [];
        for (let index = 0; index < result.length; index++) {
          let user = result[index] as User;
          users.push(user);
        }
        this.usuarios = users.sort(function (a, b) {
          if (a.username > b.username) {
            return 1;
          }
          if (a.username < b.username) {
            return -1;
          }
          //Cuando son iguales
          return 0;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  obtenerRegistrosEntrada(): void {
    this.registroService.getAll().subscribe(
      (result: any) => {
        let registrosEntradas: RegistroEntrada[] = [];
        for (let index = 0; index < result.length; index++) {
          let registroEntrada = result[index] as RegistroEntrada;
          registrosEntradas.push(registroEntrada);
        }
        this.registros = registrosEntradas.sort(function (a, b) {
          if (a.fecha > b.fecha) {
            return -1;
          }
          if (a.fecha < b.fecha) {
            return 1;
          }
          // Si a y b son iguales
          return 0;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  guardar() {
    this.registroService.save(this.registro).subscribe((result: any) => {
      let registro = result as RegistroEntrada;
      this.validarRegistroEntrada(registro);
      this.messageService.add({
        severity: 'success',
        summary: 'Resultado',
        detail: 'Se ha Editado el Registro Correctamente',
      });
      this.displaySaveEditDialog = false;
    });
  }
  validarRegistroEntrada(registro: RegistroEntrada) {
    let index = this.registros.findIndex(
      (e) => e.idRegistro === registro.idRegistro
    );
    if (index != -1) {
      this.registros[index] = registro;
    } else {
      this.registros.push(registro);
    }
  }

  guardarRegistro() {
    // this.formRegistro.patchValue({ users: this.selectedUsuario });
    // console.log(this.formRegistro.value);
    this.registro = this.formRegistro.value;
    this.registroService.save(this.registro).subscribe(
      (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡¡Exito!!',
          detail: 'Se ha registrado correctamente',
        });
        // console.log(result);
        this.formRegistro.reset();
        this.selectedRegistro = null;
        this.displaySaveEditDialog = false;
        this.obtenerRegistrosEntrada();
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: '¡¡Error!!',
          detail:
            'Se ha Producido un error al guardar. ' +
            'Verifique los datos e intentelo nuevamente',
        });
      }
    );
  }

  mostrarDialogoGuardar(editar: boolean) {
    this.formRegistro.reset();
    if (editar) {
      if (
        this.selectedRegistro != null &&
        this.selectedRegistro.idRegistro != null
      ) {
          // this.formRegistro.patchValue({
          //   idRegistroSalida: this.selectedRegistro.idRegistro,
          // });
          this.formRegistro.patchValue({
            observaciones: this.selectedRegistro.observaciones,
          });
          this.formRegistro.patchValue({
            description: this.selectedRegistro.description,
          });
          this.formRegistro.patchValue({
            fecha: this.selectedRegistro.fecha,
          });
          this.formRegistro.patchValue({
            cantidad: this.selectedRegistro.cantidad,
          });
          this.formRegistro.patchValue({
            tipo: this.selectedRegistro.tipo,
          });
          this.formRegistro.patchValue({
            idRegistro: this.selectedRegistro.idRegistro,
          });
          this.formRegistro.patchValue({
            users: this.selectedRegistro.users,
          });
        } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'No ha Seleccionado ningun Registro',
        });
        return;
      }
    } else {
      this.registro = new RegistroEntrada();
    }
    this.displaySaveEditDialog = true;
  }

  eliminar(): void {
    if (
      this.selectedRegistro == null ||
      this.selectedRegistro.idRegistro == null
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advertencia!!!',
        detail: 'No ha Seleccionado Ningun Registro',
      });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar la Descripcion?',
      accept: () => {
        this.registroService.delete(this.selectedRegistro.idRegistro).subscribe(
          (result: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Resultado',
              detail:
                'Se elimino el registro ' +
                result.idRegistro +
                ' correctamente',
            });
            this.eliminarRegistro(result.idRegistro);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'No se puede Eliminar el Desembolso ' +
                'si este tiene saldos o gastos asignados a el.',
            });
          }
        );
      },
    });
  }
  eliminarRegistro(idRegistro: any) {
    let index = this.registros.findIndex((e) => e.idRegistro == idRegistro);
    if (index != -1) {
      this.registros.splice(index, 1);
    }
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

  ngOnInit(): void {
    this.obtenerDescripciones();
    this.obtenerRegistrosEntrada();
    this.obtenerUsuarios();
    this.formRegistro = this.fb.group({
      idRegistro: new FormControl(),
      observaciones: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      tipo: new FormControl(),
      fecha: new FormControl(null, Validators.required),
      cantidad: new FormControl('', [
        Validators.required,
      ]),
      users: new FormControl(null, Validators.required),
    });
    this.cols = [
      { field: 'observaciones', header: 'Descripcion' },
      { field: 'description', subfield: 'nombre', header: 'Tipo Descripcion' },
      // { field: 'tipo', header: 'Registro' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'users', subfield: 'name', header: 'Usuario' },
    ];
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: () => this.mostrarDialogoGuardar(false),
      },
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
        command: () => this.obtenerRegistrosEntrada(),
      },
    ];
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
  }
  get observaciones() {
    return this.formRegistro.get('observaciones');
  }
  get description() {
    return this.formRegistro.get('description');
  }
  get tipo() {
    return this.formRegistro.get('tipo');
  }
  get fecha() {
    return this.formRegistro.get('fecha');
  }
  get cantidad() {
    return this.formRegistro.get('cantidad');
  }
  get users() {
    return this.formRegistro.get('users');
  }
}
