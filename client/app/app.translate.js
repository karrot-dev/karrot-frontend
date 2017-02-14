import localeEN from "./locales/locale-en.json";
import localeDE from "./locales/locale-de.json";
import localeFR from "./locales/locale-fr.json";
import localeSV from "./locales/locale-sv.json";
import localeES from "./locales/locale-es.json";
import localeEO from "./locales/locale-eo.json";
import localeIT from "./locales/locale-it.json";

let AppTranslate = ($translateProvider) => {
  "ngInject";
  $translateProvider
  .useCookieStorage()
  .useSanitizeValueStrategy("escape")
  .translations("en", localeEN)
  .translations("de", localeDE)
  .translations("fr", localeFR)
  .translations("sv", localeSV)
  .translations("eo", localeEO)
  .translations("es", localeES)
  .translations("it", localeIT)
  .fallbackLanguage("en")
  .registerAvailableLanguageKeys(["en", "de", "fr", "sv", "eo", "es", "it"], {
    "en_*": "en",
    "de_*": "de",
    "fr_*": "fr",
    "es_*": "es",
    "it_*": "it",
  })
  .determinePreferredLanguage();
};

export default AppTranslate;
