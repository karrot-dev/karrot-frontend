import markdown from "markdown-it";
const md = markdown({
  xhtmlOut: true,
  breaks: true
});

export default class ExpandablePanelController {
  constructor($timeout, $sce) {
    "ngInject";
    Object.assign(this, {
      expandable: false,
      expanded: false,
      parsed: ""
    });
    $timeout( () => {

      // more then 10 lines?
      if (this.content.match(/\n/mg).length > 9) {
        this.expandable = true;
      }

      if (this.markdown) {
        this.parsed = $sce.trustAsHtml(md.render(this.content));
      }

    });
  }
  toggle() {
    this.expanded = !this.expanded;
  }
}
