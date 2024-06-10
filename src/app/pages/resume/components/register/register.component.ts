import { Component, OnInit } from '@angular/core';
import {
  Validators,
  UntypedFormControl,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  userForm: UntypedFormGroup;
  submitted: boolean;
  genders: SelectItem[];
  description: string;
  form: any = {};
  isSuccessful: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: new UntypedFormControl('', Validators.required),
      name: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl('', Validators.required),
      password: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });
  }
  onSubmit() {
    console.log(this.userForm.value);
    this.authService.register(this.userForm.value).subscribe(
      (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.messageService.add({
          severity: 'success',
          summary: '¡¡¡Correcto!!!',
          detail: 'Se ha Registrado el Usuario Correctamente Correctamente',
        });
        this.navigateLogin();
      },
      (error) => {
        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Error en el Registro:',
          detail: this.errorMessage,
        });
      }
    );
  }
  get diagnostic() {
    return JSON.stringify(this.userForm.value);
  }
  navigateLogin() {
    this.router.navigateByUrl('login');
  }
}
