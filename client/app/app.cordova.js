/*

  Cordova configuration :)

  This is needed for two reasons:

    1. set the base URL for API requests

      When running in a web browser the API requests will go to the domain that
      servered the files. When running in cordova they are served locally over
      file:// protocol which obviously can't serve those requests.

      We have to set a base url for all requests which we do via an interceptor.

    2. handle csrf tokens

      Cordova apps run in a way that we don't get direct access to cookies.
      The sessions cookies are handled fine for us already, we don't need to
      worry about that bit.

      However, the csrf token mechanism relies on accessing the cookie value
      from javascript, and passing the value in the API request headers. This is
      not possible under cordova.

      Fortunately there is a nice little cordova plugin that lets us access the
      cookies!

      We add an http interceptor to pull out any csrf tokens cookie values and
      store the token locally, we then set this value on any outgoing requests
      headers.

  CORDOVA* globals:

    During webpack build the following globals are defined, for example:

      CORDOVA = true
      CORDOVA_BACKEND = "https://dev.foodsaving.world"

    If you are developing against a local backend, you'll want to set

*/

export default ($httpProvider) => {
  "ngInject";

  if (CORDOVA) {

    // everything in here will be removed when not building for cordova

    // These are django defaults
    // TODO: load them from $httpProvider.defaults?
    const XSRF_HEADER_NAME = "X-CSRFToken";
    const XSRF_COOKIE_NAME = "csrftoken";

    const XSRF_STORAGE_KEY = "csrftoken";

    const BASE_URL = CORDOVA_BACKEND.replace(/\/?$/,"");

    $httpProvider.interceptors.push(() => {
      return {
        request: (config) => {
          config.url = BASE_URL + config.url;
          return config;
        }
      };
    });

    $httpProvider.interceptors.push(($q, $log, $window) => {
      "ngInject";

      if (!$window.cookieEmperor) {
        $log.error("window.cookieEmperor is not available, csrf will not work, " +
                   "ensure you have installed the cordova plugin");
        return;
      }

      let csrftoken = $window.localStorage.getItem(XSRF_STORAGE_KEY);

      return {
        request: (config) => {
          if (requiresCsrf(config.method)) {
            config.headers[XSRF_HEADER_NAME] = csrftoken;
          }
          return config;
        },
        response: (response) => {
          return updateCsrfToken().then(() => response);
        },
        responseError: (rejection) => {
          return updateCsrfToken().then(() => $q.reject(rejection));
        }
      };

      function saveToken(token) {
        csrftoken = token;
        $window.localStorage.setItem(XSRF_STORAGE_KEY, token);
      }

      // TODO: is this needed on each request? check django...
      function updateCsrfToken() {
        return fetchToken().then((token) => {
          if (token && token !== csrftoken) {
            saveToken(token);
          }
        });
      }

      function fetchToken() {
        return $q((resolve) => {
          $window.cookieEmperor.getCookie(BASE_URL, XSRF_COOKIE_NAME, (data) => {
            resolve(data.cookieValue);
          }, (err) => {
            if (err) $log.warn(err);
            resolve(null);
          });
        });
      }

    });
  }
};

export function requiresCsrf(method) {
  return !/^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}
