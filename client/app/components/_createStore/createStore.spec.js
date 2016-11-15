import CreateStoreModule from "./createStore";
import CreateStoreController from "./createStore.controller";
import CreateStoreComponent from "./createStore.component";
import CreateStoreTemplate from "./createStore.html";

const { module } = angular.mock;

describe("CreateStore", () => {
  beforeEach(module(CreateStoreModule));

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

  describe("Template", () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it("has name in template [REMOVE]", () => {
      expect(CreateStoreTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
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
