import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: 'auth', loadChildren: 'app/auth/auth.module#AuthModule' },
  { path: 'dashboard/:workId', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
  { path: 'work', loadChildren: 'app/work/work.module#WorkModule' },
  { path: '**', redirectTo: 'auth' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}
