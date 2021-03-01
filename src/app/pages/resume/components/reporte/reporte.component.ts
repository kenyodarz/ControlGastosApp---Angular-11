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
// Utilidades
// Enviroment variable
import { URL_API } from 'src/environments/environment';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
})
export class ReporteComponent implements OnInit {
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
  gastos: RegistroSalida[];
  desembolsos: RegistroEntrada[];
  proyectos: Proyecto[];
  cols: any[];
  currentUser: any;
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard: boolean = false;

  constructor(
    private rEntrada: RegistroService,
    private rSalida: RegistroSalidaService,
    private informeService: InformeService,
    private token: TokenStorageService
  ) {}

  abrirPDF() {
    let fileURL: string = null;
    fileURL = `${URL_API}/informe/pdf/${this.selectedInforme.idInforme}`;
    window.open(fileURL);
  }

  /** Genera un pdf desde el HTML: En desuso */
  // generarPDF() {
  //   let documento = document.getElementById('id');
  //   let opciones = {
  //     margin: [0.5, 0, 1, 0.5],
  //     filename: 'GVSC-' + this.selectedInforme.idInforme + '.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     // html2canvas: { scale: 2 },
  //     jsPDF: {
  //       unit: 'cm',
  //       format: 'letter',
  //       orientation: 'portrait',
  //     },
  //   };
  //   // Old monolithic-style usage:
  //   // html2pdf(documento, opciones);
  //   // New Promise-based usage:
  //   // html2pdf().from(documento).set(opciones).save();
  //   html2pdf()
  //     .from(documento)
  //     .set(opciones)
  //     .toPdf()
  //     .get('pdf')
  //     .then(function (pdf) {
  //       // Colocamos en el Pie de Pagina # de la pagina
  //       var totalPages = pdf.internal.getNumberOfPages();
  //       for (let index = 0; index < totalPages; index++) {
  //         pdf.setPage(index);
  //         pdf.setFontSize(10);
  //         pdf.setTextColor(0);
  //         console.log(totalPages - index);
  //         pdf.text(
  //           'Pagina ' + (totalPages - index) + ' de ' + totalPages,
  //           pdf.internal.pageSize.getWidth() - 12,
  //           pdf.internal.pageSize.getHeight() - 0.5
  //         );
  //       }
  //     })
  //     .save();
  // }
  /** Genera un excel desde la tabla de vista previa. En desuso */
  // exportExcel() {
  //   import('xlsx').then((xlsx) => {
  //     const worksheet = xlsx.utils.table_to_sheet(
  //       document.getElementById('id')
  //     );
  //     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  //     const excelBuffer: any = xlsx.write(workbook, {
  //       bookType: 'xlsx',
  //       type: 'array',
  //     });
  //     this.saveAsExcelFile(
  //       excelBuffer,
  //       'GVSC-' + this.selectedInforme.idInforme
  //     );
  //   });
  // }
  /** Genera un excel desde la tabla de vista previa. En desuso */
  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   import('file-saver').then((FileSaver) => {
  //     let EXCEL_TYPE =
  //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //     let EXCEL_EXTENSION = '.xlsx';
  //     const data: Blob = new Blob([buffer], {
  //       type: EXCEL_TYPE,
  //     });
  //     FileSaver.saveAs(
  //       data,
  //       fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
  //     );
  //   });
  // }

  obtenerDesembolsos() {
    this.rEntrada.getAll().subscribe((result: any) => {
      let desembolsos: RegistroEntrada[] = [];
      for (let index = 0; index < result.length; index++) {
        let e = result[index] as RegistroEntrada;
        if (e.informe !== null) {
          if (this.informe.idInforme === e.informe.idInforme) {
            desembolsos.push(e);
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
        if (e.informe !== null) {
          if (this.informe.idInforme === e.informe.idInforme) {
            gastos.push(e);
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
    });
  }
  obtenerInformes() {
    this.informeService.getAll().subscribe((result: any) => {
      let informes: Informe[] = [];
      for (let index = 0; index < result.length; index++) {
        let e = result[index] as Informe;
        if (this.showAdminBoard) {
          informes.push(e);
        } else if (e.users.username == this.currentUser.username) {
          informes.push(e);
        }
      }
      this.informes = informes.sort((a, b) => {
        if (a.idInforme > b.idInforme) return 1;
        if (a.idInforme < b.idInforme) return -1;
        return 0;
      });
    });
  }

  onInformeChange() {
    this.informe = this.selectedInforme;
    this.obtenerDesembolsos();
    this.obtenerGastos();
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
    this.obtenerInformes();
    this.cols = [
      { field: 'fecha', header: 'Fecha' },
      { field: 'observaciones', header: 'Factura Nro.' },
      { field: 'description', subfield: 'nombre', header: 'Descripcion' },
      { field: 'cantidad', header: 'Valor' },
    ];
  }
}
