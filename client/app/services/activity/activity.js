import Activity from "./activity.service";

let activityModule = angular.module("Activity", [])

.service("ActivityService", Activity)

.name;

export default activityModule;
