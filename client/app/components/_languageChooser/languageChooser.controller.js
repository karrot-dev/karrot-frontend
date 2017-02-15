class LanguageChooserController {
  constructor($translate) {
    "ngInject";
    Object.assign(this, {
      $translate,
      providedLangs: {
        de: "Deutsch",
        en: "English",
        fr: "Français",
        sv: "Svenska",
        es: "Español",
        it: "Italiano",
        eo: "Esperanto",
        ru: "Русский"
      }
    });
  }

  changeLanguage(langKey) {
    this.$translate.use(langKey);
  }
}

export default LanguageChooserController;
