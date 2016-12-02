let AppXEditableConfig = (editableOptions, editableThemes) => {
  "ngInject";
  editableThemes.custom = {
    formTpl: "<form class='editable-wrap'></form>",
    noformTpl: "<span class='editable-wrap'></span>",
    controlsTpl: "<md-input-container class='editable-controls' ng-class='{\"md-input-invalid\": $error}'>" +
                 "</md-input-container>",
    inputTpl: "",
    errorTpl: "<div ng-messages='{message: $error}'>" +
              "<div class='editable-error' ng-message='message'>{{$error}}" +
              "</div></div>",
    buttonsTpl: "<span class='editable-buttons'></span>",
    submitTpl: "<md-button type='submit' class='md-primary'><span></span></md-button>",
    cancelTpl: "<md-button type='button' class='md-warn' ng-click='$form.$cancel()'><span></span></md-button>",
    resetTpl: "<md-button type='reset' class='md-raised'><span></span></md-button>"
  };
  editableOptions.theme = "custom";
  editableOptions.icon_set = "font-awesome"; // eslint-disable-line
};

export default AppXEditableConfig;
