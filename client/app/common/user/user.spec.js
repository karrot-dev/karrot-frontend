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
    User.get().then((data) => {
      expect(data).to.deep.equal(userData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("lists filtered users", () => {
    $httpBackend.expectGET("/api/users/?email=til@man.com").respond(userData);
    User.get({ email: "til@man.com" }).then((data) => {
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

  it("gets user details", () => {
    $httpBackend.expectGET("/api/users/1/").respond(userData[0]);
    User.getById(1).then((data) => {
      expect(data).to.deep.equal(userData[0]);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("saves user details", () => {
    $httpBackend.expectPATCH("/api/users/1/", userModifyData).respond(userData[0]);
    User.save(1, userModifyData).then((data) => {
      expect(data).to.deep.equal(userData[0]);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("deletes user", () => {
    $httpBackend.expectDELETE("/api/users/1/").respond(200);
    User.delete(1).then(() => {
      assert(true);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });
});
