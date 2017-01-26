let AppMaterial = ($mdThemingProvider) => {
  "ngInject";

  $mdThemingProvider
    .theme("default")
    .primaryPalette("brown")
    .accentPalette("deep-orange")
    .warnPalette("indigo")
    .backgroundPalette("grey")
    ;

};

export default AppMaterial;
