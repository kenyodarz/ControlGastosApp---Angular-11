import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from 'src/app/shared/primeng.module';

import { ResumeRoutingModule } from './resume-routing.module';
import { AboutComponent } from './components/about/about.component';
import { DescriptionComponent } from './components/description/description.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { HomeComponent } from './components/home/home.component';
import { InformeComponent } from './components/informe/informe.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { RegisterComponent } from './components/register/register.component';
import { RegistrosSalidaComponent } from './components/registros-salida/registros-salida.component';
import { RegistrosEntradaComponent } from './components/registros-entrada/registros-entrada.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { UsuarioComponent } from './components/usuario/usuario.component';

@NgModule({
  declarations: [
    AboutComponent,
    DescriptionComponent,
    GastosComponent,
    HomeComponent,
    InformeComponent,
    ProfileComponent,
    ProyectoComponent,
    RegisterComponent,
    RegistrosSalidaComponent,
    RegistrosEntradaComponent,
    ReporteComponent,
    UsuarioComponent,
  ],
  imports: [
    CommonModule,
    ResumeRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ResumeModule {}
