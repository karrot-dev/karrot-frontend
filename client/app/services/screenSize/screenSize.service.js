class ScreenSizeService {
  constructor($mdMedia) {
    "ngInject";
    Object.assign(this, {
      $mdMedia
    });
  }

  isGtSm() {
    return this.$mdMedia("gt-sm");
  }
}

export default ScreenSizeService;
