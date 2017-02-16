import PickupDate from "./pickupDate.service";
import PickupDateSeries from "./pickupDateSeries.service";

let pickupDateModule = angular.module("PickupDate", [])

.service("PickupDate", PickupDate)
.service("PickupDateSeries", PickupDateSeries)

.name;

export default pickupDateModule;
