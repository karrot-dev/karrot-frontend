import markdown from "markdown-it";
import markdownLinkAttributes from "markdown-it-link-attributes";

export default class ExpandablePanelController {
  constructor() {
    "ngInject";
    Object.assign(this, {
      collapsed: false,
      parsed: "",
      md: markdown({
        xhtmlOut: true,
        breaks: true,
        linkify: true
      })
    });
    this.md.use(markdownLinkAttributes, {
      target: "_blank",
      rel: "noopener nofollow noreferrer"
    });
  }
  $onChanges(changes) {
    if (changes.content && changes.content.currentValue) {
      let content = changes.content.currentValue;

      let lines = content.match(/\n/mg);
      if (this.collapse && lines && lines.length >= this.collapse) {
        this.collapsed = true;
      }

      if (this.markdown) {
        this.parsed = this.md.render(content);
      }
    }
  }
}
