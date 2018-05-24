// npm packages - angular
import { Component, OnDestroy, OnInit }   from '@angular/core';
import { MdSnackBar }                     from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

// npm packages
import { ValidationManager }  from 'ng2-validation-manager';
import { Subscription }       from 'rxjs/Subscription';

// our packages
import { Feathers }   from '../../shared/feathers.service';



@Component({
  selector: 'cus-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnDestroy, OnInit {
  resetForm;
  subscription: Subscription;
  token: string;

  constructor(private activatedRoute: ActivatedRoute, private feathers: Feathers, private router: Router, private snackBar: MdSnackBar) {
    this.resetForm = new ValidationManager({
      'password': 'required|rangeLength:8,50',
      'confirmPassword': 'required|equalTo:password',
    });

    this.resetForm.setErrorMessage('confirmPassword', 'required', 'Confirm password is required.');
    this.resetForm.setErrorMessage('confirmPassword', 'equalTo', 'Confirm password must be equal to password.');
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.token = params['token'];
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {

    if (this.resetForm.isValid()) {
      const { password } = this.resetForm.getData();

      this.feathers.authManagement().resetPwdLong(this.token, password)
        .then(() => {
          this.snackBar.open('Password reset successfully', null, { duration: 2000 });
          this.router.navigate(['auth', 'login']);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
