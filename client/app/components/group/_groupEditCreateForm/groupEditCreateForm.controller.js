import jstz from "jstimezonedetect";

class GroupEditCreateFormController {
  constructor(CurrentGroup, GroupService, $scope) {
    "ngInject";
    Object.assign(this, {
      CurrentGroup,
      GroupService,
      $scope,
      allTimezones: []
    });
  }
  $onInit() {
    if (angular.isUndefined(this.data)) {
      Object.assign(this, {
        isCreate: true,
        data: {
          timezone: jstz.determine().name()
        }
      });
    }

    this.GroupService.timezones().then((response) => {
      this.allTimezones = response.all_timezones;
    });
  }

  submit() {
    // update data if marker has been dragged around
    if (this.marker) {
      Object.assign(this.data, {
        latitude: this.marker.p.lat,
        longitude: this.marker.p.lng
      });
    }

    // set locals to evaluate against in the parent expression
    // data="parent_submit(data)" takes the locals.data object
    let locals = { data: this.data };
    return this.onSubmit(locals).then((data) => {
      this.CurrentGroup.set(data);
      return data;
    })
    .catch((err) => {
      Object.assign(this, {
        error: err.data
      });
    });
  }

  filterTimezones(search) {
    return this.allTimezones.filter((tz) => tz.toLowerCase().includes(search.toLowerCase()));
  }
}

export default GroupEditCreateFormController;
