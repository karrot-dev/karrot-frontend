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

  let $compile, $rootScope;
  beforeEach(inject(($injector) => {
    $compile = $injector.get("$compile");
    $rootScope = $injector.get("$rootScope");
  }));

  it("loads directive without name", () => {
    let element = $compile("<random-picture seed=5 size=3></random-picture>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).to.contain("<svg");
    expect(element.html()).to.not.contain("<text");
  });

  it("loads directive with name", () => {
    $rootScope.name = "xyz";
    let element = $compile("<random-picture name='name' seed=5 size=3></random-picture>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).to.contain("<svg");
    expect(element.html()).to.contain("<text");
    expect(element.html()).to.contain("XY");
    expect(element.html()).to.not.contain("XYZ");
  });
});
