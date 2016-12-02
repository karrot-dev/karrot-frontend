import Geocoding from "./geocoding.service";

let geocodingModule = angular.module("Geocoding", [])

.service("Geocoding", Geocoding)

.name;

export default geocodingModule;
