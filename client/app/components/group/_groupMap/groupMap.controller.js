class GroupMapController {
  constructor($scope, CurrentGroup, CurrentStores, CurrentUsers, $timeout) {
    "ngInject";
    Object.assign(this, {
      $scope,
      CurrentGroup,
      CurrentStores,
      CurrentUsers,
      $timeout,
      markers: {},
      bounds: {},
      defaults: {
        scrollWheelZoom: false
      },
      watchers: []
    });
  }

  $onInit() {
    // deep watch stores
    let watcher = this.$scope.$watch(() => this.CurrentStores.list, () => {
      this.update();
    }, true);
    this.watchers.push(watcher);

    // deep watch options
    watcher = this.$scope.$watch(() => this.CurrentGroup.map.options, () => {
      this.update();
    }, true);
    this.watchers.push(watcher);

    // deep watch center (only needed for updating overview)
    watcher = this.$scope.$watch(() => this.CurrentGroup.map.center, () => {
      this.CurrentGroup.map.overview = this.CurrentGroup.map.center.lat === this.CurrentGroup.value.latitude
              && this.CurrentGroup.map.center.lng === this.CurrentGroup.value.longitude;
    }, true);
    this.watchers.push(watcher);

    // watch overview
    watcher = this.$scope.$watch(() => this.CurrentGroup.map.overview, (changes) => {
      if (changes) this.showOverview();
    });
    this.watchers.push(watcher);

    if (this.CurrentGroup.map.center.lat === 0.0){
      this.CurrentGroup.map.center = {
        lat: this.CurrentGroup.value.latitude,
        lng: this.CurrentGroup.value.longitude,
        zoom: 12
      };
    }
  }

  $onDestroy() {
    angular.forEach(this.watchers, (deregister) => {
      deregister();
    });
  }

  showOverview(){
    if (this.hasMarkers()){
      let bounds = new L.latLngBounds(Object.values(this.markers)).pad(0.15); // eslint-disable-line
      this.bounds = {
        northEast: bounds._northEast,
        southWest: bounds._southWest,
        options: {
          maxZoom: 12
        }
      };
    }
  }

  getUsers(userIdArray){
    return userIdArray.map((id) => {
      return this.CurrentUsers.get(id);
    });
  }

  update() {
    this.markers = this.getMarkers(this.CurrentStores.list);
    if (this.CurrentGroup.map.overview) this.showOverview();
  }

  hasMarkers() {
    return Object.keys(this.markers).length > 0;
  }

  getMarkers(fromArray) {
    let markers = {};
    if (this.CurrentGroup.map.options.showStores){
      angular.forEach(fromArray, (e) => {
        if (!e.latitude || !e.longitude) return;
        markers["store_" + e.id] = {
          lat: e.latitude,
          lng: e.longitude,
          message: `<a ui-sref='group.store({ storeId: ${e.id}, groupId: ${e.group} })'>${e.name}</a>`,
          draggable: false,
          icon: {
            type: "awesomeMarker",
            icon: "shopping-cart",
            prefix: "fa",
            markerColor: "darkblue"
          }
        };
      });
    }

    if (this.CurrentGroup.map.options.showUsers){
      let allUsers = this.getUsers(this.CurrentGroup.value.members);
      angular.forEach(allUsers, (e) => {
        if (!e.latitude || !e.longitude) return;
        markers["user_" + e.id] = {
          lat: e.latitude,
          lng: e.longitude,
          message: `<a ui-sref='userDetail({ id: ${e.id} })'>${e.display_name}</a>`,
          draggable: false,
          icon: {
            type: "awesomeMarker",
            icon: "user",
            prefix: "fa",
            markerColor: "green"
          }
        };
      });
    }

    return markers;
  }
}

export default GroupMapController;
