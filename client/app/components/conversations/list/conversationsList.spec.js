import ConversationsListModule from "./conversationsList";

const { module } = angular.mock;

describe("ConversationsList", () => {
  beforeEach(module(ConversationsListModule));

  describe("Module", () => {
    it("is named conversationsList", () => {
      expect(ConversationsListModule).to.equal("conversationsList");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("conversationsList", {});
      expect($ctrl).to.exist;
    });
  });
});
