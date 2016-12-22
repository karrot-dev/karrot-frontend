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

  let $log, $httpBackend, $state, Geocoding, $q, $rootScope;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
    Geocoding = $injector.get("Geocoding");
    sinon.stub(Geocoding, "lookupAddress");
    $httpBackend = $injector.get("$httpBackend");
    $state = $injector.get("$state");
    $q = $injector.get("$q");
    $rootScope = $injector.get("$rootScope");
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

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should save storedata", () => {
      let storeEdit = { id: 667, name: "blarb" };
      let $ctrl = $componentController("storeDetail", {}, { storeEdit });
      let feedback = $ctrl.updateStoredata();
      $httpBackend.expectPATCH(`/api/stores/${storeEdit.id}/`, storeEdit).respond(storeEdit);
      $httpBackend.flush();
      expect(feedback).to.eventually.deep.equal(storeEdit);
      expect($ctrl.storedata).to.deep.equal(storeEdit);
    });

    it("looks up address", () => {
      Geocoding.lookupAddress.returns($q((resolve) => {
        resolve({ latitude: 1.99, longitude: 2.99, name: "blubb" });
      }));
      let $ctrl = $componentController("storeDetail", {});
      $ctrl.storeEdit = { address: "blubb_query" };
      $ctrl.addressLookup();
      expect($ctrl.lookupOngoing).to.be.true;
      $rootScope.$apply();
      expect($ctrl.lookupOngoing).to.be.false;
      expect(Geocoding.lookupAddress).to.have.been.calledWith("blubb_query");
      expect($ctrl.storeEdit.latitude).to.equal(1.99);
      expect($ctrl.storeEdit.longitude).to.equal(2.99);
      expect($ctrl.storeEdit.address).to.equal("blubb");
    });

    it("fails to look up address", () => {
      Geocoding.lookupAddress.returns($q((resolve, reject) => {
        reject();
      }));
      let $ctrl = $componentController("storeDetail", {});
      $ctrl.storeEdit = { address: "blubb_query" };
      $ctrl.addressLookup();
      expect($ctrl.lookupOngoing).to.be.true;
      $rootScope.$apply();
      expect($ctrl.lookupOngoing).to.be.false;
    });

    it("onChanges sets storeEdit and mapData", () => {
      let storeData = { id: 986, group: 5, description: "abc" };
      let $ctrl = $componentController("storeDetail", {}, {});
      $ctrl.$onChanges({ storedata: { currentValue: storeData } });
      expect($ctrl.storeEdit).to.deep.equal(storeData);
      expect($ctrl.mapData).to.deep.equal(storeData);
    });

    it("resets mapData", () => {
      let storeData = { id: 986, group: 5, description: "abc" };
      let storeEdit = Object.assign(angular.copy(storeData), { description: "999" });
      let $cancel = sinon.spy();
      let $scope = { editableStore: { $cancel } };
      let $ctrl = $componentController("storeDetail", { $scope }, { storedata: storeData });
      $ctrl.mapData = storeEdit;
      $ctrl.reset();
      expect($ctrl.mapData).to.deep.equal(storeData);
      expect($cancel).to.have.been.called;
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
          expect($state.current.views["mainView@group"].component).to.equal("storeDetail");
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
