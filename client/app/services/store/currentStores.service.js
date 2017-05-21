/**
  Stores an object of stores (e.g. in the current group)

  Uses `angular.copy()` so you can bind the list to your
  controller and it will keep updated. e.g.:

    `this.storeList = CurrentStores.list`

*/
export default class CurrentStores {

  constructor() {
    Object.assign(this, {
      list: [],
      selected: {}
    });
  }

  set(list) {
    angular.copy(list, this.list);
    return this.list;
  }

  setSelected(store) {
    angular.copy(store, this.selected);
    return this.selected;
  }

  pushItem(item) {
    this.list.push(item);
    return item;
  }

  replaceItem(item) {
    let i = this.list.findIndex((e) => e.id === item.id);
    this.list[i] = item;
    return item;
  }

  clear() {
    angular.copy([], this.list);
  }

  get(id) {
    return this.list.find((e) => e.id === id);
  }

}
