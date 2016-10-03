import StoreCom from './store.service';
import Store from './store.wrapper';

let storeModule = angular.module('Store', [])

.service('StoreCommunication', StoreCom)

.service('Store', Store)

.name;

export default storeModule;
