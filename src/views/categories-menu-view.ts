import { DisclosureView } from "./disclosure-view";

export interface CategoriesMenuOptions {
  /** True when the list must stay open (Home at `lg` and up): no Escape / outside-click close. */
  pinnedOpen: () => boolean;
  /** Query whose `change` event re-evaluates `pinnedOpen`. */
  media?: MediaQueryList;
}

/** Categories button and list: a dropdown, or pinned open as a sidebar on Home ≥ lg. */
export class CategoriesMenuView {
  private readonly pinnedOpen: () => boolean;
  private readonly media: MediaQueryList | undefined;
  private readonly disclosure: DisclosureView;

  constructor(toggle: HTMLElement, menu: HTMLElement, options: CategoriesMenuOptions) {
    this.pinnedOpen = options.pinnedOpen;
    this.media = options.media;
    this.disclosure = new DisclosureView(toggle, menu, {
      dismissable: () => !this.pinnedOpen(),
    });
    this.applyViewport();
    this.media?.addEventListener("change", this.applyViewport);
  }

  get isOpen(): boolean {
    return this.disclosure.isOpen;
  }

  destroy(): void {
    this.media?.removeEventListener("change", this.applyViewport);
    this.disclosure.destroy();
  }

  private readonly applyViewport = (): void => {
    if (this.pinnedOpen()) this.disclosure.open();
    else this.disclosure.close();
  };
}
