import angular from "angular";
import Authentication from "./authentication/authentication";
import Group from "./group/group";
import PickupDate from "./pickupDate/pickupDate";
import Store from "./store/store";
import User from "./user/user";
import Conversation from "./conversation/conversation";

let serviceModule = angular.module("app.services", [
  Authentication,
  Group,
  PickupDate,
  Store,
  User,
  Conversation
])

.name;

export default serviceModule;
