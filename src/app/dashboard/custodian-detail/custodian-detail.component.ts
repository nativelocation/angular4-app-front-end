// npm packages - angular
import { Component, OnDestroy, OnInit }   from '@angular/core';
import { MdSnackBar }                     from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription }                   from 'rxjs/Subscription';

// npm packages
import { ValidationManager } from 'ng2-validation-manager';

// our packages
import { Feathers } from '../../shared/feathers.service';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'cus-custodian-detail',
  templateUrl: './custodian-detail.component.html',
  styleUrls: ['./custodian-detail.component.scss'],
})
export class CustodianDetailComponent implements OnDestroy, OnInit {
  cancelRoute: string;
  custodian: any;
  custodianForm;
  custodianId: string;
  data: any;
  subscription: Subscription;
  workId: string;

  constructor(private activatedRoute: ActivatedRoute,
              private feathers: Feathers, private router: Router, private snackBar: MdSnackBar) {
    this.data = {};
  }

  ngOnInit() {
    this.custodianForm = new ValidationManager({
      '_id': '',
      'firstName': 'required|alphaSpace',
      'lastName': 'required|alphaSpace',
      'email': 'required|email',
      'phone': 'required',
      'position': 'required|alphaSpace',
      'workId': '',
    });

    this.custodianForm.setErrorMessage('firstName', 'required', 'First name is required.');
    this.custodianForm.setErrorMessage('lastName', 'required', 'Last name is required.');
    this.custodianForm.setErrorMessage('firstName', 'alpha', 'First name accepts only alphabetic characters.');
    this.custodianForm.setErrorMessage('lastName', 'alpha', 'Last name accepts only alphabetic characters.');

    this.subscription = this.activatedRoute.parent.params
      .flatMap((params: Params) => {
        this.workId = params['workId'];
        this.cancelRoute = `/dashboard/${this.workId}/custodian`;
        this.custodianForm.setValue({ workId: this.workId });

        return this.activatedRoute.params;
      })
      .flatMap((params: Params) => {
        this.custodianId = params['id'];

        if (this.custodianId !== 'new') {
          return this.feathers.service('custodians').get(this.custodianId);
        } else {
          return Observable.of({ isNew: true });
        }
      })
      .subscribe((result: any) => {
        if (!result.hasOwnProperty('isNew')) {
          this.custodianForm.setValue({
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            phone: result.phone,
            position: result.position,
            workId: this.workId,
          });
          this.custodian = result;
        }
      }, err => console.log(err));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // private methods
  private showSnackBar(message: string): void {
    this.snackBar.open(message, null, { duration: 2000 });
  }

  remove(custodian) {

    this.feathers.service('custodians').remove(custodian._id)
      .then(result => {
        console.log(result);
        this.showSnackBar('Custodian deleted successfully!');
        this.router.navigate(['dashboard', this.workId, 'custodian']);
      })
      .catch(err => {
        console.log(err);
        this.showSnackBar(err.message);
      })
      .then(result => console.log(result));
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  save() {
    let data;

    if (this.custodianForm.isValid()) {
      data = this.custodianForm.getData();

      if (!data._id || data._id === '') {
        delete data._id;

        console.log(data);
        this.feathers.service('custodians').create(data)
          .then(result => {
            console.log(result);
            this.showSnackBar('Custodian created successfully!');
            this.router.navigate(['dashboard', this.workId, 'custodian']);
          })
          .catch(err => {
            console.log(err);
            this.showSnackBar(err.message);
          })
          .then(result => console.log(result));
      } else {
        const patchData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          position: data.position,
        };

        this.feathers.service('custodians').patch(data._id, patchData)
          .then(result => {
            console.log(result);
            this.showSnackBar('Custodian updated successfully!');
            this.router.navigate(['dashboard', this.workId, 'custodian']);
          })
          .catch(err => {
            console.log(err);
            this.showSnackBar(err.message);
          })
          .then(result => console.log(result));
      }
    }
  }
}
