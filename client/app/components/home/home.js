import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import homeHook from './home.hook';
 
let homeModule = angular.module('home', [
  uiRouter
]);

homeModule.config(($stateProvider) => { 
  "ngInject";

  $stateProvider
    .state('home', {
      url: '/',
      component: 'home'
    });
});

homeModule.run(homeHook);

var component = homeModule.component('home', homeComponent);

angular.module('home').directive('yunityLogout', ['Authentication', '$window', '$http', function(auth, $window, $http) {
    return {
        restrict: 'E',
        template: '<button>Log Out</button>',
        link: function(scope, element, attrs, controller) {
          if (!auth.isLoggedIn) {
            element.style.display='none';
          }
          element.bind('click', function() {
            auth.logout();
            // Logout currently always fails with error message:
            // {"data":{"detail":"CSRF Failed: CSRF token missing or incorrect."},"status":403,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"url":"/api/auth/logout/","data":{"email":"","password":""},"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=utf-8"}},"statusText":"Forbidden"}
            $window.location.href='/';
            $window.location.reload();
          });
        }
    }
}]); 

export default component.name;

