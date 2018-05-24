// npm packages - angular
import { Component, OnInit }  from '@angular/core';
import { MdSnackBar }         from '@angular/material';
import { Router }             from '@angular/router';

// npm packages
import { ValidationManager }  from 'ng2-validation-manager';

// our packages
import { Feathers } from '../../shared/feathers.service';


@Component({
  selector: 'cus-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean;
  loginForm;
  user: any;

  constructor(private feathers: Feathers, private router: Router, private snackBar: MdSnackBar) {
    this.isLoading = false;
    this.user = {};
  }

  ngOnInit() {
    this.loginForm = new ValidationManager({
      'email': 'required|email',
      'password': 'required|rangeLength:8,50',
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  login() {
    const auth: any = {};

    if (this.loginForm.isValid()) {
      auth.strategy = 'local';
      auth.email = this.loginForm.getValue('email');
      auth.password = this.loginForm.getValue('password');

      this.isLoading = true;

      this.feathers.authenticate(auth)
        .then(() => {
          this.snackBar.open('User logged in successfully!', null, { duration: 2000 });
          this.router.navigate(['/work']);
        })
        .catch(err => this.snackBar.open(err.message, null, { duration: 2000 }))
        .then(() => this.isLoading = false);
    }
  }
}
