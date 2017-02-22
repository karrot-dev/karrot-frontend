let HTTPErrorHandlerConfig = ($httpProvider) => {
  "ngInject";
  $httpProvider.interceptors.push(($q, $injector, $translate) => {
    "ngInject";
    return {
      "responseError": (rejection) => {
        let $mdToast = $injector.get("$mdToast");
        if (rejection.status === -1) {
          $translate("GLOBAL.CONNECTION_INTERRUPTED").then((message) => {
            $mdToast.showSimple(message);
          });
        } else if (rejection.status >= 500) {
          $translate("GLOBAL.SERVER_ERROR").then((message) => {
            $mdToast.showSimple(message);
          });
        }
        return $q.reject(rejection);
      }
    };
  });
};

export default HTTPErrorHandlerConfig;
