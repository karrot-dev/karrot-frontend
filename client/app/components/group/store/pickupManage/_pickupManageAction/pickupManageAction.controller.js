class PickupManageActionController {
  constructor(ScreenSize) {
    "ngInject";
    Object.assign(this, {
      ScreenSize
    });
  }

  triggerEdit($event) {
    return this.onEdit({ $event, config: { series: this.flags.isSeries, data: this.data } });
  }

  triggerDelete($event) {
    return this.onDelete({ $event, config: { series: this.flags.isSeries, data: this.data } });
  }
}

export default PickupManageActionController;
