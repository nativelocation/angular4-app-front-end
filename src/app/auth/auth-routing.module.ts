// npm packages
import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// our packages
import { AuthComponent }      from './auth.component';
import { LoginComponent }     from './login/login.component';
import { RegisterComponent }  from './register/register.component';
import { ResetComponent }     from './reset/reset.component';
import { ForgotComponent }    from './forgot/forgot.component';
import { VerifyComponent }    from './verify/verify.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'forgot', component: ForgotComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'reset/:token', component: ResetComponent },
      { path: 'verify/:token', component: VerifyComponent },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class AuthRoutingModule {}
