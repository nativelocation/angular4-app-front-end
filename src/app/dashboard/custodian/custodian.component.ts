// npm packages - angular
import { Component, OnDestroy, OnInit }   from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

// npm packages
import { Feathers } from '../../shared/feathers.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'cus-custodian',
  templateUrl: './custodian.component.html',
  styleUrls: ['./custodian.component.scss'],
})
export class CustodianComponent implements OnDestroy, OnInit {
  custodians: any;
  newRoute: string;
  subscription: Subscription;
  workId: string;

  constructor(private activatedRoute: ActivatedRoute, private feathers: Feathers, private router: Router) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.parent.params
      .flatMap((params: Params) => {
        this.workId = params['workId'];
        this.newRoute = `/dashboard/${this.workId}/custodian/detail/new`;

        return this.feathers.service('custodians').find({ query: { workId: this.workId, $sort: { updatedAt: -1 }}});
      })
      .subscribe(result => {
        console.log(result);
        this.custodians = result;
      }, err => {
        console.log(err);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  onEdit(custodian: any) {
    this.router.navigate(['dashboard', this.workId, 'custodian', 'detail', custodian._id]);
  }
}
