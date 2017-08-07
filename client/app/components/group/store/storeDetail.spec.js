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
      .state("main", { url: "", abstract: true });
  }));
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

  describe("Routes", () => {
    let groupData = {
      id: 1
    };
    let storeData = {
      id: 25,
      group: groupData.id
    };

    it("should load store and group information", () => {
      inject((CurrentGroup, GroupService, Store, $q, CurrentStores) => {
        // We don't want the side effects of the "group" state, which sets the current group
        // It would be better to stub the whole "group" state, but I don't know how
        sinon.stub(CurrentGroup, "set").returns($q.resolve(groupData));
        sinon.stub(GroupService, "get").returns($q.resolve(groupData));
        sinon.stub(Store, "get").returns($q.resolve(storeData));
        expect(
          $state.go("group.store", { storeId: storeData.id, groupId: groupData.id })
        ).to.eventually.be.fulfilled;
        inject(($rootScope) => $rootScope.$apply());
        expect($state.current.component).to.equal("storePickups");
        expect(CurrentGroup.set).to.have.been.calledWith(groupData);
        expect(GroupService.get).to.have.been.calledWith(groupData.id);
        expect(Store.get).to.have.been.calledWith(storeData.id);
        expect(CurrentStores.selected).to.deep.equal(storeData);
      });

    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $httpBackend.expectGET("/api/stores/").respond([]);
      $compile("<store-detail></store-detail>")(scope);
      $httpBackend.flush();
    });
  });
});
