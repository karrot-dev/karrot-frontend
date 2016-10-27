/**
  Makes the currently selected group available as a service.

  Uses `angular.copy()` so you can bind the value to your
  controller and it will keep updated. e.g.:

    `this.activeGroup = CurrentGroup.value`

*/
export default class CurrentGroup {

  constructor() {
    Object.assign(this, {
      value: {}
    });
  }

  get() {
    return this.value;
  }

  set(value) {
    angular.copy(value, this.value);
  }

  clear() {
    angular.copy({}, this.value);
  }

}
