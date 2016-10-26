import localeEN from "./locales/locale-en.json";
import localeDE from "./locales/locale-de.json";

let AppTranslate = ($translateProvider) => {
  "ngInject";
  $translateProvider
  .translations("en", localeEN)
  .translations("de", localeDE)
  .useSanitizeValueStrategy("escape")
  .preferredLanguage("en");
};

export default AppTranslate;
