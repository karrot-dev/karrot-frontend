import localeEN from "./locales/locale-en.json";
import localeDE from "./locales/locale-de.json";
import localeFR from "./locales/locale-fr.json";
import localeSV from "./locales/locale-sv.json";
import localeES from "./locales/locale-es.json";
import localeEO from "./locales/locale-eo.json";
import localeIT from "./locales/locale-it.json";
import localeRU from "./locales/locale-ru.json";
import localeZH from "./locales/locale-zh.json";

let AppLocalize = ($translateProvider, $httpProvider) => {
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
  .translations("zh", localeZH)
  .fallbackLanguage("en")
  .registerAvailableLanguageKeys(["en", "de", "fr", "sv", "eo", "es", "it", "ru", "zh"], {
    "en*": "en",
    "de*": "de",
    "fr*": "fr",
    "sv": "sv",
    "eo": "eo",
    "es*": "es",
    "it*": "it",
    "ru*": "ru",
    "zh*": "zh",
    "*": "en" // non-mapped language code get served in English
  })
  .determinePreferredLanguage();

  $httpProvider.interceptors.push(($translate) => {
    "ngInject";
    return {
      "request": (config) => {
        config.headers["Accept-Language"] = $translate.use();
        return config;
      }
    };
  });
};

export default AppLocalize;
