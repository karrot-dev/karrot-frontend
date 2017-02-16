import CreatePickupModule from "./createPickup";
import CreatePickupController from "./createPickup.controller";
import CreatePickupComponent from "./createPickup.component";
import CreatePickupTemplate from "./createPickup.html";

const { module } = angular.mock;

describe("CreatePickup", () => {
  let $componentController, $httpBackend;

  beforeEach(module(CreatePickupModule));
  beforeEach(() => {
    angular.mock.module(($provide) => {
      $provide.value("$mdDialog", {
        hide: () => {}
      });
    });
  });

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $componentController = $injector.get("$componentController");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("Module", () => {
    it("is named createPickup", () => {
      expect(CreatePickupModule).to.equal("createPickup");
    });
  });

  describe("Controller", () => {
    let $ctrl;

    beforeEach(() => {
      $ctrl = $componentController("createPickup", {
      }, {
        storeId: 2,
        pickuplistCtrl: {
          updatePickups: () => {}
        }
      });
    });

    it("creates one-time pickup", () => {
      $ctrl.isSeries = false;
      $ctrl.pickupData = {
        date: "07/14/2016",
        time: {
          getHours: () => {
            return 15;
          },
          getMinutes: () => {
            return 22;
          }
        },
        maxCollectors: 5
      };
      $ctrl.createPickup();
      let date = new Date(2016, 6, 14, 15, 22, 0);
      $httpBackend.expectPOST("/api/pickup-dates/", {
        "max_collectors": 5,
        date: date.toISOString(),
        store: 2
      }).respond(201, "success");
      $httpBackend.flush();
    });

    it("initializes", () => {
      $ctrl.$onInit();
      expect($ctrl.days[2]).to.deep.equal({ key: "WE", name: "Wednesday" });
    });

    it("creates regular pickup", () => {
      $ctrl.isSeries = true;
      $ctrl.byDay =  ["MO","TU"];
      $ctrl.pickupData = {
        time: {
          getHours: () => {
            return 15;
          },
          getMinutes: () => {
            return 22;
          }
        },
        maxCollectors: 5
      };
      $ctrl.createPickup();

      let startDate = new Date();
      startDate.setHours(15);
      startDate.setMinutes(22);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);

      $httpBackend.expectPOST("/api/pickup-date-series/", {
        "max_collectors": 5,
        "start_date": startDate.toISOString(),
        rule: "FREQ=WEEKLY;BYDAY=MO,TU",
        store: 2
      }).respond(201, "success");
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
