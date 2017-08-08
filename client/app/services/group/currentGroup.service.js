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
      Authentication,
      map: {
        overview: 1,
        center: undefined,
        options: {
          showStores: true,
          showUsers: false
        }
      }
    });
  }

  set(value) {
    angular.copy(value, this.value);
    this.persistCurrentGroup(value.id);
  }

  clear() {
    angular.copy({}, this.value);
    this.persistCurrentGroup(null);
  }

  setMapOverview() {
    this.map.overview++;  // a truthy, changing value to trigger the watch in groupMap
  }

  setMapCenter(center) {
    this.map.overview = 0;
    this.map.center = angular.copy(center);  // trigger watch in groupMap
  }

  persistCurrentGroup(groupId) {
    this.Authentication.update().then((user) => {
      this.User.save({
        id: user.id,
        current_group: groupId  //eslint-disable-line
      });
    });
  }

}
