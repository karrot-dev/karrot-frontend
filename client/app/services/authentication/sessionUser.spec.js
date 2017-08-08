import AuthenticationModule from "./authentication";

const { module } = angular.mock;

describe("SessionUser service", () => {
  beforeEach(module(AuthenticationModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let SessionUser;

  beforeEach(inject(($injector) => {
    SessionUser = $injector.get("SessionUser");
  }));

  it("starts with an empty empty", () => {
    expect(SessionUser.value).to.deep.equal({});
  });

  it("can be set", () => {
    let user = {
      id: 1,
      anything: "can",
      go: "here",
      including: ["lists", "of", "stuff"]
    };
    SessionUser.set(user);
    expect(SessionUser.value).to.deep.equal(user);
  });

  it("can be cleared", () => {
    SessionUser.set({ some: "data" });
    SessionUser.clear();
    expect(SessionUser.value).to.deep.equal({});
  });

  it("keeps data reference through promise callback", () => {
    // ensures that you can bind the value and
    // keeps it updated on subsequent calls to `set` and `clear`
    SessionUser.set({ id: 5 });

    let data = {};
    data = SessionUser.value;
    SessionUser.set({ id: 6 });
    expect(data.id).to.equal(6);
  });

  it("returns login status", () => {
    expect(SessionUser.isLoggedIn()).to.be.false;
    SessionUser.value = { id: 5 };
    expect(SessionUser.isLoggedIn()).to.be.true;
  });

});
