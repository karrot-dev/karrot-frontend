//import PickupListItemModule from './pickupListItem'
import PickupListItemController from './pickupListItem.controller';
import PickupListItemComponent from './pickupListItem.component';
import PickupListItemTemplate from './pickupListItem.html';

describe('PickupListItem', () => {

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
  });

  describe('Template', () => {
    // template specs
  });

  describe('Component', () => {
      // component/directive specs
      let component = PickupListItemComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(PickupListItemTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(PickupListItemController);
      });
  });
});
