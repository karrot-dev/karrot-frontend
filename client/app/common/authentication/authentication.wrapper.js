import angular from "angular";
import base from "../base/service";

class AuthService extends base {

  static properties () {
    return ["display_name", "email"];
  }

  constructor(AuthCommunication, $q) {
    "ngInject";
    super();
    this.AuthCom = AuthCommunication;
    this._credentials = {};
    this._isLoggedIn = false;
    this.$q = $q;
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
      if (AuthService.validate(credentials)) {
        this._credentials = credentials;
        this._isLoggedIn = true;
        return this.$q.resolve(credentials);
      } else {
        this._credentials = {};
        this._isLoggedIn = false;
        return this.$q.reject();
      }
    });
  }

  update() {
    return this.AuthCom.update()
    .then((credentials) => {
      if (AuthService.validate(credentials)) {
        this._credentials = credentials;
        this._isLoggedIn = true;
        return this.$q.resolve(credentials);
      } else {
        this._credentials = {};
        this._isLoggedIn = false;
        return this.$q.reject();
      }
    });
  }

  logout() {
    return this.AuthCom.logout()
    .then(() => {
      this._credentials = {};
      this._isLoggedIn = false;
      return this.$q.resolve();
    });
  }
}

export default AuthService;
