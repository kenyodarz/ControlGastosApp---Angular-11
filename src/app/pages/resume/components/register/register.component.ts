import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
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
  userForm: FormGroup;
  submitted: boolean;
  genders: SelectItem[];
  description: string;
  form: any = {};
  isSuccessful: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl(
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
