import angular from "angular";
import uiRouter from "angular-ui-router";
import PickupDate from "../../../../services/pickupDate/pickupDate";
import createPickupComponent from "./createPickup.component";
import moment from "moment";

let createPickupModule = angular.module("createPickup", [
  uiRouter,
  PickupDate
])

.component("createPickup", createPickupComponent)

.directive("customFormatHack", () => {
  "ngInject";
  return {
    restrict: "A",
    require: "ngModel",
    link: (scope, element, attrs, ngModelController) => {
      // replacing existing parser
      ngModelController.$parsers[1] = (data) => {
        //View -> Model
        let m = moment(data, "LT", true);
        return m.isValid() ? m.toDate() : undefined;
      };
      ngModelController.$validators.time = (data) => {
        let b =  moment(data, "LT", true).isValid();
        return b;
      };
      // replace existing formatter
      ngModelController.$formatters.shift();
      ngModelController.$formatters.push((data) => {
        //Model -> View
        return moment(data).format("LT");
      });
    }
  };
})

.name;

export default createPickupModule;
