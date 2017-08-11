/**
  Makes the currently logged in user available as a service.

  Uses `angular.copy()` so you can bind the value to your
  controller and it will keep updated. e.g.:

    `this.user = SessionUser.value`
*/

export default class sessionUser {

  constructor() {
    "ngInject";
    Object.assign(this, {
      value: {}
    });
  }

  set(value) {
    angular.copy(value, this.value);
    return this.value;
  }

  clear() {
    angular.copy({}, this.value);
    return this.value;
  }

  isLoggedIn() {
    return angular.isDefined(this.value.id);
  }

}
