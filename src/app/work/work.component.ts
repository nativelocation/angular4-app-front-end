// npm packages - angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdDialog, MdSnackBar }         from '@angular/material';
import { Router }                       from '@angular/router';

// npm packages
import { Subscription } from 'rxjs/Subscription';

// our packages
import { Feathers }             from '../shared/feathers.service';
import { WorkDialogComponent }  from './work-dialog.component';

@Component({
  selector: 'cus-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnDestroy, OnInit {
  isLoading: boolean;
  works: any;
  workSubscription: Subscription;

  constructor(private dialog: MdDialog,
              private feathers: Feathers, private router: Router, private snackBar: MdSnackBar) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.isLoading = true;

    this.workSubscription = this.feathers.service('works').find({
      rx: { listStrategy: 'always' },
      query: { $sort: { updatedAt: -1 }},
    })
      .subscribe(result => {
        this.isLoading = false;
        this.works = result;
      }, err => {
        console.log(err);
        this.isLoading = false;
        this.showSnackBar(err.message);
      });
  }

  ngOnDestroy() {
    this.workSubscription.unsubscribe();
  }

  logout() {
    this.isLoading = true;
    this.feathers.logout()
      .then(() => this.router.navigate(['auth']))
      .catch(err => this.showSnackBar(err.message))
      .then(() => this.isLoading = false);
  }

  navigate(work) {
    this.router.navigate(['dashboard', work._id]);
  }

  openDialog(e, work) {
    const dialogRef = this.dialog.open(WorkDialogComponent, {
      width: '480px',
      data: work || {},
    });

    e.preventDefault();
    e.stopPropagation();

    dialogRef.afterClosed().subscribe(data => {
      this.isLoading = true;

      if (data && data.hasOwnProperty('delete')) {
        if (!work._id) { return; }

        this.feathers.service('works').remove(work._id)
          .then(result => this.showSnackBar('Work deleted successfully!'))
          .catch(err => this.showSnackBar(err.message))
          .then(() => this.isLoading = false);
      } else if (data && !data._id) {
        delete data._id;

        this.feathers.service('works').create(data)
          .then(result => this.showSnackBar('Work created successfully!'))
          .catch(err => {
            console.log(err);
            this.showSnackBar(err.message);
          })
          .then(() => this.isLoading = false);
      } else if (data && data._id) {
        const patchData = {
          name: data.name,
          address: data.address,
          country: data.country,
          note: data.note,
        };

        this.feathers.service('works').patch(data._id, patchData)
          .then(result => this.showSnackBar('Work updated successfully!'))
          .catch(err => {
            console.log(err);
            this.showSnackBar(err.message);
          })
          .then(() => this.isLoading = false);
      } else {
        this.isLoading = false;
      }
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, null, { duration: 2000 });
  }
}
