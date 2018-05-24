// npm packages
import { NgModule } from '@angular/core';

// our packages - modules
import { AuthRoutingModule }  from './auth-routing.module';
import { SharedModule }       from '../shared/shared.module';

// our packages - components
import { AuthComponent }      from './auth.component';
import { ForgotComponent }    from './forgot/forgot.component';
import { LoginComponent }     from './login/login.component';
import { RegisterComponent }  from './register/register.component';
import { ResetComponent }     from './reset/reset.component';
import { VerifyComponent }    from './verify/verify.component';

@NgModule({
  imports: [ AuthRoutingModule, SharedModule ],
  declarations: [
    AuthComponent,
    ForgotComponent,
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    VerifyComponent,
  ],
})
export class AuthModule {}
