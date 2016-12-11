import markdown from "markdown-it";
import markdownLinkAttributes from "markdown-it-link-attributes";
const md = markdown({
  xhtmlOut: true,
  breaks: true,
  linkify: true
});
md.use(markdownLinkAttributes, {
  target: "_blank",
  rel: "noopener nofollow noreferrer"
});

export default class ExpandablePanelController {
  constructor() {
    "ngInject";
    Object.assign(this, {
      collapsed: false,
      parsed: ""
    });
  }
  $onChanges(changes) {
    if (changes.content && changes.content.currentValue) {
      let content = changes.content.currentValue;
      // more then 10 lines?
      let lines = content.match(/\n/mg);
      if (lines && lines.length > 9) {
        this.collapsed = true;
      }

      if (this.markdown) {
        this.parsed = md.render(content);
      }
    }
  }
}
