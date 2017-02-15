import localeEN from "./locales/locale-en.json";
import localeDE from "./locales/locale-de.json";
import localeFR from "./locales/locale-fr.json";
import localeSV from "./locales/locale-sv.json";
import localeES from "./locales/locale-es.json";
import localeEO from "./locales/locale-eo.json";
import localeIT from "./locales/locale-it.json";
import localeRU from "./locales/locale-ru.json";

let AppLocalize = ($translateProvider) => {
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
  .translations("ru", localeRU)
  .fallbackLanguage("en")
  .registerAvailableLanguageKeys(["en", "de", "fr", "sv", "eo", "es", "it", "ru"], {
    "en_*": "en",
    "de_*": "de",
    "fr_*": "fr",
    "es_*": "es",
    "it_*": "it",
    "ru_*": "ru"
  })
  .determinePreferredLanguage();
};

export default AppLocalize;
