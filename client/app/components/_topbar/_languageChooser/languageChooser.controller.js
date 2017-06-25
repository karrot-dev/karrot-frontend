import frontendStatus from "../../../locales/status-frontend.json";

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
        ru: "Русский",
        zh: "中文"
      }
    });
  }

  $onInit() {
    this.sortedLanguages = Object.keys(this.providedLangs).map((k) => {
      return {
        key: k,
        name: this.providedLangs[k],
        completed: parseInt(frontendStatus[k].completed.replace("%", ""))
      };
    });
    this.sortedLanguages.sort((a, b) => {
      if (a.completed !== b.completed)
        return b.completed - a.completed  ;
      return a.name.localeCompare(b.name);
    });
  }

  changeLanguage(langKey) {
    this.$translate.use(langKey);
  }
}

export default LanguageChooserController;
