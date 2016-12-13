import TopbarModule from "./topbar";
import TopbarController from "./topbar.controller";

const { module } = angular.mock;

describe("Topbar", () => {
  let makeController;

  beforeEach(module(TopbarModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  beforeEach(inject(() => {
    makeController = () => {
      return new TopbarController();
    };
  }));

  describe("Controller", () => {
    it("exists", () => {
      let $ctrl = makeController();
      expect($ctrl).to.exist;
    });
  });
});
