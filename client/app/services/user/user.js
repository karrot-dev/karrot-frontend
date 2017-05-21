import User from "./user.service";
import CurrentUsers from "./currentUsers.service";

let userModule = angular.module("User", [])

.service("User", User)

.service("CurrentUsers", CurrentUsers)

.name;

export default userModule;
