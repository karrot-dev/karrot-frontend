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

  isGtXs() {
    return this.$mdMedia("gt-xs");
  }
}

export default ScreenSizeService;
