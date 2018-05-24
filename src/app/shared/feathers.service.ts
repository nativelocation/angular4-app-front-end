// npm packages
import { Injectable } from '@angular/core';

// npm packages - feathers collection
import * as feathers  from 'feathers/client';
import * as socketio  from 'feathers-socketio/client';
import * as hooks     from 'feathers-hooks';
import * as auth      from 'feathers-authentication-client';
import reactive       from 'feathers-reactive';
import AuthManagement from 'feathers-authentication-management/lib/client';

// npm packages - others
import * as io  from 'socket.io-client';
import * as rx  from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class Feathers {
  private am: any;
  private baseUrl: string;
  private feathers: any;
  private socket: any;

  constructor() {

    this.baseUrl = environment.baseUrl;
    this.socket = io(this.baseUrl);
    this.feathers = feathers();

    this.feathers.configure(hooks());
    this.feathers.configure(reactive(rx));
    this.feathers.configure(socketio(this.socket, { timeout: 60000 }));
    this.feathers.configure(auth({
      storage: window.localStorage,
    }));
    this.am = new AuthManagement(this.feathers);
  }

  authenticate(credentials?): Promise<any> {
    return this.feathers.authenticate(credentials)
      .then((response) => this.feathers.passport.verifyJWT(response.accessToken));
  }

  authManagement() {
    return this.am;
  }

  logout() {
    return this.feathers.logout();
  }

  passport() {
    return this.feathers.passport;
  }

  service(name: string) {
    return this.feathers.service(name);
  }
}
