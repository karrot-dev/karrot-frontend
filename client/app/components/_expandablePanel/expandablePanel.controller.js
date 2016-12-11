import markdown from "markdown-it";
const md = markdown({
  xhtmlOut: true,
  breaks: true
});

export default class ExpandablePanelController {
  constructor($sce) {
    "ngInject";
    Object.assign(this, {
      $sce,
      expandable: false,
      expanded: false,
      parsed: ""
    });
  }
  $onChanges(changes) {
    if (changes.content && changes.content.currentValue) {
      let content = changes.content.currentValue;
      // more then 10 lines?
      if (content.match(/\n/mg).length > 9) {
        this.expandable = true;
      }

      if (this.markdown) {
        this.parsed = this.$sce.trustAsHtml(md.render(content));
      }
    }
  }
  toggle() {
    this.expanded = !this.expanded;
  }
}
