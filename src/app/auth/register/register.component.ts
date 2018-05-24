// npm packages - angular
import { Component, OnInit }  from '@angular/core';
import { Http }               from '@angular/http';
import { MdSnackBar }         from '@angular/material';
import { Router }             from '@angular/router';

// npm packages
import { ValidationManager } from 'ng2-validation-manager';

// our packages
import { environment }  from '../../../environments/environment';
import { Feathers }     from '../../shared/feathers.service';

declare const braintree: any;

@Component({
  selector: 'cus-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  baseUrl: string;
  braintreeAuthToken: string;
  hasAgree: boolean;
  icons: any;
  isLoading: boolean;
  paymentForm;
  registerForm;
  selected: any;
  selectedIndex: number;
  subscriptions: any;
  user: any;

  constructor(private feathers: Feathers, private http: Http, private router: Router, private snackBar: MdSnackBar) {
    this.baseUrl = environment.baseUrl;
    this.hasAgree = false;
    this.isLoading = false;
    this.icons = ['person', 'supervisor_account'];
    this.selected = {};
    this.selectedIndex = 0;
  }

  ngOnInit() {
    this.isLoading = true;
    this.http.get(`${this.baseUrl}client_token`)
      .flatMap((result: any) => {
        console.log(result);
        this.braintreeAuthToken = result._body;

        return this.feathers.service('subscriptions').find({ query: { $sort: { _id: 1 }}});
      })
      .subscribe(result => {
          this.isLoading = false;
          this.subscriptions = result;
          this.selected = this.subscriptions.data[0].plansLookup[0];
        }, err => {
          this.isLoading = false;
          this.snackBar.open(err.message, null, { duration: 2000 });
        });

    this.registerForm = new ValidationManager({
      'firstName': 'required|alphaSpace',
      'lastName': 'required|alphaSpace',
      'email': 'required|email',
      'country': 'required|alphaSpace',
      'company': 'required|alphaNumSpace',
      'password': 'required|rangeLength:8,50',
      'confirmPassword': 'required|equalTo:password',
      'agree': 'required',
    });

    this.registerForm.setErrorMessage('firstName', 'required', 'First name is required.');
    this.registerForm.setErrorMessage('lastName', 'required', 'Last name is required.');
    this.registerForm.setErrorMessage('firstName', 'alpha', 'First name accepts only alphabetic characters.');
    this.registerForm.setErrorMessage('lastName', 'alpha', 'Last name accepts only alphabetic characters.');
    this.registerForm.setErrorMessage('confirmPassword', 'required', 'Confirm password is required.');
    this.registerForm.setErrorMessage('confirmPassword', 'equalTo', 'Confirm password must be equal to password.');

    this.paymentForm = new ValidationManager({
      'cardholderName': 'required|alphaSpace',
      'number': 'required',
      'expirationDate': 'required',
      'cvv': 'required',
    });

    this.paymentForm.setErrorMessage('cardholderName', 'required', 'Card name is required.');
    this.paymentForm.setErrorMessage('number', 'required', 'Card number is required.');
    this.paymentForm.setErrorMessage('cvv', 'required', 'Security code is required.');
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  onPlanSelected(plan: any) {
    this.selected = plan;
    this.selectedIndex = 1;
  }

  register() {
    console.log(this.registerForm.getData());

    if (this.registerForm.isValid()) {
      const data = Object.assign(this.registerForm.getData(), {
        planId: this.selected._id,
        subscriptionId: this.selected.subscriptionId,
      });

      console.log(data);

      this.isLoading = true;
      this.feathers.service('users').create(data)
        .then(user => {
          this.user = user;
          this.selectedIndex = 2;
          setTimeout(() => this.registerForm.reset(), 500);
        })
        .catch(err => {
          console.log(err);
          this.snackBar.open(err.message, null, { duration: 2000 });
        })
        .then(() => this.isLoading = false);
    }
  }

  purchase() {
    if (this.paymentForm.isValid()) {
      const { cardholderName, number, expirationDate, cvv } = this.paymentForm.getData();
      const client = new braintree.api.Client({ clientToken: this.braintreeAuthToken });

      client.tokenizeCard({
        cardholderName, number, expirationDate, cvv,
      }, (err, nonce) => {
        if (err) {
          this.snackBar.open(err, null, { duration: 2000 });
          return;
        }

        this.isLoading = true;

        const data = {
          nonce,
          planId: this.selected.planId,
          billingCycle: this.selected.billingCycle,
          selectedSubscriptionId: this.selected.subscriptionId,
          selectedPlanId: this.selected._id,
          userId: this.user._id,
        };

        this.feathers.service('purchase').create(data)
          .then(result => {
            console.log(result);

            this.snackBar.open('You successfully subscribed to this plan. You can now log in to your account.');
            this.router.navigate(['auth', 'login']);
          })
          .catch(error => {
            console.log(error);
            this.snackBar.open(error.message, null, { duration: 2000 });
          })
          .then(() => this.isLoading = false);
      });
    }
  }
}
