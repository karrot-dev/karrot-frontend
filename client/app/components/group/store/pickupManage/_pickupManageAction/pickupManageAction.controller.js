class PickupManageActionController {
  constructor($mdMedia) {
    "ngInject";
    Object.assign(this, {
      $mdMedia
    });
  }

  isScreenSmall() {
    return !this.$mdMedia("gt-sm");
  }

  triggerEdit($event) {
    return this.onEdit({ $event, config: { series: this.flags.isSeries, data: this.data } });
  }

  triggerDelete($event) {
    return this.onDelete({ $event, config: { series: this.flags.isSeries, data: this.data } });
  }
}

export default PickupManageActionController;
