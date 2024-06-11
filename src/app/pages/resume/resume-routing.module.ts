import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Guards
import { LoginGuard } from 'src/app/guards/login.guard';
import { AboutComponent } from './components/about/about.component';
import { DescriptionComponent } from './components/description/description.component';
import { GastosComponent } from './components/gastos/gastos.component';
// Components
import { HomeComponent } from './components/home/home.component';
import { InformeComponent } from './components/informe/informe.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { RegistrosEntradaComponent } from './components/registros-entrada/registros-entrada.component';
import { RegistrosSalidaComponent } from './components/registros-salida/registros-salida.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ResumeComponent } from './resume.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    component: ResumeComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'about',
        component: AboutComponent,
        canActivate: [LoginGuard],
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'user', component: UsuarioComponent },
      { path: 'description', component: DescriptionComponent },
      { path: 'proyecto', component: ProyectoComponent },
      { path: 'registrosEntrada', component: RegistrosEntradaComponent },
      { path: 'registrosSalida', component: RegistrosSalidaComponent },
      { path: 'informe', component: InformeComponent },
      { path: 'reporte', component: ReporteComponent },
      { path: 'gastos', component: GastosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeRoutingModule { }
