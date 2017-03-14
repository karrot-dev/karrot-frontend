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
    let $ctrl, $q, $scope;
    beforeEach(inject(($injector, _$componentController_) => {
      $q = $injector.get("$q");
      $scope = $injector.get("$rootScope").$new();
      $ctrl = _$componentController_("userDetail", { $scope });
      sinon.stub($ctrl.Authentication, "update");
      sinon.stub($ctrl.User, "save");
    }));

    it("makes page non-editable", () => {
      $ctrl.Authentication.update.returns($q((resolve) => {
        resolve({ id: 2 });
      }));
      $ctrl.$onChanges({ userdata: { currentValue: { id: 666 } } });
      expect($ctrl.editable).to.be.undefined;
      $scope.$apply();
      expect($ctrl.editable).to.be.false;
    });

    it("makes page editable", () => {
      $ctrl.Authentication.update.returns($q((resolve) => {
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
      $ctrl.editData.email = "another@mail.com";
      $ctrl.User.save.withArgs($ctrl.editData).returns($q((resolve) => {
        resolve($ctrl.editData);
      }));
      $ctrl.submitEdit();
      $scope.$apply();
      expect($ctrl.editEnabled).to.be.false;
    });

    context("password change", () => {
      let userdata = { id: 666 };

      beforeEach(() => {
        sinon.stub($ctrl.$state, "go");
        $ctrl.userdata = userdata;
        $ctrl.editEnable();
      });
      it("goes to login when password is changed", () => {
        $ctrl.isChangePassword = true;
        $ctrl.User.save.returns($q((resolve) => {
          resolve();
        }));
        $ctrl.submitEdit();
        $scope.$apply();
        expect($ctrl.$state.go).to.have.been.calledWith("login");
      });

      it("does not go to login when password is not changed", () => {
        $ctrl.isChangePassword = false;
        $ctrl.User.save.returns($q((resolve) => {
          resolve();
        }));
        $ctrl.submitEdit();
        $scope.$apply();
        expect($ctrl.$state.go).to.not.have.been.called;
      });

      it("does not go to login when request fails", () => {
        $ctrl.isChangePassword = true;
        $ctrl.User.save.returns($q((resolve, reject) => {
          reject({ data: "error" });
        }));
        $ctrl.submitEdit();
        $scope.$apply();
        expect($ctrl.$state.go).to.not.have.been.called;
      });
    });

  });
});
