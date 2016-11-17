import StoreDetailModule from "./storeDetail";
import StoreDetailController from "./storeDetail.controller";
import StoreDetailComponent from "./storeDetail.component";
import StoreDetailTemplate from "./storeDetail.html";

const { module } = angular.mock;

describe("StoreDetail", () => {
  let $httpBackend, $state;
  beforeEach(module(StoreDetailModule));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true });
  }));

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $state = $injector.get("$state");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("Module", () => {
    it("is named storeDetail", () => {
      expect(StoreDetailModule).to.equal("storeDetail");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should save storedata", () => {
      let storedata = { id: 667, name: "blarb" };
      let $ctrl = $componentController("storeDetail", {}, { storedata });
      let feedback = $ctrl.updateStoredata();
      $httpBackend.expectPATCH(`/api/stores/${storedata.id}/`, storedata).respond(storedata);
      $httpBackend.flush();
      expect(feedback).to.eventually.deep.equal(storedata);
    });
  });

  describe("Routes", () => {
    context("when logged in", () => {

      let loginData = {
        "display_name": "asdflo",
        "email": "asdf.asdf@asdf.asdf"
      };

      beforeEach(() => {
        $httpBackend.expectGET("/api/auth/status/").respond(loginData);
      });

      describe("storeDetail", () => {
        let groupData = {
          id: 12
        };
        let storeData = {
          id: 25,
          group: groupData.id
        };

        it("should load store and group information", () => {
          $httpBackend.expectGET(`/api/stores/${storeData.id}/`).respond(storeData);
          $httpBackend.expectGET(`/api/groups/${groupData.id}/`).respond(groupData);
          $state.go("storeDetail", { id: storeData.id });
          $httpBackend.flush();
          expect($state.current.component).to.equal("storeDetail");
        });
      });
    });
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
