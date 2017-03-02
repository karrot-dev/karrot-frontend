import PickupManageModule from "./pickupManage";

const { module } = angular.mock;

describe("PickupManage", () => {
  beforeEach(module(PickupManageModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named pickupManage", () => {
      expect(PickupManageModule).to.equal("pickupManage");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("runs $onInit", () => {
      let $ctrl = $componentController("pickupManage", {});
      Object.assign($ctrl, {
        series: [{
          "rule": {
            freq: "WEEKLY",
            byDay: ["WE", "TH"]
          },
          "start_date": new Date("2017-02-25T19:00:00Z")
        },
        {
          "rule": {
            freq: "WEEKLY"
          },
          "start_date": new Date("2017-02-25T19:00:00Z") // Saturday
        }],
        pickups: [{
          "date": new Date("2017-02-25T22:49:00Z")
        },{
          "date": new Date("2017-02-25T22:49:00Z"),
          "series": 5
        }]
      });
      $ctrl.$onInit();
      expect($ctrl.dayLookup.SU).to.equal(0);
      expect($ctrl.series[0].start_date.getDate()).to.equal(25);
      expect($ctrl.series[0].rule.byDay).to.deep.equal(["WE", "TH"]);
      expect($ctrl.series[1].rule.byDay).to.deep.equal(["SA"]);
      expect($ctrl.series[1].$byDayLong).to.deep.equal(["Saturday"]);
      expect($ctrl.pickups[0].series).to.be.undefined;
    });
  });
});
