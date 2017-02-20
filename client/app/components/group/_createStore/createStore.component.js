import template from "./createStore.html";
import controller from "./createStore.controller";
import "./createStore.styl";

let createStoreComponent = {
  bindings: {
    groupId: "<"
  },
  template,
  controller
};

export default createStoreComponent;
