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
      },
      _selectedStores: [],
      _selectedUsers: [],
      userQuery: ""
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

  getStores() {
    return this.CurrentStores.list.filter((store) => {
      return angular.isDefined(this.data.results.find((history) => {
        return history.store === store.id;
      }));
    });
  }

  getUsers() {
    return this.CurrentUsers.list.filter((user) => {
      if (this.userQuery !== "" && !user.display_name.toLowerCase().includes(this.userQuery.toLowerCase())) {
        return false;
      }
      return this.data.results.findIndex((history) => {
        return history.users.indexOf(user.id) >= 0;
      }) >= 0;
    });
  }

  _undefinedAsTrue(bool) {
    return bool || angular.isUndefined(bool);
  }

  selectedUsers(id) {
    return (bool) => {
      if (angular.isDefined(bool)) {
        this._selectedUsers[id] = bool;
      }
      return this._undefinedAsTrue(this._selectedUsers[id]);
    };
  }

  selectedStores(id) {
    return (bool) => {
      if (angular.isDefined(bool)) {
        this._selectedStores[id] = bool;
      }
      return this._undefinedAsTrue(this._selectedStores[id]);
    };
  }

  showAllStores(bool) {
    for (let store of this.CurrentStores.list) {
      this.selectedStores(store.id)(bool);
    }
  }

  showAllUsers(bool) {
    for (let user of this.CurrentUsers.list) {
      this.selectedUsers(user.id)(bool);
    }
  }

  getHistoryItems() {
    return this.data.results.filter((item) => {
      return this._showItemByStore(item) && this._showItemByUser(item) && this._showItemByType(item);
    });
  }

  _showItemByStore(item) {
    // show items if they aren't associated with a store or have been selected
    return item.store === null || this.selectedStores(item.store)();
  }

  _showItemByUser(item) {
    // needs to have at least one selected user
    for (let id of item.users) {
      if (this.selectedUsers(id)()){
        return true;
      }
    }
    return false;
  }
  _showItemByType(item) {
    // filter out disabled types
    if ((item.typus.startsWith("PICKUP_") || item.typus.startsWith("SERIES_")) && !this.types.pickups){
      return false;
    }
    if (item.typus.startsWith("GROUP_") && !this.types.groups){
      return false;
    }
    if (item.typus.startsWith("STORE_") && !this.types.stores){
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
