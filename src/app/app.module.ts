// npm packages
import 'hammerjs';
import { NgModule }                 from '@angular/core';
import { Http }                     from '@angular/http';
import { BrowserModule }            from '@angular/platform-browser';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';

// our packages
import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard }        from './shared/auth.guard';
import { AuthService }      from './auth/auth.service';
import { Feathers }         from './shared/feathers.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,

    BrowserAnimationsModule,
    BrowserModule,
  ],
  providers: [ AuthGuard, AuthService, Feathers, Http ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
