class LandingPageMapController {
  constructor(GroupService, $timeout, $scope, leafletData) {
    "ngInject";
    Object.assign(this, {
      GroupService,
      leafletData,
      markers: {},
      center: {
        lat: 50.112371,
        lng: 8.687439,
        zoom: 4
      }
    });

    // invalidate Map is needed so that map isn't grey after it's loaded
    const invalidateMap = () => {
      $scope.mapController.leafletData.getMap().then((map) => {
        map.invalidateSize();
      });
    };
    $scope.mapController = this;
    $timeout(invalidateMap, 1200);
  }

  $onInit() {
    this.GroupService.list().then((allGroups) => {
      angular.forEach(allGroups, (group) => {
        if (group.latitude !== null){
          const memberCount = group.members.length;
          this.markers[group.id] = {
            lat: group.latitude,
            lng: group.longitude,
            message: `<group-popup name='${group.name}' member-count='${memberCount}'></group-popup>`
          };
        }
      });
    });
  }
}

export default LandingPageMapController;
