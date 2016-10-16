import PickupListModule from "./pickupList";
import PickupListController from "./pickupList.controller";
import PickupListComponent from "./pickupList.component";
import PickupListTemplate from "./pickupList.html";

describe("PickupList", () => {
  beforeEach(window.module(PickupListModule));
  
  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe("Controller", () => {
    // controller specs
  });

  describe("Template", () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
  });

  describe("Component", () => {
      // component/directive specs
    let component = PickupListComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(PickupListTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(PickupListController);
    });
  });
});
