/**
  Stores an object of users (e.g. in the current group)

  Uses `angular.copy()` so you can bind the list to your
  controller and it will keep updated. e.g.:

    `this.userList = CurrentUsers.list`

*/
export default class CurrentUsers {

  constructor() {
    Object.assign(this, {
      list: []
    });
  }

  set(list) {
    angular.copy(list, this.list);
    return this.list;
  }

  clear() {
    angular.copy([], this.list);
  }

  get(id) {
    return this.list.find((e) => e.id === id);
  }

}
