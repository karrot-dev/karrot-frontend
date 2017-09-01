import ngMaterial from "angular-material";
import ScreenSize from "./screenSize.service";

let screenSizeModule = angular.module("ScreenSize", [ngMaterial])

.service("ScreenSize", ScreenSize)

.name;

export default screenSizeModule;
