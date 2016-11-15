import CreateStoreModule from "./createStore";
import CreateStoreController from "./createStore.controller";
import CreateStoreComponent from "./createStore.component";
import CreateStoreTemplate from "./createStore.html";

const { module } = angular.mock;

describe("CreateStore", () => {
  let $mdDialog, $httpBackend;

  beforeEach(() => {
    module(CreateStoreModule);
    inject(($injector) => {
      $httpBackend = $injector.get("$httpBackend");
      $mdDialog = $injector.get("$mdDialog");
      sinon.stub($mdDialog, "hide");
      sinon.stub($mdDialog, "cancel");
    });
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
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

    it("creates store", () => {
      let $ctrl = $componentController("createStore", {}, {
        groupId: 1337
      });
      $ctrl.storeData.name = "blabla";
      $httpBackend.expectPOST("/api/stores/", {
        group: 1337,
        name: "blabla"
      }).respond({ some: "data" });

      $ctrl.createStore();
      $httpBackend.flush();
      expect($mdDialog.hide).to.have.been.calledWith({ some: "data" });
    });

    it("closes panel", () => {
      let $ctrl = $componentController("createStore", {});
      $ctrl.closePanel();
      expect($mdDialog.cancel).to.have.been.called;
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
