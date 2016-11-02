import localeEN from "./locales/locale-en.json";
import localeDE from "./locales/locale-de.json";

let AppTranslate = ($translateProvider) => {
  "ngInject";
  $translateProvider
  .useCookieStorage()
  .useSanitizeValueStrategy("escape")
  .translations("en", localeEN)
  .translations("de", localeDE)
  .fallbackLanguage("en")
  .registerAvailableLanguageKeys(["en", "de"], {
    "en_*": "en",
    "de_*": "de"
  })
  .determinePreferredLanguage();
};

export default AppTranslate;
