class MarkdownInputController {
  constructor() {
    "ngInject";
    Object.assign(this, {
      isPreview: false
    });
  }

  togglePreview(){
    this.isPreview = !this.isPreview;
  }
}

export default MarkdownInputController;
