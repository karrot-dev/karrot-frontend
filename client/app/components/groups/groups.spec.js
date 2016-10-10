//import GroupsModule from './groups'
import GroupsController from "./groups.controller";
import GroupsComponent from "./groups.component";
import GroupsTemplate from "./groups.html";

describe("Groups", () => {
  /*let $rootScope, makeController;
  
  beforeEach(window.module(GroupsModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new GroupsController();
    };
  }));*/

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe("Component", () => {
      // component/directive specs
    let component = GroupsComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(GroupsTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(GroupsController);
    });
  });
});
