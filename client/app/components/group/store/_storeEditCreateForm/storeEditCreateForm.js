import angular from "angular";
import uiRouter from "angular-ui-router";
import storeEditCreateFormComponent from "./storeEditCreateForm.component";
import Geocoding from "../../../../services/geocoding/geocoding";
import StoreService from "../../../../services/store/store";
import markdownInput from "../../../_markdownInput/markdownInput";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules

let storeEditCreateFormModule = angular.module("storeEditCreateForm", [
  uiRouter,
  Geocoding,
  StoreService,
  markdownInput,
  "ui-leaflet"
])

.component("storeEditCreateForm", storeEditCreateFormComponent)

.directive("storenameValidator", (StoreService, $q) => {
  "ngInject";
  return {
    require: "ngModel",
    link: (scope, element, attrs, ngModel) => {
      ngModel.$asyncValidators.unique = (viewValue) => {
        let groupId = scope.$ctrl.data.group;
        let storeId = scope.$ctrl.data.id;
        return StoreService.listStoresInGroupByName(groupId, viewValue)
        .then((response) => {
          if (response.length === 1 && response[0].id !== storeId) {
            return $q.reject();
          }
          return true;
        });
      };
    }
  };
})

.name;

export default storeEditCreateFormModule;
