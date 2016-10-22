import CreatePickupModule from "./createPickup";
import CreatePickupController from "./createPickup.controller";
import CreatePickupComponent from "./createPickup.component";
import CreatePickupTemplate from "./createPickup.html";

const { module } = angular.mock;

describe("CreatePickup", () => {
  beforeEach(module(CreatePickupModule));

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
    it("is named createPickup", () => {
      expect(CreatePickupModule).to.equal("createPickup");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let ctrl = $componentController("createPickup", {});
      expect(ctrl).to.exist;
    });
  });

  describe("Template", () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it("has name in template [REMOVE]", () => {
      expect(CreatePickupTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe("Component", () => {
    // component/directive specs
    let component = CreatePickupComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(CreatePickupTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(CreatePickupController);
    });
  });
});
