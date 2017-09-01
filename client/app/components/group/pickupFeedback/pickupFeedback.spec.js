import PickupFeedbackModule from "./pickupFeedback";

const { module } = angular.mock;

describe("PickupFeedback", () => {
  beforeEach(module(PickupFeedbackModule));
  beforeEach(module({ translateFilter: (a) => a }));
  beforeEach(module(($stateProvider) => {
    // fake state hierarchy for ui-sref='^'
    $stateProvider
    .state("parent", { url: "/" })
    .state("parent.child", { url: "/child" });
  }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named pickupFeedback", () => {
      expect(PickupFeedbackModule).to.equal("pickupFeedback");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("images should differ less than 0.15kg", () => {
      let $ctrl = $componentController("pickupFeedback", {});
      expect($ctrl).to.exist;
      $ctrl.data.amount = 50;
      let remainingAmount = $ctrl.setFeedbackImages();
      expect(remainingAmount).to.be.below(0.15);
    });

    it("should say bagImg is higher than others", () => {
      let $ctrl = $componentController("pickupFeedback", {});
      expect($ctrl).to.exist;
      expect($ctrl.isHigherImg($ctrl.images.flour)).to.be.false;
      expect($ctrl.isHigherImg($ctrl.images.bag)).to.be.true;
    });

    it("creates feedback", inject(($q, $rootScope) => {
      let $ctrl = $componentController("pickupFeedback", {});
      sinon.stub($ctrl.Feedback, "create").returns($q.resolve({ weight: 1 }));
      $ctrl.$stateParams.pickupId = 4;

      $ctrl.create();
      expect($ctrl.status.creating).to.be.true;
      expect($ctrl.status.created).to.be.false;
      $rootScope.$apply();
      expect($ctrl.status.creating).to.be.false;
      expect($ctrl.status.created).to.be.true;
      expect($ctrl.status.returned).to.deep.equal({ weight: 1 });
      expect($ctrl.Feedback.create).to.have.been.calledWith({
        about: 4,
        weight: 1,
        comment: ""
      });
    }));

    it("fails to create feedback", inject(($q, $rootScope) => {
      let $ctrl = $componentController("pickupFeedback", {});
      sinon.stub($ctrl.Feedback, "create").returns($q.reject({ data: "error" }));
      $ctrl.create();
      expect($ctrl.status.creating).to.be.true;
      expect($ctrl.status.created).to.be.false;
      $rootScope.$apply();
      expect($ctrl.status.creating).to.be.false;
      expect($ctrl.status.created).to.be.false;
      expect($ctrl.status.error).to.equal("error");
    }));

    it("initializes with feedback and pickups", inject(($q, $rootScope) => {
      let $ctrl = $componentController("pickupFeedback", {});
      sinon.stub($ctrl.Feedback, "list").returns($q.resolve([{ id: 234 }]));
      sinon.stub($ctrl.$http, "get").returns($q.resolve({ data: [{ id: 567 }] }));

      $ctrl.$onInit();
      expect($ctrl.pickupsLoading).to.be.true;
      $rootScope.$apply();
      expect($ctrl.pickupsLoading).to.be.false;
      expect($ctrl.allFeedback).to.deep.equal([{ id: 234 }]);
      expect($ctrl.donePickups).to.deep.equal([{ id: 567 }]);
    }));

    it("gets pickups to give feedback for", () => {
      let $ctrl = $componentController("pickupFeedback", {});
      $ctrl.SessionUser.value.id = 11;
      $ctrl.donePickups = [{ id: 1, "collector_ids": [11] }];
      $ctrl.allFeedback = [];
      expect($ctrl.getAvailablePickups()).to.deep.equal([{ id: 1, "collector_ids": [11] }]);
    });

    it("gets group feedback", () => {
      let $ctrl = $componentController("pickupFeedback", {});
      $ctrl.SessionUser.value.id = 11;
      $ctrl.donePickups = [{ id: 1, "collector_ids": [11] }];
      $ctrl.allFeedback = [{ about: 1 }];
      expect($ctrl.getGroupFeedback()).to.deep.equal([{ about: 1 }]);
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<pickup-feedback></pickup-feedback>")(scope);
    });
  });
});
