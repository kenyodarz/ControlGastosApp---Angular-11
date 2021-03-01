import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Guards
import { LoginGuard } from 'src/app/guards/login.guard';
import { AboutComponent } from './components/about/about.component';
// Components
import { HomeComponent } from './components/home/home.component';
import { ResumeComponent } from './resume.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
    canActivate: [LoginGuard],
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeRoutingModule { }
