/**
  Makes the currently selected group available as a service.

  Uses `angular.copy()` so you can bind the value to your
  controller and it will keep updated. e.g.:

    `this.activeGroup = CurrentGroup.value`

*/
export default class CurrentGroup {

  constructor(User, Authentication) {
    "ngInject";
    Object.assign(this, {
      value: {},
      User,
      Authentication
    });
  }

  set(value) {
    angular.copy(value, this.value);
    if (angular.isUndefined(this.Authentication.data)) {
      this.Authentication.update();
    }

    this.persistCurrentGroup(value.id);
  }

  clear() {
    angular.copy({}, this.value);
    if (angular.isUndefined(this.Authentication.data)) {
      this.Authentication.update();
    }

    this.persistCurrentGroup(null);
  }

  persistCurrentGroup(groupId) {
    let user = {
      id: this.Authentication.data.id,
      current_group: groupId
    };
    this.User.save(user);
  }

}
