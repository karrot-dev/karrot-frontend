import StoreDetailModule from "./storeDetail";
import StoreDetailController from "./storeDetail.controller";
import StoreDetailComponent from "./storeDetail.component";
import StoreDetailTemplate from "./storeDetail.html";
import Authentication from "../../common/authentication/authentication";

const { module } = angular.mock;

describe("StoreDetail", () => {
  beforeEach(module(Authentication));
  beforeEach(module(StoreDetailModule));

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
    it("is named storeDetail", () => {
      expect(StoreDetailModule).to.equal("storeDetail");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let ctrl = $componentController("storeDetail", {});
      expect(ctrl).to.exist;
    });
  });

  describe("Template", () => {
  });

  describe("Component", () => {
    // component/directive specs
    let component = StoreDetailComponent;

    it("includes the intended template", () => {
      expect(component.template).to.equal(StoreDetailTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(StoreDetailController);
    });
  });
});
