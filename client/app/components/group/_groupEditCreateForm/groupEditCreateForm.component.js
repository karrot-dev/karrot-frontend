import template from "./groupEditCreateForm.html";
import controller from "./groupEditCreateForm.controller";
import "./groupEditCreateForm.styl";

let groupEditCreateFormComponent = {
  bindings: {
    editData: "="
  },
  template,
  controller
};

export default groupEditCreateFormComponent;
