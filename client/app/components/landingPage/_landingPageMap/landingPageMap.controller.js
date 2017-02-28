class LandingPageMapController {
  constructor(GroupService, $scope, $timeout) {
    "ngInject";
    Object.assign(this, {
      GroupService,
      markers: {},
      center: {
        lat: 50.112371,
        lng: 8.687439,
        zoom: 4
      },
      defaults: {
        scrollWheelZoom: false,
        maxZoom: 2
      }
    });

    $timeout(() => $scope.$broadcast("invalidateSize"), 1200);
  }

  $onInit() {
    this.GroupService.list().then((allGroups) => {
      angular.forEach(allGroups, (group) => {
        if (group.latitude && group.longitude){
          this.markers[group.id] = {
            lat: group.latitude,
            lng: group.longitude,
            message: `<group-popup name='${group.name}' member-count='${group.members.length}'></group-popup>`
          };
        }
      });
    });
  }
}

export default LandingPageMapController;
