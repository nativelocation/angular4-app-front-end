// npm packages
import { NgModule } from '@angular/core';

// our packages - modules
import { WorkRoutingModule } from './work-routing.module';
import { SharedModule } from '../shared/shared.module';

// our packages - components
import { WorkComponent } from './work.component';
import { WorkDialogComponent } from './work-dialog.component';

@NgModule({
  imports: [ WorkRoutingModule, SharedModule ],
  declarations: [ WorkComponent, WorkDialogComponent ],
  entryComponents: [ WorkDialogComponent ],
})
export class WorkModule {}
