// npm packages
import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// our packages
import { AuthGuard }      from '../shared/auth.guard';
import { WorkComponent }  from './work.component';

export const routes: Routes = [
  { path: '', component: WorkComponent, canActivate: [ AuthGuard ] }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class WorkRoutingModule {}
