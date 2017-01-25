let AppMaterial = ($mdThemingProvider) => {
  "ngInject";
  $mdThemingProvider
    .theme("default")
    .primaryPalette("amber")
    .accentPalette("amber")
    .warnPalette("indigo")
    .backgroundPalette("brown");
};

export default AppMaterial;
