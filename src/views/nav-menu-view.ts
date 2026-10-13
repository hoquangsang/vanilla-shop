import { DisclosureView } from "./disclosure-view";

/** Hamburger menu: toggles the main nav below `lg`; on `lg` the nav is always shown inline. */
export class NavMenuView {
  private readonly toggleEl: HTMLElement;
  private readonly menu: HTMLElement;
  private readonly desktop: MediaQueryList;
  private readonly disclosure: DisclosureView;

  constructor(toggle: HTMLElement, menu: HTMLElement, desktop: MediaQueryList) {
    this.toggleEl = toggle;
    this.menu = menu;
    this.desktop = desktop;
    this.disclosure = new DisclosureView(toggle, menu, { dismissable: () => !desktop.matches });
    this.applyViewport();
    desktop.addEventListener("change", this.applyViewport);
  }

  get isOpen(): boolean {
    return this.disclosure.isOpen;
  }

  destroy(): void {
    this.desktop.removeEventListener("change", this.applyViewport);
    this.disclosure.destroy();
  }

  private readonly applyViewport = (): void => {
    // Desktop: visible inline, not a disclosure. Mobile: start closed.
    this.menu.hidden = !this.desktop.matches;
    this.disclosure.sync();
    // On desktop the nav is always visible, so the (hidden) hamburger reports "collapsed".
    if (this.desktop.matches) this.toggleEl.setAttribute("aria-expanded", "false");
  };
}
