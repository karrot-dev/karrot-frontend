import UserModule from "./user";

describe("user service", () => {
  beforeEach(window.module(UserModule));
  let $httpBackend, User;

  let userData = [{
    "id": 1,
    "display_name": "Mr T",
    "first_name": "tilmann",
    "last_name": "becker",
    "email": "til@man.com",
    "address": null,
    "latitude": null,
    "longitude": null
  }];

  let userCreateData = [{
    "display_name": "Mr T",
    "first_name": "tilmann",
    "last_name": "becker",
    "email": "til@man.com",
    "password": "abc"
  }];

  let userModifyData = {
    "last_name": "becker"
  };

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    User = $injector.get("User");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("lists users", () => {
    $httpBackend.expectGET("/api/users/").respond(userData);
    User.users().then((data) => {
      expect(data).to.deep.equal(userData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("creates user", () => {
    $httpBackend.expectPOST("/api/users/", userCreateData).respond(userData);
    User.create(userCreateData).then((data) => {
      expect(data).to.deep.equal(userData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("get user details", () => {
    $httpBackend.expectGET("/api/users/1/").respond(userData);
    User.get(1).then((data) => {
      expect(data).to.deep.equal(userData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("save user details", () => {
    $httpBackend.expectPATCH("/api/users/1/", userModifyData).respond(userData);
    User.save(1, userModifyData).then((data) => {
      expect(data).to.deep.equal(userData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("delete user", () => {
    $httpBackend.expectDELETE("/api/users/1/").respond(200);
    User.delete(1).then(() => {
      assert(true);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });
});
