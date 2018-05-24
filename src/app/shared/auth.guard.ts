import { Injectable }           from '@angular/core';
import { CanActivate, Router }  from '@angular/router';
import { AuthService }          from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    return this.authService.isLoggedIn()
      .then((res) => {
        console.log(res);
        return true;
      })
      .catch(() => {
        this.router.navigate(['auth']);
        return false;
      });
  }
}
