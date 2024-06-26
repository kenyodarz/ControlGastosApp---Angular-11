import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from "src/app/core/services/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {
  constructor(private token: TokenStorageService , private router: Router){}
  canActivate() {
    if (!!this.token.getToken()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
