import PickupDate from './pickupDate.service';

let pickupDateModule = angular.module('PickupDate', [])

.service('PickupDate', PickupDate)

.name;

export default pickupDateModule;
