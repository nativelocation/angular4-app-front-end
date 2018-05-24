// npm packages - angular
import { Component, OnDestroy, OnInit }   from '@angular/core';
import { MdSnackBar }                     from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

// npm packages
import { Observable }         from 'rxjs/Observable';
import { Subscription }       from 'rxjs/Subscription';
import { ValidationManager }  from 'ng2-validation-manager';

// our packages
import { Feathers } from '../../shared/feathers.service';
import { Task }     from '../task/shared/task.model';

@Component({
  selector: 'cus-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnDestroy, OnInit {
  file: any;
  isReady: boolean;
  routeTask: string;
  task: Task;
  taskForm;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private feathers: Feathers, private router: Router, private snackBar: MdSnackBar) {
    this.isReady = true;
  }

  onFileSelect(e) {
    console.log(e);

    // const that = this;
    const reader = new FileReader();
    const file = e[0];

    console.log(file);

    this.isReady = false;

    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
      console.log(reader.result);
      this.file = reader.result;
      this.isReady = true;
    });
  }

  onRemove(task: Task): void {
    this.feathers.service('tasks').remove(task._id)
      .then(() => {
        this.showSnackBar('Task deleted successfully!');
        this.navigateBack();
      })
      .catch(err => this.showSnackBar(err.message));
  }

  onSave(): void {
    if (this.taskForm.isValid()) {
      const data = this.taskForm.getData();

      data.uri = this.file;

      if (!this.task) {
        this.feathers.service('tasks').create(data)
          .then(() => {
            this.showSnackBar('Task created successfully!');
            this.navigateBack();
          })
          .catch(err => this.showSnackBar(err.message));
      } else {
        const patchData = {
          name: data.name,
          description: data.description,
          instructions: data.instructions,
        };

        if (!this.task._id) {
          this.showSnackBar('No task id available.');
          return;
        }

        this.feathers.service('tasks').patch(this.task._id, patchData)
          .then(() => {
            this.showSnackBar('Task updated successfully!');
            this.navigateBack();
          })
          .catch(err => this.showSnackBar(err.message));
      }
    }
  }

  // lifecycle hooks
  ngOnInit(): void {
    this.taskForm = new ValidationManager({
      'name': 'required|alphaNumSpace',
      'description': 'required',
      'instructions': 'required',
      'workId': '',
    });

    this.subscription = this.activatedRoute.parent.params
      .flatMap((params: Params) => {
        const { workId } = params;

        this.routeTask = `/dashboard/${workId}/task`;
        this.taskForm.setValue({ workId });

        return this.activatedRoute.params;
      })
      .flatMap((params: Params) => {
        const { id } = params;

        if (id !== 'new') {
          return this.feathers.service('tasks').get(id);
        } else {
          return Observable.of({ isNew: true });
        }
      })
      .subscribe((task: Task) => {

        if (task.hasOwnProperty('isNew')) {
          return;
        }

        this.taskForm.setValue({
          name: task.name,
          description: task.description,
          instructions: task.instructions,
        });

        this.task = task;
      }, err => this.showSnackBar(err.message));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // private methods
  private navigateBack(): void {
    this.router.navigateByUrl(this.routeTask);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, null, { duration: 2000 });
  }
}
