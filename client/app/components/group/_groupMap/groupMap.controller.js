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
      center: {},
      defaults: {
        scrollWheelZoom: false
      },
      watchers: []
    });
  }

  $onInit() {
    this.watchers = [
      // deep watch stores
      this.$scope.$watch(() => this.CurrentStores.list, () => {
        this.update();
      }, true),

      // deep watch options
      this.$scope.$watch(() => this.CurrentGroup.map.options, () => {
        this.update();
      }, true),

      // watch center
      this.$scope.$watch(() => this.CurrentGroup.map.center, (center) => {
        if (center && !this.CurrentGroup.map.overview) {
          this.center = center;
          this.update();  // change the opacity
        }
      }),

      // watch overview
      this.$scope.$watch(() => this.CurrentGroup.map.overview, (overview) => {
        if (overview) this.showOverview();
      })
    ];
  }

  $onDestroy() {
    angular.forEach(this.watchers, (deregister) => {
      deregister();
    });
  }

  showOverview() {
    if (this.hasMarkers()){
      let bounds = new L.latLngBounds(Object.values(this.markers)); // eslint-disable-line
      this.bounds = {
        northEast: bounds._northEast,
        southWest: bounds._southWest,
        options: {
          maxZoom: 14
        }
      };
    }
  }

  update() {
    this.$timeout(() => {
      this.markers = this.getMarkers();
      if (this.CurrentGroup.map.overview) this.showOverview();
    });
  }

  hasMarkers() {
    return Object.keys(this.markers).length > 0;
  }

  getMarkers() {
    /* returns marker data from different sources
    *  - stores from CurrentStores.list
    *  - users from CurrentUsers.list, only using the members of the current group
    *
    *  CurrentGroup.map.options determine whether store and user markers should be made
    *  If a store is selected (via CurrentStores.selected), it reduces the opacity of the other store's markers
    */
    let markers = {};
    if (this.CurrentGroup.map.options.showStores) {
      angular.forEach(this.CurrentStores.list, (e) => {
        if (!e.latitude || !e.longitude) return;
        let selected = Object.keys(this.CurrentStores.selected).length < 1 ?  true :
          this.CurrentStores.selected.id === e.id;
        markers["store_" + e.id] = {
          lat: e.latitude,
          lng: e.longitude,
          // workaround: use <a> instead of <md-button> since the latter causes an excess of digest iterations
          // if it doesn't fit on the leaflet
          message: `<a ui-sref='group.store({ storeId: ${e.id}, groupId: ${e.group} })'>${e.name}</a>`,
          draggable: false,
          opacity: selected ? 1 : 0.5,
          icon: {
            type: "awesomeMarker",
            icon: "shopping-cart",
            prefix: "fa",
            markerColor: "darkblue"
          }
        };
      });
    }

    if (this.CurrentGroup.map.options.showUsers) {
      let groupMembers = this.CurrentUsers.list.filter((u) => this.CurrentGroup.value.members.indexOf(u.id) > -1);
      angular.forEach(groupMembers, (e) => {
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
