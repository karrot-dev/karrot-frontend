import angular from "angular";
import uiRouter from "angular-ui-router";
import groupEditCreateFormComponent from "./groupEditCreateForm.component";
import GroupService from "../../../services/group/group";
import Geocoding from "../../../services/geocoding/geocoding";
import markdownInput from "../../_markdownInput/markdownInput";
import "leaflet";
import "ui-leaflet";
import "leaflet/dist/leaflet.css"; // looks in node_modules

let groupEditCreateFormModule = angular.module("groupEditCreateForm", [
  uiRouter,
  Geocoding,
  GroupService,
  markdownInput,
  "ui-leaflet"
])

.component("groupEditCreateForm", groupEditCreateFormComponent)

.directive("groupnameValidator", [GroupService, "$q", (GroupService, $q) => {
  return {
    require: "ngModel",
    link: (scope, element, attrs, ngModel) => {
      let groupId = scope.$ctrl.data.id;
      ngModel.$asyncValidators.unique = (viewValue) => {
        return GroupService.listByGroupName(viewValue)
        .then((response) => {
          if (response.length === 1 && groupId !== response[0].id) {
            return $q.reject();
          }
          return true;
        });
      };
    }
  };
}])

.name;

export default groupEditCreateFormModule;