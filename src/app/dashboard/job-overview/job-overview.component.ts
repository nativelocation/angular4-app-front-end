// npm packages
import { Component, OnDestroy, OnInit }   from '@angular/core';
import { MdSnackBar }                     from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

// our packages
import { Feathers }     from '../../shared/feathers.service';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'cus-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.scss'],
})
export class JobOverviewComponent implements OnDestroy, OnInit {
  job: any;
  subscription: Subscription;
  routeJob: string;

  constructor(private activatedRoute: ActivatedRoute,
              private feathers: Feathers, private router: Router, private snackBar: MdSnackBar) {}

  ngOnInit() {



    this.subscription = this.activatedRoute.parent.params
      .flatMap((params: Params) => {
        const { workId } = params;

        this.routeJob = `/dashboard/${workId}/job`;

        return this.activatedRoute.params;
      })
      .flatMap((params: Params) => {
        const { id } = params;

        return this.feathers.service('jobs').get(id);
      })
      .subscribe(job => {

        console.log(job);
        this.job = job;
      }, err => this.snackBar.open(err.message, null, { duration: 2000 }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
