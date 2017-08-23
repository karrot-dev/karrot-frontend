class ScreenSizeService {
  constructor($mdMedia) {
    "ngInject";
    Object.assign(this, {
      $mdMedia
    });
  }

  isMediumOrLarger() {
    return this.$mdMedia("gt-sm");
  }
}

export default ScreenSizeService;
