let AppMaterial = ($mdThemingProvider) => {
  "ngInject";
  $mdThemingProvider.definePalette("yunity", {
    "50": "363636", // yunity black
    "100": "F5F5F5", // background grey
    "200": "91cb46", // yunity Green
    "300": "fbaf36", // yunity yellow
    "400": "0290a2", // yunity blue 0290a2
    "500": "f66c41", // yunity Orange
    "600": "2b9ccb", // blue for Links
    "700": "FFFF00",
    "800": "3572B0", // Chat Blue
    "900": "00FFFF",
    "A100": "91cb46",
    "A200": "f66c41", // yunity Orange
    "A400": "0000FF",
    "A700": "00FF00",
    "contrastDefaultColor": "dark",
      //hues which contrast should be 'dark' by default
    "contrastLightColors": [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500"
    ]
  });
  $mdThemingProvider.theme("default")
    .primaryPalette("yunity")
    .accentPalette("yunity");
};

export default AppMaterial;
