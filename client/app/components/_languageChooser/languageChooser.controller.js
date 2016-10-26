class LanguageChooserController {
  constructor($translate) {
    "ngInject";
    Object.assign(this, {
      $translate
    });
  }

  changeLanguage(langKey) {
    this.$translate.use(langKey);
  }
}

export default LanguageChooserController;
