let AppXEditableConfig = (editableOptions, editableThemes) => {
  "ngInject";
  editableThemes.custom = {
    formTpl: "<form class='editable-wrap'></form>",
    noformTpl: "<span class='editable-wrap'></span>",
    controlsTpl: "<span class='editable-controls' layout='row'></span>",
    inputTpl: "",
    errorTpl: "<div class='editable-error' data-ng-if='$error' data-ng-bind='$error'></div>",
    buttonsTpl: "<span class='editable-buttons'></span>",
    submitTpl: "<md-button type='submit' class='md-raised md-accent'><span></span></md-button>",
    cancelTpl: "<md-button type='button' class='md-raised' ng-click='$form.$cancel()'><span></span></md-button>",
    resetTpl: "<md-button type='reset' class='md-raised'><span></span></md-button>"
  };
  editableOptions.theme = "custom";
  editableOptions.icon_set = "font-awesome"; // eslint-disable-line
};

export default AppXEditableConfig;
