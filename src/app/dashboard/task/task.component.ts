// npm packages - angular
import { Component, OnDestroy, OnInit }   from '@angular/core';
import { MdSnackBar }                     from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

// our packages
import { Feathers } from '../../shared/feathers.service';
import { Subscription } from 'rxjs/Subscription';
import { Task } from './shared/task.model';

import 'rxjs/add/operator/map';

@Component({
  selector: 'cus-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnDestroy, OnInit {
  routeNew: string;
  subscription: Subscription;
  tasks: Task[];

  private routeDetail: string;

  constructor(private activatedRoute: ActivatedRoute,
              private feathers: Feathers, private router: Router, private snackBar: MdSnackBar) {}

  onNavigateToDetail(task: Task): void {
    this.router.navigateByUrl(`${this.routeDetail}/${task._id}`);
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.parent.params
      .flatMap((p: Params) => {
        const { workId } = p;
        const params = {
          query: {
            workId,
            $sort: { updatedAt: -1 },
          },
        };

        this.routeDetail = `/dashboard/${workId}/task/detail`;
        this.routeNew = `${this.routeDetail}/new`;

        return this.feathers.service('tasks').find(params);
      })
      .map((response: any) => Task.fromJSONArray(response.data))
      .subscribe(
        tasks => {
          this.tasks = tasks;
          console.log(this.tasks);
        },
        err => this.snackBar.open(err.message, null, { duration: 2000 }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
