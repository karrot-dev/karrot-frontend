import CreateStoreModule from "./createStore";
import CreateStoreController from "./createStore.controller";
import CreateStoreComponent from "./createStore.component";
import CreateStoreTemplate from "./createStore.html";

const { module } = angular.mock;

describe("CreateStore", () => {
  beforeEach(() => {
    module(CreateStoreModule);
    angular.mock.module(($provide) => {
      $provide.value("$mdDialog", {
        hide: () => {}
      });
    });
  });

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
    it("is named createStore", () => {
      expect(CreateStoreModule).to.equal("createStore");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let $ctrl = $componentController("createStore", {});
      expect($ctrl).to.exist;
    });
  });

  describe("Component", () => {
    // component/directive specs
    let component = CreateStoreComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(CreateStoreTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(CreateStoreController);
    });
  });
});
