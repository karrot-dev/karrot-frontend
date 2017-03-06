class LandingPageMapController {
  constructor(GroupService, $scope, $timeout) {
    "ngInject";
    Object.assign(this, {
      GroupService,
      markers: {},
      center: {
        lat: 30.112371,
        lng: 8.687439,
        zoom: 2
      },
      defaults: {
        scrollWheelZoom: false,
        maxZoom: 5,
        tileLayer: "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
        tileLayerOptions: {
          attribution:
            "Map tiles by <a href='http://stamen.com'>Stamen Design</a>,\n\ under\n\
            <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by\n\
            <a href='http://openstreetmap.org'>OpenStreetMap</a>, under\n\
            <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>."
        }
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
