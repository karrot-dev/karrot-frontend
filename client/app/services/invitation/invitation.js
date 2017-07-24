import Invitation from "./invitation.service";

let invitationModule = angular.module("Invitation", [])

.service("Invitation", Invitation)

.name;

export default invitationModule;
