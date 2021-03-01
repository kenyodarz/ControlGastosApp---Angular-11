// Angular
import { Component, OnInit } from '@angular/core';
// PrimeNG
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Servicios
import { RegistroSalidaService } from 'src/app/core/services/registro-salida.service';
import { DescriptionService } from 'src/app/core/services/description.service';
// Modelos
import { RegistroSalida } from 'src/app/core/models/RegistroSalida';
import { Description } from 'src/app/core/models/description';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss'],
})
export class GastosComponent implements OnInit {
  gastos: RegistroSalida[];
  gasto: RegistroSalida = {
    cantidad: null,
    description: null,
    fecha: null,
    idRegistroSalida: null,
    informe: null,
    observaciones: null,
    tipo: null,
    users: null,
  };
  selectedGasto: RegistroSalida;
  descriptions: Description[];
  selectedDescription: Description;
  cols: any[];
  item: MenuItem[];
  displaySaveEditDialog: boolean = false;
  items: MenuItem[];
  es: any;

  constructor(
    private descriptionService: DescriptionService,
    private registroSalidaService: RegistroSalidaService,
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

  obtenerGastos(): void {
    this.registroSalidaService.getAll().subscribe((result: any) => {
      let gastos: RegistroSalida[] = [];
      for (let index = 0; index < result.length; index++) {
        let e = result[index] as RegistroSalida;
        gastos.push(e);
      }
      this.gastos = gastos.sort(function (a, b) {
        if (a.fecha > b.fecha) {
          return 1;
        }
        if (a.fecha < b.fecha) {
          return -1;
        }
        // Cuando a y b Son iguales
        return 0;
      });
    });
  }
  guardarGastos() {
    this.registroSalidaService.save(this.gasto).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Se ha Guardado el Gasto Correctamente',
        });
        this.displaySaveEditDialog = false;
        this.obtenerGastos();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ha ocurrido un error, revice el mensaje en la consola',
        });
        console.log(error);
      }
    );
  }

  eliminarGasto() {
    if (
      this.selectedGasto == null ||
      this.selectedGasto.idRegistroSalida == null
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advertencia!!!',
        detail: 'No ha Seleccionado ningun Gasto',
      });
      return;
    }
    if (this.selectedGasto.informe) {
      this.messageService.add({
        severity: 'error',
        summary: '¡¡¡Error!!!',
        detail: 'No se puede eliminar un Gasto asignado a un informe',
      });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar el Gasto?',
      accept: () => {
        this.registroSalidaService
          .delete(this.selectedGasto.idRegistroSalida)
          .subscribe((result: any) => {
            this.messageService.add({
              summary: 'success',
              severity: 'Resultado',
              detail:
                'Se elimino el gasto ' +
                result.observaciones +
                ' correctamente',
            });
            this.obtenerGastos();
          });
      },
    });
  }

  mostrarDialogoGuardar(editar: boolean) {
    if (editar) {
      if (
        this.selectedGasto != null &&
        this.selectedGasto.idRegistroSalida != null
      ) {
        this.gasto = this.selectedGasto;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'No ha Seleccionado ningun Gasto',
        });
        return;
      }
    } else {
      this.gasto = new RegistroSalida();
    }
    this.displaySaveEditDialog = true;
  }

  ngOnInit(): void {
    this.obtenerDescripciones();
    this.obtenerGastos();
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
      //   command: () => this.showSaveDialog(false),
      // },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.mostrarDialogoGuardar(true),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: () => this.eliminarGasto(),
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerDescripciones(),
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
}
