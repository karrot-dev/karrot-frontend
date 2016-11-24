import ConversationsModule from "./conversations";

const { module } = angular.mock;

describe("conversations", () => {
  let Conversations;
  beforeEach(() => {
    module(ConversationsModule);
    inject(($injector) => {
      Conversations = $injector.get("Conversations");
    });
  });

  it("exists", () => {
    expect(Conversations).to.exist;
  });

});
