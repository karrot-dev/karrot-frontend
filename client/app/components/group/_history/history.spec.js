import HistoryModule from "./history";

const { module } = angular.mock;

describe("History", () => {
  beforeEach(module(HistoryModule));
  beforeEach(module({ translateFilter: (a) => a }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named history", () => {
      expect(HistoryModule).to.equal("history");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("builds translate key", () => {
      let $ctrl = $componentController("history", {});
      expect($ctrl.getTranslateKey({ typus: "GROUP_JOIN" })).to.deep.equal("HISTORY.GROUP_JOIN");
    });

    it("retrieves store name", () => {
      let $ctrl = $componentController("history", {});
      $ctrl.CurrentStores.set([{
        id: 5,
        name: "Joe's Store"
      }]);
      expect($ctrl.getTranslateValues({ store: 5 })).to.deep.equal({
        "store_name": "Joe's Store",
        name: "Joe's Store"
      });
    });


    it("checks if date header should be shown", () => {
      let $ctrl = $componentController("history", {});
      expect($ctrl.showDateHeaderBefore(0, [])).to.be.true;
      expect($ctrl.showDateHeaderBefore(1, [
        { date: new Date("2017-05-10T11:42:33+00:00") },
        { date: new Date("2017-05-11T11:42:33+00:00") }
      ])).to.be.true;
      expect($ctrl.showDateHeaderBefore(1, [
        { date: new Date("2017-05-11T12:42:33+00:00") },
        { date: new Date("2017-05-11T11:42:33+00:00") }
      ])).to.be.false;
    });

    it("checks if there is more data", () => {
      let $ctrl = $componentController("history", {}, { data: {} });
      $ctrl.data.next = undefined;
      expect($ctrl.hasMore()).to.be.false;
      $ctrl.data.next = () => {};
      expect($ctrl.hasMore()).to.be.true;
    });

    it("loads more data", () => {
      let $ctrl = $componentController("history", {}, { data: {
        next: sinon.stub(),
        results: []
      } });
      inject(($q, $rootScope) => {
        $ctrl.data.next.returns($q.resolve({
          next: sinon.stub(),
          results: [{ id: 5 }]
        }));
        // $ctrl.data.next gets replaced
        let stub = $ctrl.data.next;
        $ctrl.loadMore();
        $rootScope.$apply();
        expect(stub).to.have.been.called;
        expect($ctrl.data.results).to.deep.equal([{ id: 5 }]);
        expect($ctrl.data.next).to.be.defined;

        $ctrl.data.next.returns($q.resolve({
          next: undefined,
          results: [{ id: 6 }]
        }));
        stub = $ctrl.data.next;
        $ctrl.loadMore();
        $rootScope.$apply();
        expect(stub).to.have.been.called;
        expect($ctrl.data.results).to.deep.equal([{ id: 5 }, { id: 6 }]);
        expect($ctrl.data.next).to.be.undefined;
      });
    });

    it("loads stores", () => {
      let $ctrl = $componentController("history", {}, { data: {
        results: [{ store: 5 }]
      } });
      $ctrl.CurrentStores.set([{ id: 5 }]);
      expect($ctrl.getStores()).to.deep.equal([{ id: 5 }]);
    });

    it("loads users", () => {
      let $ctrl = $componentController("history", {}, { data: {
        results: [{ users: [66] }]
      } });
      $ctrl.CurrentUsers.set([{ id: 66 }]);
      expect($ctrl.getUsers()).to.deep.equal([{ id: 66 }]);
    });

    it("filters users", () => {
      let $ctrl = $componentController("history", {}, { data: {
        results: [{ users: [66] }]
      } });
      $ctrl.CurrentUsers.set([{ id: 66, "display_name": "Lars" }]);
      $ctrl.userQuery = "la";
      expect($ctrl.getUsers()).to.deep.equal([{ id: 66, "display_name": "Lars" }]);

      $ctrl.userQuery = "Bla";
      expect($ctrl.getUsers()).to.deep.equal([]);
    });

    it("returns undefined as true", () => {
      let $ctrl = $componentController("history", {});
      expect($ctrl._undefinedAsTrue(undefined)).to.be.true;
      expect($ctrl._undefinedAsTrue(true)).to.be.true;
      expect($ctrl._undefinedAsTrue(false)).to.be.false;
      expect($ctrl._undefinedAsTrue(null)).to.be.false;
    });

    it("shows all/no stores", () => {
      let $ctrl = $componentController("history", {});
      $ctrl.CurrentStores.set([{ id: 5 }]);
      $ctrl.showAllStores(true);
      expect($ctrl.selectedStores(5)()).to.be.true;

      $ctrl.showAllStores(false);
      expect($ctrl.selectedStores(5)()).to.be.false;
    });

    it("shows all/no users", () => {
      let $ctrl = $componentController("history", {});
      $ctrl.CurrentUsers.set([{ id: 66 }]);
      $ctrl.showAllUsers(true);
      expect($ctrl.selectedUsers(66)()).to.be.true;

      $ctrl.showAllUsers(false);
      expect($ctrl.selectedUsers(66)()).to.be.false;
    });

    describe("it gets and filters history", () => {
      let $ctrl;
      beforeEach(() => {
        $ctrl = $componentController("history", {}, { data: {
          results: [{ id: 1, store: 5, users: [66], typus: "GROUP_JOIN" }]
        } });
        $ctrl.CurrentStores.set([{ id: 5 }]);
        $ctrl.CurrentUsers.set([{ id: 66 }]);
      });

      it("shows all history", () => {
        expect($ctrl._showItemByStore($ctrl.data.results[0])).to.be.true;
        expect($ctrl._showItemByUser($ctrl.data.results[0])).to.be.true;
        expect($ctrl._showItemByType($ctrl.data.results[0])).to.be.true;
        expect($ctrl.getHistoryItems()).to.deep.equal([{ id: 1, store: 5, users: [66], typus: "GROUP_JOIN" }]);
      });

      it("filters by store", () => {
        $ctrl.selectedStores(5)(false);
        expect($ctrl.getHistoryItems()).to.deep.equal([]);
      });

      it("filters by user", () => {
        $ctrl.selectedUsers(66)(false);
        expect($ctrl.getHistoryItems()).to.deep.equal([]);
      });

      it("filters by typus", () => {
        $ctrl.types.groups = false;
        expect($ctrl.getHistoryItems()).to.deep.equal([]);
      });
    });

    it("shows empty pickups", () => {
      let $ctrl = $componentController("history", {}, { data: {
        results: [{ id: 1, store: 5, users: [], typus: "PICKUP_DONE" }]
      } });
      $ctrl.CurrentStores.set([{ id: 5 }]);
      expect($ctrl.getHistoryItems()).to.deep.equal([{ id: 1, store: 5, users: [], typus: "PICKUP_DONE" }]);
    });

    it("gets payload status", () => {
      let $ctrl = $componentController("history", {});
      expect($ctrl.hasPayload({ payload: {} })).to.be.false;
      expect($ctrl.hasPayload({ payload: null })).to.be.false;
      expect($ctrl.hasPayload({})).to.be.false;
      expect($ctrl.hasPayload({ payload: { some: "value" } })).to.be.true;
    });

    it("opens history detail dialog", () => {
      let $ctrl = $componentController("history", {});
      inject(($q, $rootScope) => {
        sinon.stub($ctrl.$mdDialog, "show");
        $ctrl.$mdDialog.show.returns($q.resolve());
        $ctrl.openHistoryDetail();
        $rootScope.$apply();
      });
      expect($ctrl.$mdDialog.show).to.have.been.called;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<history></history>")(scope);
    });
  });
});
