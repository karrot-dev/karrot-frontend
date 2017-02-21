import template from "./storeEditCreateForm.html";
import controller from "./storeEditCreateForm.controller";
import "./storeEditCreateForm.styl";

let storeEditCreateFormComponent = {
  bindings: {
    editData: "="
  },
  template,
  controller
};

export default storeEditCreateFormComponent;
