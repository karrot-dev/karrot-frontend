import angular from 'angular';
import base from '../base/service';

class AuthenticationService extends base {

  static get properties () {
    return ['display_name', 'email'];
  }

  constructor($rootScope, $http, User) {
    'ngInject';
    this.$rootScope=$rootScope;
    this.$http=$http;
    this._credentials = {};
    this.isLoggedIn=false;
  }

  get credentials() {
    return angular.copy(this._credentials);
  }

  login(email,password) {
    this.$http.post('/api/auth/',{email,password})
    .then((data) => {
      this._credentials=data;
      isLoggedIn=true;
      this.$rootScope.$broadcast("authentication.login.success");
    }, (data) => {
      this.$rootScope.$broadcast("authentication.login.fail", data);
    });
  }

  update() {
    return this.$http.post('/api/auth/status/')
    .then((data) => {
      if(!this.validate(data)) {
        this.$rootScope.$broadcast("authentication.update.fail");
        this.isLoggedIn=false;
        return Promise.reject("Not logged in");
      } else {
        this._credentials=data;
        this.$rootScope.$broadcast("authentication.update.success");
        return this.User.user(this._credentials.id);
      }
    }, () => {
      this._credentials={};
      this.isLoggedIn=false;
      this.$rootScope.$broadcast("authentication.update.error");
    });
  }

  logout() {
    this.$http.post('/api/auth/logout/',{email:'',password:''})
    .then((data) => {
      this._credentials={};
      this.isLoggedIn=false;
      $rootScope.$broadcast("authentication.logout.success");
    }, () => {
      $rootScope.$broadcast("authentication.logout.error");
    });
  }
};

export default AuthenticationService;
