class MarkdownInputController {
  constructor() {
    "ngInject";
    Object.assign(this, {
      isPreview: false
    });
  }

  $onInit(){
    let options = {
      showSubmit: false
    };
    this.options = angular.extend(options, this.options);
  }

  togglePreview(){
    this.isPreview = !this.isPreview;
  }

  submit() {
    let locals = { data: this.model };
    return this.onSubmit(locals);
  }
}

export default MarkdownInputController;
