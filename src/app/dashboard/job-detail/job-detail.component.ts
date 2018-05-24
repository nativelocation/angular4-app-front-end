// npm packages - angular
import { Component, OnDestroy, OnInit }   from '@angular/core';
import { MdSnackBar }                     from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

// npm packages
import { Subscription } from 'rxjs/Subscription';

// our packages
import { Feathers } from '../../shared/feathers.service';



@Component({
  selector: 'cus-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
})
export class JobDetailComponent implements OnDestroy, OnInit {
  custodians: any;
  cancelRoute: string;
  data: any;
  parentRouteSubscription: Subscription;
  previousTasks: any[];
  selectedTasks: any[];
  tasks: any[];
  workId: string;

  constructor(private activatedRoute: ActivatedRoute, private feathers: Feathers, private router: Router, private snackBar: MdSnackBar) {
    this.data = {};
    this.data.tasks = [];
    this.previousTasks = [];
    this.selectedTasks = [];
  }

  ngOnInit() {
    this.parentRouteSubscription = this.activatedRoute.parent.params.subscribe((params: Params) => {
      this.workId = params['workId'];
      this.cancelRoute = `/dashboard/${this.workId}/job`;
    });

    console.log('here');
    this.feathers.service('tasks').find({ query: { workId: this.workId }})
      .flatMap(result => {
        console.log(result);
        this.tasks = result.data.map(value => {
          return { display: value.name, value: value._id };
        });

        return this.feathers.service('custodians').find({ query: { workId: this.workId }});
      })
      .subscribe(result => {
        this.custodians = result;
        console.log(this.custodians);
      }, err => console.log(err));
  }

  onTaskAction() {
    console.log(this.selectedTasks);

    this.data.tasks = this.selectedTasks.map(task => {
      return task.value;
    });

    console.log(this.data);
  }

  ngOnDestroy() {
    this.parentRouteSubscription.unsubscribe();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  save() {
    this.data.workId = this.workId;

    console.log(this.data);

    this.feathers.service('jobs').create(this.data)
      .then(result => {
        console.log(result);
        this.showSnackBar('Job created successfully!');
        this.router.navigate(['dashboard', this.workId, 'job']);
      })
      .catch(err => {
        console.log(err);
        this.showSnackBar(err.message);
      })
      .then(result => console.log(result));
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, null, { duration: 2000 });
  }
}
