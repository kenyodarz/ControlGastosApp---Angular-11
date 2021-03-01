import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from 'src/app/shared/primeng.module';

import { ResumeRoutingModule } from './resume-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';


@NgModule({
  declarations: [HomeComponent, AboutComponent],
  imports: [
    CommonModule,
    ResumeRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ResumeModule {}
