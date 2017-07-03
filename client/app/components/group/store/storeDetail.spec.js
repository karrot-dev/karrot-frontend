import StoreDetailModule from "./storeDetail";
import StorePickupsModule from "./storePickups/storePickups";
import GroupComponentModule from "../group";

const { module } = angular.mock;

describe("StoreDetail", () => {
  beforeEach(module(StoreDetailModule));
  beforeEach(module(GroupComponentModule));
  beforeEach(module(StorePickupsModule));  // to test redirection
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true })
      .state("landingPage", { url: "landingPage" });
  }));
  beforeEach(module({ $translate: sinon.stub() }));
  beforeEach(module({ translateFilter: (a) => a }));
  beforeEach(module(($mdAriaProvider) => {
    $mdAriaProvider.disableWarnings();
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

  describe.only("Routes", () => {
    beforeEach(() => {
      inject(($translate, $q) => {
        $translate.returns($q.resolve());
      });
    });
    let groupData = {
      id: 1
    };
    let storeData = {
      id: 25,
      group: groupData.id
    };

    it("should load store information", () => {
      inject((CurrentGroup) => {
        // We don't want the side effects of the "group" state persisting the group
        // It would be better to stub the whole "group" state, but I don't know how
        sinon.stub(CurrentGroup, "set");
      });
      // redirectTo does an additional request
      $httpBackend.expectGET(`/api/stores/${storeData.id}/`).respond(storeData);
      $httpBackend.expectGET(`/api/groups/${groupData.id}/`).respond(groupData);
      $httpBackend.expectGET(`/api/stores/${storeData.id}/`).respond(storeData);
      expect(
        $state.go("group.store", { storeId: storeData.id, groupId: groupData.id })
      ).to.eventually.be.fulfilled;
      $httpBackend.flush();
      expect($state.current.component).to.equal("storePickups");
    });

    it("redirects to landing page if store not found", () => {
      $httpBackend.expectGET(`/api/stores/${storeData.id}/`).respond(404);
      $state.go("group.store", { storeId: storeData.id, groupId: groupData.id });
      $httpBackend.flush();
      expect($state.current.name).to.equal("landingPage");
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<store-detail></store-detail>")(scope);
    });
  });
});
