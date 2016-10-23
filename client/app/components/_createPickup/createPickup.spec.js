import CreatePickupModule from "./createPickup";
import CreatePickupController from "./createPickup.controller";
import CreatePickupComponent from "./createPickup.component";
import CreatePickupTemplate from "./createPickup.html";
import PickupDate from "../../common/pickupDate/pickupDate";

const { module } = angular.mock;

describe("CreatePickup", () => {
  let $rootScope, $componentController, $httpBackend;
  
  beforeEach(module(CreatePickupModule));
  beforeEach(module(PickupDate));

  beforeEach(() => {
    angular.mock.module(($provide) => {
      $provide.value("$mdDialog", {
        hide: () => {}
      });
    });
  });

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $rootScope = $injector.get("$rootScope");
    $componentController = $injector.get("$componentController");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
    it("is named createPickup", () => {
      expect(CreatePickupModule).to.equal("createPickup");
    });
  });

  describe("Controller", () => {
    let controller;

    beforeEach(() => {
      controller = $componentController("createPickup", {
        $scope: $rootScope.$new()
      }, {
        storeId: 2,
        pickuplistCtrl: {
          updatePickups: () => {}
        }
      }); 
    });
    
    it("test pickup creation", () => {
      controller.pickupData = {
        date: "07/14/2016",
        time: {
          getHours: () => {return 15;},
          getMinutes: () => {return 22;}
        },
        maxCollectors: 5
      };
      controller.createPickup();

      $httpBackend.expect('POST', '/api/pickup-dates/', {max_collectors: 5, date: "2016-07-14T13:22:00.000Z", store: 2})
        .respond(201, 'success');
      $httpBackend.flush();
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
