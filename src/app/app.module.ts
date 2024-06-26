/* Angular */
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Modulos */
import { AppRoutingModule } from './app-routing.module';
import { PrimengModule } from './shared/primeng.module';
/* Providers / Services */
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthInterceptorProviders } from 'src/app/helpers/auth.interceptor';
/* Componentes */
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavigationComponent } from './pages/navigation/navigation.component';


@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        ResumeComponent,
        RegisterComponent,
        NavigationComponent,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        PrimengModule], providers: [
        MessageService,
        DialogService,
        ConfirmationService,
        AuthInterceptorProviders,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
