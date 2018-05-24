// npm packages
import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// our packages
import { AuthGuard }                from '../shared/auth.guard';
import { CustodianComponent }       from './custodian/custodian.component';
import { CustodianDetailComponent } from './custodian-detail/custodian-detail.component';
import { DashboardComponent }       from './dashboard.component';
import { JobComponent }             from './job/job.component';
import { JobDetailComponent }       from './job-detail/job-detail.component';
import { JobOverviewComponent }     from './job-overview/job-overview.component';
import { TaskComponent }            from './task/task.component';
import { TaskDetailComponent }      from './task-detail/task-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: 'custodian', component: CustodianComponent },
      { path: 'custodian/detail/:id', component: CustodianDetailComponent },
      { path: 'job', component: JobComponent },
      { path: 'job/detail/:id', component: JobDetailComponent },
      { path: 'job/overview/:id', component: JobOverviewComponent },
      { path: 'task', component: TaskComponent },
      { path: 'task/detail/:id', component: TaskDetailComponent },
      { path: '**', redirectTo: 'job', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class DashboardRoutingModule {}
