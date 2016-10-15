import LoginModule from "./login";
import LoginController from "./login.controller";
import LoginComponent from "./login.component";
import LoginTemplate from "./login.html";

describe("Login", () => {

  beforeEach(window.module(LoginModule));
  beforeEach(inject((/*$injector*/) => {
  }));

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe("Controller", () => {
    // controller specs
  });

  describe("Template", () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
  });

  describe("Component", () => {
      // component/directive specs
    let component = LoginComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(LoginTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(LoginController);
    });
  });
});
