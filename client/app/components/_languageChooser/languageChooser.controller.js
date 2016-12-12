class LanguageChooserController {
  constructor($translate) {
    "ngInject";
    Object.assign(this, {
      $translate,
      providedLangs: ["de", "en", "fr"]
    });
  }

  changeLanguage(langKey) {
    this.$translate.use(langKey);
  }
}

export default LanguageChooserController;
