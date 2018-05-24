// npm packages
import { NgModule } from '@angular/core';

// our packages - modules
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule }           from '../shared/shared.module';

// our packages - components
import { DashboardComponent }       from './dashboard.component';
import { CustodianComponent }       from './custodian/custodian.component';
import { CustodianDetailComponent } from './custodian-detail/custodian-detail.component';
import { JobComponent }             from './job/job.component';
import { JobDetailComponent }       from './job-detail/job-detail.component';
import { TaskComponent }            from './task/task.component';
import { TaskDetailComponent }      from './task-detail/task-detail.component';
import { InputFileComponent }       from './input-file';
import { JobOverviewComponent }     from './job-overview/job-overview.component';

@NgModule({
  imports: [ DashboardRoutingModule, SharedModule ],
  declarations: [
    DashboardComponent,
    CustodianComponent,
    CustodianDetailComponent,
    JobComponent,
    JobDetailComponent,
    JobOverviewComponent,
    TaskComponent,
    TaskDetailComponent,

    InputFileComponent,
  ],
})
export class DashboardModule {}
