import angular from "angular";
import uiRouter from "angular-ui-router";
import searchBarComponent from "./searchBar.component";

let searchBarModule = angular.module("searchBar", [
  uiRouter
])

.component("searchBar", searchBarComponent)

.name;

export default searchBarModule;
