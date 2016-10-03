import PickupDateCom from './pickupDate.service';
import PickupDate from './pickupDate.wrapper';

let pickupDateModule = angular.module('PickupDate', [])

.service('PickupDateCommunication', PickupDateCom)

.service('PickupDate', PickupDate)

.name;

export default pickupDateModule;
