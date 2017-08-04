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
    angular.copy(this._getSortedByName(list), this.list);
    return this.list;
  }

  setSelected(store) {
    angular.copy(store, this.selected);
    return this.selected;
  }

  pushItem(item) {
    this.list.push(item);
    angular.copy(this._getSortedByName(this.list), this.list);
    return item;
  }

  replaceItem(item) {
    let i = this.list.findIndex((e) => e.id === item.id);
    this.list[i] = item;
    angular.copy(this._getSortedByName(this.list), this.list);
    return item;
  }

  clear() {
    angular.copy([], this.list);
  }

  get(id) {
    return this.list.find((e) => e.id === id);
  }

  _getSortedByName(list) {
    let sortMap = list.map((el, i) => {
      return {
        i,
        value: el.name ? el.name.toLowerCase() : ""   // make it forgiving, useful for tests
      };
    });
    sortMap.sort((a, b) => a.value.localeCompare(b.value));
    return sortMap.map((el) => list[el.i]);
  }

}
