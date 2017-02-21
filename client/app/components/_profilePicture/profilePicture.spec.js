import ProfilePictureModule from "./profilePicture";

const { module } = angular.mock;

describe("ProfilePicture", () => {
  beforeEach(module(ProfilePictureModule));

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

    it("should exist", () => {
      let $ctrl = $componentController("profilePicture", {});
      expect($ctrl).to.exist;
    });
  });
});
