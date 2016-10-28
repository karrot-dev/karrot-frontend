class LanguageChooserController {
  constructor($translate) {
    "ngInject";
    Object.assign(this, {
      $translate,
      activeLang: $translate.use(),
      providedLangs: ["de", "en"]
    });
  }

  changeLanguage(langKey) {
    this.$translate.use(langKey);
    this.activeLang = langKey;
  }
}

export default LanguageChooserController;
