import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import storeEditCreateFormComponent from "./storeEditCreateForm.component";
import StoreService from "services/store/store";
import markdownInput from "components/_markdownInput/markdownInput";
import mapPicker from "components/_mapPicker/mapPicker";

let storeEditCreateFormModule = angular.module("storeEditCreateForm", [
  uiRouter,
  StoreService,
  markdownInput,
  mapPicker
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
