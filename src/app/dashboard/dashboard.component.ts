// npm packages - angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ActivatedRoute, Params }       from '@angular/router';

// npm packages
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'cus-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
})
export class DashboardComponent implements OnDestroy, OnInit {
  isLoading: boolean;
  mode: string;
  mq: string;
  opened: boolean;
  routeSubscription: Subscription;
  watcher: Subscription;

  routeCustodian: string;
  routeJob: string;
  routeTask: string;

  constructor(private media: ObservableMedia, private activatedRoute: ActivatedRoute) {
    this.isLoading = false;
    this.mode = 'side';
    this.opened = true;
    this.watcher = media.subscribe((change: MediaChange) => {
      this.mq = change.mqAlias;
      console.log(this.mq);
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.mode = 'over';
        this.opened = false;
      } else {
        this.mode = 'side';
        this.opened = true;
      }
    });
  }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      const { workId } = params;

      console.log(params);

      this.routeCustodian = `/dashboard/${workId}/custodian`;
      this.routeJob = `/dashboard/${workId}/job`;
      this.routeTask = `/dashboard/${workId}/task`;
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.watcher.unsubscribe();
  }
}
