import ChatFloaterModule from "./chatFloater";

const { module } = angular.mock;

describe("ChatFloater", () => {
  beforeEach(module(ChatFloaterModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named chatFloater", () => {
      expect(ChatFloaterModule).to.equal("chatFloater");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("chatFloater", {});
      expect($ctrl).to.exist;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<chat-floater></chat-floater>")(scope);
    });
  });
});
