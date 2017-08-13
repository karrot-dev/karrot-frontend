import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import chatFloaterComponent from "./chatFloater.component";

let chatFloaterModule = angular.module("chatFloater", [
  uiRouter
])

.component("chatFloater", chatFloaterComponent)

.directive("chatScrollBottom", () => {
  return {
    scope: {
      chatScrollBottom: "="
    },
    link: (scope, elements) => {
      let el = elements[0];
      scope.$watchCollection("chatScrollBottom", (newValue) => {
        if (newValue) el.scrollTop = el.scrollHeight;
      });
    }
  };
})

.name;

export default chatFloaterModule;
