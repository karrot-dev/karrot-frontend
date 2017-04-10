class HistoryController {
  constructor(Store, User) {
    "ngInject";
    Object.assign(this, {
      Store,
      User,
      stores: {},
      users: {},
      types: {
        groups: true,
        stores: true,
        pickups: true
      },
      filteredData: []
    });
  }

  $onInit(){
    this.getAllStores();
    this.getAllUsers();
    this.updateFilteredData();
  }

  update(){
    this.updateFilteredData();
  }

  updateFilteredData(){
    this.filteredData = [];
    angular.forEach(this.data, (currentHistoryItem) => {
      if (this.showItem(currentHistoryItem)){
        this.filteredData.push(currentHistoryItem);
      }
    });
  }

  _showItemByStore(item){
    return !(angular.isDefined(item.store)
            && angular.isDefined(this.stores[item.store])
            && !this.stores[item.store].selected);
  }
  _showItemByUser(item){
    if (item.users.length > 0){
      let atLeastOneUserSelected = false;
      angular.forEach(item.users, (user) => {
        if (angular.isUndefined(this.users[user]) || this.users[user].selected){
          atLeastOneUserSelected = true;
        }
      });
      return atLeastOneUserSelected;
    }
  }
  _showItemByType(item){
    if ((item.typus.includes("PICKUP") || item.typus.includes("SERIES")) && !this.types.pickups){
      return false;
    }
    if (item.typus.includes("GROUP") && !this.types.groups){
      return false;
    }
    if (item.typus.includes("STORE") && !this.types.stores){
      return false;
    }
    return true;
  }

  showItem(item){
    return this._showItemByStore(item) && this._showItemByUser(item) && this._showItemByType(item);
  }

  showAllStores(bool){
    angular.forEach(this.stores, (store) => {
      store.selected = bool;
    });
    this.updateFilteredData();
  }

  getAllStores(){
    let stores = {};
    angular.forEach(this.data, (currentHistoryItem) => {
      if (angular.isUndefined(stores[currentHistoryItem.store])) {
        this.Store.get(currentHistoryItem.store).then((data) => {
          data.selected = true;
          this.stores[currentHistoryItem.store] = data;
        });
      }
    });
  }

  showAllUsers(bool){
    angular.forEach(this.users, (user) => {
      user.selected = bool;
    });
    this.updateFilteredData();
  }

  getAllUsers(){
    let users = {};
    angular.forEach(this.data, (currentHistoryItem) => {
      angular.forEach(currentHistoryItem.users, (user) => {
        if (angular.isUndefined(users[user])) {
          this.User.get(user).then((data) => {
            data.selected = true;
            this.users[user] = data;
          });
        }
      });
    });
  }

  $onChanges(changes) {
    if (changes && changes.data) {
      angular.forEach(this.data, (entry) => {
        entry.translate = "HISTORY." + entry.typus;
        entry.compareDate = entry.date.toISOString().substr(0,10);
        return entry;
      });
    }
  }
}

export default HistoryController;
