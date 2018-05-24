// npm packages
import { Component, OnDestroy, OnInit }   from '@angular/core';
import { MdSnackBar }                     from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

// our packages
import { Feathers }     from '../../shared/feathers.service';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'cus-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnDestroy, OnInit {
  activeJobs: any;
  inactiveJobs: any;
  routeJob: string;
  routeNew: string;
  subscription: Subscription;
  workId: string;

  constructor(private activatedRoute: ActivatedRoute,
              private feathers: Feathers, private router: Router, private snackBar: MdSnackBar) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.parent.params.subscribe((params: Params) => {
      const { workId } = params;

      this.routeJob = `/dashboard/${workId}/job`;
      this.routeNew = `${this.routeJob}/detail/new`;

      this.feathers.service('jobs').find({ query: { workId, isActive: true, $sort: { updatedAt: -1 }}})
        .flatMap(result => {
          this.activeJobs = result;

          return this.feathers.service('jobs').find({
            query: { workId: this.workId, isActive: false, $sort: { updatedAt: -1 }}
          });
        })
        .subscribe(result => {
          this.inactiveJobs = result;
        }, err => this.snackBar.open(err.message, null, { duration: 2000 }));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  onNavigateOverview(job: any) {
    this.router.navigateByUrl(`${this.routeJob}/overview/${job._id}`);
  }
}
