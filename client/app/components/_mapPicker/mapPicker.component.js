import template from "./mapPicker.html";
import controller from "./mapPicker.controller";
import "./mapPicker.styl";

let mapPickerComponent = {
  bindings: {
    placeholder: "@",
    data: "<" // item with latitude, longitude and address
  },
  template,
  controller
};

export default mapPickerComponent;
