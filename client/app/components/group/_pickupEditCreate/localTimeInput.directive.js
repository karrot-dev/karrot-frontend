import moment from "moment";

/*
* This is a hack for the angular time input to support localized time input formats (20:00, 8:00 PM)
* We replace the angular parser, validator and formatter with moment.js in "LT" format setting
*/

export default () => {
  "ngInject";
  return {
    restrict: "A",
    require: "ngModel",
    link: (scope, element, attrs, ngModelController) => {
      // replacing existing parser
      ngModelController.$parsers[1] = (data) => {
        //View -> Model
        let m = moment(data, "LT", true);
        return m.isValid() ? m.toDate() : undefined;
      };
      ngModelController.$validators.time = (data) => {
        let b =  moment(data, "LT", true).isValid();
        return b;
      };
      // replace existing formatter
      ngModelController.$formatters.shift();
      ngModelController.$formatters.push((data) => {
        //Model -> View
        return moment(data).format("LT");
      });
    }
  };
};
