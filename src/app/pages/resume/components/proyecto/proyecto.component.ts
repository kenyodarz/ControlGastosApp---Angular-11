// Angular
import { Component, OnInit } from '@angular/core';
import {
  Validators,
  UntypedFormControl,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { ProyectoService } from 'src/app/core/services/proyecto.service';
import { AuthService } from 'src/app/core/services/auth.service';
// Modelos
import { Proyecto } from 'src/app/core/models/Proyecto';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css'],
})
export class ProyectoComponent implements OnInit {
  proyectos: Proyecto[];
  proyecto: Proyecto = {
    idProyecto: null,
    nombre: null,
  };
  selectedProyecto: Proyecto = {
    idProyecto: null,
    nombre: null,
  };
  cols: any[];
  items: MenuItem[];
  form: any = {};
  proyectoForm: UntypedFormGroup;
  isSuccessful: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage: string = '';
  displaySaveEditDialog: boolean = false;

  constructor(
    private proyectoService: ProyectoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private fb: UntypedFormBuilder
  ) {}

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

  guardar() {
    this.proyectoService.save(this.proyecto).subscribe(
      (result: any) => {
        let proyecto = result as Proyecto;
        this.messageService.add({
          severity: 'success',
          summary: 'Resultado',
          detail: 'Se ha Guardado el Proyecto Correctamente',
        });
        this.displaySaveEditDialog = false;
        this.validarProyecto(proyecto);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  validarProyecto(proyecto: Proyecto) {
    let index = this.proyectos.findIndex(
      (e) => e.idProyecto === proyecto.idProyecto
    );
    if (index != 1) {
      this.proyectos[index] = proyecto;
    } else {
      this.proyectos.push(proyecto);
    }
    this.obtenerProyectos();
    this.proyectoForm.reset();
  }

  eliminar() {
    if (
      this.selectedProyecto == null ||
      this.selectedProyecto.idProyecto == null
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advertencia!!!',
        detail: 'No ha Seleccionado Ningun Proyecto',
      });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar este Proyecto?',
      accept: () => {
        this.proyectoService.delete(this.selectedProyecto.idProyecto).subscribe(
          (result: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Resultado',
              detail:
                'se elimino la descripcion ' +
                result.idProyecto +
                ' correctamente',
            });
            this.eliminarProyecto(result.idProyecto);
          },
          (error) => {
            console.log(error);
            this.messageService.add({
              summary: 'danger',
              severity: 'Error',
              detail:
                'No se puede eliminar el proyecto si hay hay registros vinculados',
            });
          }
        );
      },
    });
  }
  eliminarProyecto(idProyecto: any) {
    let index = this.proyectos.findIndex((e) => e.idProyecto === idProyecto);
    if (index != 1) {
      this.proyectos.splice(index, 1);
    }
    this.obtenerProyectos();
  }

  onSubmit() {
    this.authService.register(this.form).subscribe(
      (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      (error) => {
        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  onGuardar() {
    // console.log(this.proyectoForm.value);
    this.proyecto = this.proyectoForm.value;
    this.guardar();
  }

  showSaveDialog(editar: boolean) {
    this.proyectoForm.reset();
    if (editar) {
      if (
        this.selectedProyecto !== null &&
        this.selectedProyecto.idProyecto !== null
      ) {
        this.proyectoForm.patchValue({
          idProyecto: this.selectedProyecto.idProyecto,
        });
        this.proyectoForm.patchValue({ nombre: this.selectedProyecto.nombre });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'No ha Seleccionado ningun Proyecto',
        });
        return;
      }
    } else {
      this.proyecto = new Proyecto();
    }
    this.displaySaveEditDialog = true;
  }

  ngOnInit(): void {
    this.obtenerProyectos();
    this.proyectoForm = this.fb.group({
      idProyecto: new UntypedFormControl('', Validators.required),
      nombre: new UntypedFormControl('', Validators.required),
    });
    this.cols = [
      { field: 'idProyecto', header: 'ID' },
      { field: 'nombre', header: 'Nombre' },
    ];
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: () => this.showSaveDialog(false),
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.showSaveDialog(true),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: () => this.eliminar(),
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerProyectos(),
      },
    ];
  }
}
