import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[];
  loginForm: UntypedFormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private fb: UntypedFormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: new UntypedFormControl('', Validators.required),
      password: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  navigateRegister() {
    this.router.navigateByUrl('/register');
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(
      (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
        this.messageService.add({
          severity: 'success',
          summary: '¡¡¡Correcto!!!',
          detail: 'Se ha Logueado Correctamente',
        });
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Login failed:',
          detail: this.errorMessage,
        });
      }
    );
  }

  reloadPage() {
    window.location.replace('#/home');
    window.location.reload();
  }
}
