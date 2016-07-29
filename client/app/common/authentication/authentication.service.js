import angular from 'angular';
import base from '../base/service';

class AuthenticationService extends base {

  static properties () {
    return ['display_name', 'email'];
  }

  constructor($rootScope, $http) {
    'ngInject';
    super();
    this.$rootScope=$rootScope;
    this.$http=$http;
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
    this.$http.post('/api/auth/',{email,password})
    .then((data) => {
      this._credentials=data;
      this._isLoggedIn=true;
      this.$rootScope.$broadcast("authentication.login.success");
    }, (data) => {
      this.$rootScope.$broadcast("authentication.login.fail", data);
    });
  }

  update() {
    this.$http.get('/api/auth/status/')
    .then((data) => {
      data=data.data;
      if(!this.validate(data)) {
        this.$rootScope.$broadcast("authentication.update.fail");
        this._isLoggedIn=false;
      } else {
        this._credentials=data;
        this.$rootScope.$broadcast("authentication.update.success");
      }
    }, () => {
      this._credentials={};
      this._isLoggedIn=false;
      this.$rootScope.$broadcast("authentication.update.error");
    });
  }

  logout() {
    this.$http.post('/api/auth/logout/',{email:'',password:''})
    .then(() => {
      this._credentials={};
      this._isLoggedIn=false;
      this.$rootScope.$broadcast("authentication.logout.success");
    }, () => {
      this.$rootScope.$broadcast("authentication.logout.error");
    });
  }
}

export default AuthenticationService;
