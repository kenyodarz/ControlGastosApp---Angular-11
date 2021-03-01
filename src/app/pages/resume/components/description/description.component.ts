// Angular
import { Component, OnInit } from '@angular/core';
// PrimeNG
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Servicios
import { AuthService } from 'src/app/core/services/auth.service';
import { DescriptionService } from 'src/app/core/services/description.service';
// Modelos
import { Description } from 'src/app/core/models/description';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css'],
})
export class DescriptionComponent implements OnInit {
  descriptions: Description[];
  description: Description = {
    idDescripcion: null,
    nombre: null,
    descripcion: null,
    tipoDescripcion: null,
  };
  selectedDescription: Description;
  cols: any[];
  item: MenuItem[];
  selectedTipoDescripcion: SelectItem[];
  form: any = {};
  isSuccessful: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage: string = '';
  items: MenuItem[];
  displaySaveEditDialog: boolean = false;

  constructor(
    private descriptionService: DescriptionService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  obtenerDescripciones(): void {
    this.descriptionService.getAll().subscribe((result: any) => {
      let descriptions: Description[] = [];
      for (let index = 0; index < result.length; index++) {
        let description = result[index] as Description;
        descriptions.push(description);
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
      // console.log(this.descriptions);
    });
  }

  guardar() {
    this.descriptionService.save(this.description).subscribe(
      (result: any) => {
        let description = result as Description;
        this.validarDescription(description);
        this.messageService.add({
          severity: 'success',
          summary: 'Resultado',
          detail: 'Se ha Guardado la Descripcion Correctamente',
        });
        this.displaySaveEditDialog = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  validarDescription(description: Description) {
    let index = this.descriptions.findIndex(
      (element) => element.idDescripcion == description.idDescripcion
    );
    if (index != -1) {
      this.descriptions[index] = description;
    } else {
      this.descriptions.push(description);
    }
  }

  onRowEditInit(description: Description) {
    this.selectedDescription = description;
  }

  onRowEditSave(description: Description) {
    this.description = description;
    this.guardar();
  }

  eliminar() {
    if (
      this.selectedDescription == null ||
      this.selectedDescription.idDescripcion == null
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advertencia!!!',
        detail: 'No ha Seleccionado Ninguna Descripcion',
      });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar la Descripcion?',
      accept: () => {
        this.descriptionService
          .delete(this.selectedDescription.idDescripcion)
          .subscribe((resutl: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Resultado',
              detail:
                'Se elimino la descripcion ' + resutl.nombre + ' correctamente',
            });
            this.eliminarDescription(resutl.id);
          });
      },
    });
  }

  eliminarDescription(id: number) {
    let index = this.descriptions.findIndex((e) => e.idDescripcion == id);
    if (index != -1) {
      this.descriptions.splice(index, 1);
    }
    this.obtenerDescripciones();
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

  showSaveDialog(editar: boolean) {
    if (editar) {
      if (
        this.selectedDescription != null &&
        this.selectedDescription.idDescripcion != null
      ) {
        this.description = this.selectedDescription;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'No ha Seleccionado ninguna descripcion',
        });
        return;
      }
    } else {
      this.description = new Description();
    }
    this.displaySaveEditDialog = true;
  }

  ngOnInit(): void {
    this.obtenerDescripciones();
    this.selectedTipoDescripcion = [
      { label: 'Seleccione Tipo Descripcion', value: null },
      { label: 'Ingreso', value: 'INGRESO' },
      { label: 'Gasto', value: 'GASTO' },
      { label: 'Saldo', value: 'SALDO' },
    ];
    this.cols = [
      // { field: 'id', header: 'ID' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'tipoDescripcion', header: 'Tipo' },
    ];
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: () => this.showSaveDialog(false),
      },
      // {
      //   label: 'Editar',
      //   icon: 'pi pi-fw pi-pencil',
      //   command: () => this.showSaveDialog(true),
      // },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: () => this.eliminar(),
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerDescripciones(),
      },
    ];
  }
}
