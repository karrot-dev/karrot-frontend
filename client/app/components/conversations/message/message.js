import angular from "angular";
import messageComponent from "./message.component";

let messageModule = angular.module("message", [])

.component("message", messageComponent)

.name;

export default messageModule;
