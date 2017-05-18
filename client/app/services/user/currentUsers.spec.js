import UserModule from "./user";

const { module } = angular.mock;

describe("CurrentUsers service", () => {
  beforeEach(module(UserModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let CurrentUsers;

  beforeEach(inject(($injector) => {
    CurrentUsers = $injector.get("CurrentUsers");
  }));

  it("starts with an empty list", () => {
    expect(CurrentUsers.list).to.deep.equal([]);
  });

  it("can be set", () => {
    let newList = [{ id: 5, name: "my store" }];
    CurrentUsers.set(newList);
    expect(CurrentUsers.list).to.deep.equal(newList);
  });

  it("can be cleared", () => {
    CurrentUsers.set([{ some: "data" }]);
    CurrentUsers.clear();
    expect(CurrentUsers.list).to.deep.equal([]);
  });

  it("copies properties during set", () => {
    let list = CurrentUsers.list;
    CurrentUsers.set([{ some: "data" }]);
    expect(CurrentUsers.list).to.equal(list);
  });

  it("gets user by id", () => {
    CurrentUsers.list = [{ id: 42 }];
    expect(CurrentUsers.get(42)).to.deep.equal({ id: 42 });
  });

});
