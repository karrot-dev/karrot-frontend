import GroupMenuModule from "./groupMenu";

const { module } = angular.mock;

describe("GroupMenu", () => {
  beforeEach(module(GroupMenuModule));

  describe("Module", () => {
    it("is named groupMenu", () => {
      expect(GroupMenuModule).to.equal("groupMenu");
    });
  });

  describe("Controller", () => {
    let $componentController, $mdDialog, $state, $q, $rootScope;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $mdDialog = $injector.get("$mdDialog");
      $state = $injector.get("$state");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
      sinon.stub($mdDialog, "show");
      sinon.stub($state, "go");
    }));

    it("opens join group dialog", () => {
      let $ctrl = $componentController("groupMenu", {});
      $mdDialog.show.returns($q((resolve) => {
        resolve(1337);
      }));
      $ctrl.openJoinGroupDialog();
      $rootScope.$apply();
      expect($state.go).to.have.been.calledWith( "groupDetail", { id: 1337 } );
    });
  });
});
