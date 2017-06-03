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
    inject(($q, $rootScope) => {
      let spy = sinon.spy();
      SessionUser.loaded.then(spy);
      $rootScope.$apply();
      expect(spy).to.not.have.been.called;
    });
  });

  it("can be set", () => {
    let user = {
      id: 1,
      anything: "can",
      go: "here",
      including: ["lists", "of", "stuff"]
    };
    inject(($q, $rootScope) => {
      let spy = sinon.spy();
      SessionUser.loaded.then(spy);
      SessionUser.set(user);
      $rootScope.$apply();
      expect(SessionUser.value).to.deep.equal(user);
      expect(spy).to.have.been.calledWith(user);
    });
  });

  it("can be cleared", () => {
    SessionUser.set({ some: "data" });
    SessionUser.clear();
    expect(SessionUser.value).to.deep.equal({});
  });

  it("keeps data reference through promise callback", () => {
    // ensures that you can bind the value from `then` and
    // it keeps updated on subsequent calls to `set` and `clear`
    inject(($q, $rootScope) => {
      let data = {};
      SessionUser.loaded.then((d) => data = d);
      SessionUser.set({ id: 5 });
      $rootScope.$apply();
      SessionUser.set({ id: 6 });
      expect(data.id).to.equal(6);
    });
  });

  it("returns login status", () => {
    expect(SessionUser.isLoggedIn()).to.be.false;
    SessionUser.value = { id: 5 };
    expect(SessionUser.isLoggedIn()).to.be.true;
  });

});
