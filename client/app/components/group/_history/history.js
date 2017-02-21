import angular from "angular";
import uiRouter from "angular-ui-router";
import historyComponent from "./history.component";

let historyModule = angular.module("history", [
  uiRouter
])

.component("history", historyComponent)


.name;

export default historyModule;
