class HistoryController {
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

  constructor($mdDialog, $document, CurrentStores, Store, User) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      $document,
      CurrentStores,
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

  getTranslateKey(entry) {
    return "HISTORY." + entry.typus;
  }

  getTranslateValues(entry) {
    let values = {};
    if (entry.store) {
      let store = this.CurrentStores.get(entry.store);
      if (angular.isDefined(store)) {
        Object.assign(values, {
          "store_name": store.name,
          name: store.name
        });
      }
    }
    return values;
  }

  showDateHeaderBefore(index, array) {
    if (index === 0) return true;
    return this.onDifferentDay(array[index], array[index - 1]);
  }

  onDifferentDay(a, b) {
    return a.date.toISOString().substr(0,10) !== b.date.toISOString().substr(0,10);
  }

  loadMore() {
    return this.data.next().then((data) => {
      angular.forEach(data.results, (e) => {
        this.data.results.push(e);
      });
      this.data.next = data.next;
      return data;
    });
  }

  hasMore() {
    return angular.isDefined(this.data.next);
  }

  openHistoryDetail($event, item) {
    let DialogController = function (data) {
      "ngInject";
      this.data = data;
    };

    this.$mdDialog.show({
      parent: this.$document.body,
      targetEvent: $event,
      template: "<history-detail data='$ctrl.data'></history-detail>",
      locals: {
        data: item
      },
      controller: DialogController,
      controllerAs: "$ctrl"
    });
  }
}

export default HistoryController;
