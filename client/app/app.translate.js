import localeEN from "./locales/locale-en.json";
import localeDE from "./locales/locale-de.json";
import localeFR from "./locales/locale-fr.json";

let AppTranslate = ($translateProvider) => {
  "ngInject";
  $translateProvider
  .useCookieStorage()
  .useSanitizeValueStrategy("escape")
  .translations("en", localeEN)
  .translations("de", localeDE)
  .translations("fr", localeFR)
  .fallbackLanguage("en")
  .registerAvailableLanguageKeys(["en", "de", "fr"], {
    "en_*": "en",
    "de_*": "de",
    "fr_*": "fr"
  })
  .determinePreferredLanguage();
};

export default AppTranslate;
