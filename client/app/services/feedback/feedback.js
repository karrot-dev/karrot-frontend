import Feedback from "./feedback.service";

let feedbackModule = angular.module("Feedback", [])

.service("Feedback", Feedback)

.name;

export default feedbackModule;
