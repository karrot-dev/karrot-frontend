import ProfilePictureModule from "./profilePicture";

const { module } = angular.mock;

describe("ProfilePicture", () => {
  beforeEach(module(ProfilePictureModule));
  beforeEach(module({ $translate: sinon.mock() }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named profilePicture", () => {
      expect(ProfilePictureModule).to.equal("profilePicture");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("loads user", () => {
      let $ctrl = $componentController("profilePicture", {}, { userId: 42 });
      sinon.stub($ctrl.CurrentUsers, "get");
      $ctrl.CurrentUsers.get.returns({ "display_name": "Jojo" });
      expect($ctrl.getUser()).to.deep.equal({ "display_name": "Jojo" });
      expect($ctrl.CurrentUsers.get).has.been.calledWith(42);
    });

  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<profile-picture></profile-picture>")(scope);
    });
  });
});
