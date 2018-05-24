// npm packages - angular
import { Component }                          from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router }                             from '@angular/router';

// our packages
import { Feathers } from '../../shared/feathers.service';


@Component({
  selector: 'cus-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent {
  forgotForm: FormGroup;

  constructor(private fb: FormBuilder, private feathers: Feathers, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [ Validators.email, Validators.required ]],
    });
  }

  onSubmit() {
    const { email } = this.forgotForm.value;

    console.log(email);

    this.feathers.authManagement().sendResetPwd({ email }).then(result => {
      console.log(result);
    })
      .catch(err => console.log(err));

  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
