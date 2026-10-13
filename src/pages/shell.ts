import { requireEl } from "../core/dom";
import { ActiveNavView } from "../views/active-nav-view";
import { CategoriesMenuView } from "../views/categories-menu-view";
import { DropdownView } from "../views/dropdown-view";
import { NavMenuView } from "../views/nav-menu-view";

const DESKTOP = "(min-width: 1024px)";

/** Wires the shared header (hamburger, Categories, dropdowns, current link). Called by every page. */
export function initShell(): void {
  const desktop = window.matchMedia(DESKTOP);

  new ActiveNavView(document);
  // Dropdowns first: they sit inside the other menus and must handle Escape before them.
  for (const group of document.querySelectorAll<HTMLElement>("[data-dropdown]")) {
    new DropdownView(
      requireEl("[data-dropdown-toggle]", group),
      requireEl("[data-dropdown-menu]", group),
    );
  }
  new NavMenuView(requireEl("[data-nav-toggle]"), requireEl("[data-nav-menu]"), desktop);
  new CategoriesMenuView(
    requireEl("[data-categories-toggle]"),
    requireEl("[data-categories-menu]"),
    {
      pinnedOpen: () => document.body.dataset.page === "home" && desktop.matches,
      media: desktop,
    },
  );
}
