/** Marks the nav link of the current page (`<body data-page>` ↔ `[data-nav]`) with `aria-current="page"`. */
export class ActiveNavView {
  constructor(root: ParentNode = document) {
    const page = document.body.dataset.page;
    if (!page) return;
    for (const link of root.querySelectorAll<HTMLElement>("[data-nav]")) {
      if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }
}
