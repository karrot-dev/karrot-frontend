import angular from 'angular';
import base from '../base/service';

class AuthService extends base {

  static properties () {
    return ['display_name', 'email'];
  }

  constructor(AuthCommunication) {
    'ngInject';
    super();
    this.AuthCom=AuthCommunication;
    this._credentials = {};
    this._isLoggedIn=false;
  }

  get credentials() {
    return angular.copy(this._credentials);
  }

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  login(email,password) {
    return this.AuthCom.login(email,password)
    .then((credentials) => {
      if(AuthService.validate(credentials)) {
        this._credentials=credentials;
        this._isLoggedIn=true;
        return Promise.resolve(credentials);
      } else {
        this._credentials={};
        this._isLoggedIn=false;
        return Promise.reject();
      }
    }, (errdata) => {
      return Promise.reject(errdata);
    });
  }

  update() {
    return this.AuthCom.update()
    .then((credentials) => {
      if(AuthService.validate(credentials)) {
        this._credentials=credentials;
        this._isLoggedIn=true;
        return Promise.resolve(credentials);
      } else {
        this._credentials={};
        this._isLoggedIn=false;
        return Promise.reject();
      }
    }, (errdata) => {
      return Promise.reject(errdata);
    });
  }

  logout() {
    this.AuthCom.logout()
    .then(() => {
      this._credentials={};
      this._isLoggedIn=false;
      return Promise.resolve();
    }, () => {
      return Promise.reject();
    });
  }
}

export default AuthService;
