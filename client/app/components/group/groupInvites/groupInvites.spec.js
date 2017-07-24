import GroupInvitesModule from "./groupInvites";

const { module } = angular.mock;

describe("GroupInvites", () => {
  beforeEach(module(GroupInvitesModule));
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
    it("is named groupInvites", () => {
      expect(GroupInvitesModule).to.equal("groupInvites");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("sends invite and adds result to list", () => {
      inject(($q, $rootScope) => {
        let inviteResult = {
          id: 234,
          email: "invite@me.com",
          group: 5
        };
        let $ctrl = $componentController("groupInvites", {});
        $ctrl.email = "invite@me.com";
        $ctrl.$stateParams.groupId = 5;
        sinon.stub($ctrl.Invitation, "create").returns($q.resolve(inviteResult));
        expect($ctrl.sendInvite()).to.eventually.be.fulfilled;
        $rootScope.$apply();
        expect($ctrl.Invitation.create).to.have.been.called;
        expect($ctrl.groupInvitations).to.deep.equal([inviteResult]);
      });
    });

    it("sets error message", () => {
      inject(($q, $rootScope) => {
        let $ctrl = $componentController("groupInvites", {});
        $ctrl.email = "invite@me.com";
        $ctrl.$stateParams.groupId = 5;
        sinon.stub($ctrl.Invitation, "create").returns($q.reject("err_uargh"));
        expect($ctrl.sendInvite()).to.eventually.be.rejected;
        $rootScope.$apply();
        expect($ctrl.groupInvitations).to.deep.equal([]);
        expect($ctrl.error).to.equal("err_uargh");
      });
    });

    it("checks if email has been invited", () => {
      let $ctrl = $componentController("groupInvites", {});
      expect($ctrl.isEMailNotInvitedYet("bla@bla.com")).to.be.true;

      $ctrl.groupInvitations.push({ email: "bla@bla.com" });
      expect($ctrl.isEMailNotInvitedYet("bla@bla.com")).to.be.false;
    });

    it("does at least not fail on onInit", () => {
      let $ctrl = $componentController("groupInvites", {});
      $ctrl.$onInit();
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector, $state) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
      $state.go("parent.child");
      $rootScope.$apply();
    }));

    it("compiles component", () => {
      $compile("<group-invites></group-invites>")(scope);
    });
  });
});
