// npm packages
import { Component, OnDestroy, OnInit }   from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription }                   from 'rxjs/Subscription';

// our packages
import { Feathers }   from '../../shared/feathers.service';


@Component({
  selector: 'cus-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnDestroy, OnInit {
  isVerified: string;
  user: any;
  subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private feathers: Feathers, private router: Router) {
    this.user = {};
    this.isVerified = 'LOADING';
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      const token = params['token'];

      console.log(token);

      this.feathers.authManagement().verifySignupLong(token)
        .then(result => {
          console.log(result);

          this.isVerified = 'VERIFIED';
        })
        .catch(err => {
          console.log(err);

          if (err.errors.$className === 'verifyExpired') {
            this.isVerified = 'VERIFY_EXPIRED';
          } else if (err.errors.$className === 'badParams') {
            this.isVerified = 'TOKEN_MALFORMED';
          }
        });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
