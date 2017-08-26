import ScreenSizeModule from "./screenSize";

const { module } = angular.mock;

describe("screenSize", () => {
  let $log, ScreenSize, $window;
  beforeEach(() => {
    module(ScreenSizeModule);
    inject(($injector) => {
      $log = $injector.get("$log");
      $log.reset();
      ScreenSize = $injector.get("ScreenSize");
      $window = $injector.get("$window");
    });
  });
  afterEach(() => {
    $log.assertEmpty();
  });

  it("evaluates whether a screen is medium or larger", () => {
    expect(ScreenSize.isGtSm()).to.equal($window.innerWidth >= 960);
  });

});
