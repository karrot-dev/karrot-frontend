import template from "./markdownInput.html";
import controller from "./markdownInput.controller";
import "./markdownInput.styl";

let markdownInputComponent = {
  bindings: {
    translationLabel: "@",
    model: "=",
    onSubmit: "&",
    options: "<"
  },
  template,
  controller
};

export default markdownInputComponent;
