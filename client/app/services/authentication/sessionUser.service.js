/**
  Makes the currently logged in user available as a service.

  Uses `angular.copy()` so you can bind the value to your
  controller and it will keep updated. e.g.:

    `this.user = SessionUser.value`

  Use the `loaded` promise to run code when Authentication data
  has been loaded from the backend. It will get rejected when the user is not signed in.

    SessionUser.loaded.then((userData) => {
      // do something with userData
    });

*/

export default class sessionUser {

  constructor($q) {
    "ngInject";
    this.deferred = $q.defer(); // eslint-disable-line
    Object.assign(this, {
      $q,
      value: {},
      loaded: this.deferred.promise
    });
  }

  set(value) {
    angular.copy(value, this.value);
    this.deferred.resolve(this.value);
    return this.value;
  }

  clear() {
    angular.copy({}, this.value);
    this.deferred.reject(this.value);
    return this.value;
  }

  isLoggedIn() {
    return angular.isDefined(this.value.id);
  }

}
