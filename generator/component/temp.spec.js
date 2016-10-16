import <%= upCaseName %>Module from './<%= name %>'
import <%= upCaseName %>Controller from './<%= name %>.controller';
import <%= upCaseName %>Component from './<%= name %>.component';
import <%= upCaseName %>Template from './<%= name %>.html';

const { module } = angular.mock;

describe('<%= upCaseName %>', () => {
  beforeEach(module(<%= upCaseName %>Module));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let ctrl = $componentController('<%= name %>', {});
      expect(ctrl).to.exist;
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(<%= upCaseName %>Template).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = <%= upCaseName %>Component;

      it('includes the intended template',() => {
        expect(component.template).to.equal(<%= upCaseName %>Template);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(<%= upCaseName %>Controller);
      });
  });
});
