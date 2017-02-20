import StoreDetailModule from "./storeDetail";
import StoreDetailController from "./storeDetail.controller";
import StoreDetailComponent from "./storeDetail.component";
import StoreDetailTemplate from "./storeDetail.html";
import GroupComponentModule from "../group";

const { module } = angular.mock;

describe("StoreDetail", () => {
  beforeEach(module(StoreDetailModule));
  beforeEach(module(GroupComponentModule));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true });
  }));

  let $log, $httpBackend, $state;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
    $httpBackend = $injector.get("$httpBackend");
    $state = $injector.get("$state");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeDetail", () => {
      expect(StoreDetailModule).to.equal("storeDetail");
    });
  });

  describe("Routes", () => {
    context("when logged out", () => {

      describe("storeDetail", () => {

        let groupData = {
          id: 1
        };
        let storeData = {
          id: 25,
          group: groupData.id
        };

        it("should load store information", () => {
          $httpBackend.expectGET(`/api/groups/${groupData.id}/`).respond(groupData);
          $httpBackend.expectGET(`/api/stores/${storeData.id}/`).respond(storeData);
          $state.go("group.store", { storeId: storeData.id, groupId: groupData.id });
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
