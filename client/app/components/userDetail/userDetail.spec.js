import UserDetailModule from "./userDetail";

const { module } = angular.mock;

describe("UserDetail", () => {
  beforeEach(module(UserDetailModule));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true });
  }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named userDetail", () => {
      expect(UserDetailModule).to.equal("userDetail");
    });
  });

  describe("Config", () => {
    let $state, $httpBackend;

    beforeEach(inject(($injector) => {
      $state = $injector.get("$state");
      $httpBackend = $injector.get("$httpBackend");
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("provides state", () => {
      $httpBackend.expectGET("/api/auth/status/").respond( { id: 99 });
      $httpBackend.expectGET("/api/users/5/").respond( { id: 5 });
      $state.go("userDetail", { id: 5 });
      $httpBackend.flush();
    });
  });

  describe("Controller", () => {
    let $ctrl, Authentication, User, $q, $scope;
    beforeEach(inject(($injector, _$componentController_) => {
      Authentication = $injector.get("Authentication");
      sinon.stub(Authentication, "update");
      User = $injector.get("User");
      sinon.stub(User, "save");
      $q = $injector.get("$q");
      $scope = $injector.get("$rootScope").$new();
      $ctrl = _$componentController_("userDetail", { $scope });
    }));

    it("makes page non-editable", () => {
      Authentication.update.returns($q((resolve) => {
        resolve({ id: 2 });
      }));
      $ctrl.$onChanges({ userdata: { currentValue: { id: 666 } } });
      expect($ctrl.editable).to.be.undefined;
      $scope.$apply();
      expect($ctrl.editable).to.be.false;
    });

    it("makes page editable", () => {
      Authentication.update.returns($q((resolve) => {
        resolve({ id: 666 });
      }));
      $ctrl.$onChanges({ userdata: { currentValue: { id: 666 } } });
      expect($ctrl.editable).to.be.undefined;
      $scope.$apply();
      expect($ctrl.editable).to.be.true;
    });

    it("submits changed data", () => {
      let userdata = { id: 666, email: "l@l.de" };
      $ctrl.userdata = userdata;
      $ctrl.editEnable();
      expect($ctrl.editEnabled).to.be.true;
      expect($ctrl.saving).to.be.false;
      $ctrl.editData.email = "another@mail.com";
      User.save.withArgs($ctrl.editData).returns($q((resolve) => {
        resolve($ctrl.editData);
      }));
      $ctrl.submitEdit();
      expect($ctrl.saving).to.be.true;
      $scope.$apply();
      expect($ctrl.editEnabled).to.be.false;
      expect($ctrl.saving).to.be.false;
    });
  });
});
