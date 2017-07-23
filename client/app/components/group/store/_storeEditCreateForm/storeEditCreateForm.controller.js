class StoreEditCreateFormController {
  constructor($stateParams, $scope) {
    "ngInject";
    Object.assign(this, {
      $stateParams,
      $scope
    });
  }

  $onInit() {
    if (angular.isUndefined(this.data)) {
      Object.assign(this, {
        isCreate: true,
        data: {
          group: this.$stateParams.groupId
        }
      });
    }
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
    return this.onSubmit(locals).catch((err) => {
      Object.assign(this, {
        error: err.data
      });
    });
  }
}

export default StoreEditCreateFormController;
