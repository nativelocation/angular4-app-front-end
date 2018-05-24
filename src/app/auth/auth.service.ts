import { Injectable } from '@angular/core';
import { Feathers }   from '../shared/feathers.service';

@Injectable()
export class AuthService {
  token: string;

  constructor(private feathers: Feathers) {
    this.token = window.localStorage.getItem('feathers-jwt') || '';
  }

  isLoggedIn() {
    return this.feathers.passport().verifyJWT(this.token)
      .then(() => this.feathers.authenticate({ strategy: 'jwt', accessToken: this.token }));
  }
}
