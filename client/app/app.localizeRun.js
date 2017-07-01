import moment from "moment";

let AppLocalize = (tmhDynamicLocale, $document, $rootScope, $translate, $mdDateLocale, $filter, $locale) => {
  "ngInject";
  let localize = (event, data) => {
    if (!data.language) {
      return;
    }
    // sets "lang" attribute to html
    $document[0].documentElement.setAttribute("lang", data.language);

    // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
    tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, "-")).then(() => {

      // angular-material localization
      // https://material.angularjs.org/latest/api/service/$mdDateLocaleProvider
      $mdDateLocale.shortDays = $locale.DATETIME_FORMATS.SHORTDAY.map((day) => day.substring(0,1))
        || $mdDateLocale.shortDays;
      $mdDateLocale.firstDayOfWeek = $locale.DATETIME_FORMATS.FIRSTDAYOFWEEK
        || $mdDateLocale.firstDayOfWeek;

    });

    moment.locale(data.language);
  };
  // patch angular-material to use moment.js formatting
  $mdDateLocale.formatDate = (date) => {
    if (!date) return "";
    return moment(date).format("L");
  };
  $mdDateLocale.parseDate = (dateString) => {
    let m = moment(dateString, "L", true);
    return m.isValid() ? m.toDate() : new Date(NaN);
  };

  $rootScope.$on("$translateChangeSuccess", localize); //eslint-disable-line

  // first page load
  localize({}, {
    language: $translate.use()
  });
};

export default AppLocalize;
