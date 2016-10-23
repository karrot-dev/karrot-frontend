import CreatePickupModule from "./createPickup";
import CreatePickupController from "./createPickup.controller";
import CreatePickupComponent from "./createPickup.component";
import CreatePickupTemplate from "./createPickup.html";
import PickupDate from "../../common/pickupDate/pickupDate";

const { module } = angular.mock;

describe("CreatePickup", () => {
  beforeEach(module(CreatePickupModule));
  beforeEach(module(PickupDate));

  beforeEach(() => {
    angular.mock.module(($provide) => {
      $provide.value("$mdDialog", {});
    });
  });

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
