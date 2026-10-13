import { DisclosureView } from "./disclosure-view";

/** Click-to-open dropdown ("Pages", "Dresses"): closes on outside click and Escape. */
export class DropdownView {
  private readonly disclosure: DisclosureView;

  constructor(toggle: HTMLElement, menu: HTMLElement) {
    this.disclosure = new DisclosureView(toggle, menu);
  }

  get isOpen(): boolean {
    return this.disclosure.isOpen;
  }

  destroy(): void {
    this.disclosure.destroy();
  }
}
