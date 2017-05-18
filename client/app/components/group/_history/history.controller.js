class HistoryController {
  constructor($mdDialog, $document, CurrentStores, CurrentUsers) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      $document,
      CurrentStores,
      CurrentUsers,
      types: {
        groups: true,
        stores: true,
        pickups: true
      }
    });
  }

  $onInit() {
    this.showAllUsers(true);
    this.showAllStores(true);
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

  getStores() {
    return this.CurrentStores.list.filter((store) => {
      return angular.isDefined(this.data.results.find((history) => {
        return history.store === store.id;
      }));
    }).map((store) => {
      if (angular.isUndefined(store._selected)) {
        store._selected = true;
      }
      return store;
    });
  }

  getUsers() {
    return this.CurrentUsers.list.filter((user) => {
      return angular.isDefined(this.data.results.find((history) => {
        return history.users.indexOf(user.id) >= 0;
      }));
    }).map((user) => {
      if (angular.isUndefined(user._selected)) {
        user._selected = true;
      }
      return user;
    });
  }

  showAllStores(bool) {
    angular.forEach(this.getStores(), (store) => {
      store._selected = bool;
    });
  }

  showAllUsers(bool) {
    angular.forEach(this.getUsers(), (store) => {
      store._selected = bool;
    });
  }

  getHistoryItems() {
    return this.data.results.filter((item) => {
      return this._showItemByStore(item) && this._showItemByUser(item) && this._showItemByType(item);
    });
  }

  _showItemByStore(item) {
    return angular.isDefined(item.store)
      && this.getStores().findIndex((store) => store.id === item.store && store._selected) >= 0;
  }

  _showItemByUser(item) {
    if (item.users.length > 0) {
      for (let historyUser of item.users) {
        if (this.getUsers().findIndex((user) => user.id === historyUser && user._selected) >= 0)
          return true;
      }
    }
    return false;
  }
  _showItemByType(item) {
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
