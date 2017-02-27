import template from "./storeEditCreateForm.html";
import controller from "./storeEditCreateForm.controller";
import "./storeEditCreateForm.styl";

let storeEditCreateFormComponent = {
  bindings: {
    data: "<",
    onSubmit: "&"
  },
  template,
  controller
};

export default storeEditCreateFormComponent;
