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
    let $componentController, $q, $rootScope, User;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
      User = $injector.get("User");
      sinon.stub(User, "get");
    }));

    it("loads username", () => {
      let $ctrl = $componentController("profilePicture", {}, { userId: 42 });
      User.get.withArgs(42).returns($q.resolve({ "display_name": "lovely unicorn" }));
      $ctrl.$onInit();
      $rootScope.$apply();
      expect($ctrl.name).to.equal("lovely unicorn");
    });

    it("invalid user", () => {
      let $ctrl = $componentController("profilePicture", {}, { userId: 666 });
      User.get.withArgs(666).returns($q.reject());
      $ctrl.$translate.returns($q.resolve("translated string"));
      $ctrl.$onInit();
      $rootScope.$apply();
      expect($ctrl.name).to.equal("translated string");
    });

  });
});
