export interface DisclosureOptions {
  /** Whether Escape and outside clicks may close the panel right now. Defaults to always. */
  dismissable?: () => boolean;
}

/** A toggle button that shows and hides a panel, keeping `aria-expanded` and `hidden` in sync. */
export class DisclosureView {
  private readonly toggleEl: HTMLElement;
  private readonly panel: HTMLElement;
  private readonly dismissable: () => boolean;

  constructor(toggle: HTMLElement, panel: HTMLElement, options: DisclosureOptions = {}) {
    this.toggleEl = toggle;
    this.panel = panel;
    this.dismissable = options.dismissable ?? (() => true);
    this.sync();

    toggle.addEventListener("click", this.onToggleClick);
    document.addEventListener("keydown", this.onKeydown);
    document.addEventListener("click", this.onDocumentClick);
  }

  get isOpen(): boolean {
    return !this.panel.hidden;
  }

  open(): void {
    this.panel.hidden = false;
    this.sync();
  }

  close(): void {
    this.panel.hidden = true;
    this.sync();
  }

  toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  destroy(): void {
    this.toggleEl.removeEventListener("click", this.onToggleClick);
    document.removeEventListener("keydown", this.onKeydown);
    document.removeEventListener("click", this.onDocumentClick);
  }

  /** Re-reads `hidden` into `aria-expanded`; call after changing `panel.hidden` from outside. */
  sync(): void {
    this.toggleEl.setAttribute("aria-expanded", String(this.isOpen));
  }

  private readonly onToggleClick = (): void => {
    this.toggle();
  };

  private readonly onKeydown = (event: KeyboardEvent): void => {
    // Nested panels register first, so Escape closes the innermost open one only.
    if (event.key !== "Escape" || event.defaultPrevented || !this.isOpen || !this.dismissable())
      return;
    event.preventDefault();
    this.close();
    this.toggleEl.focus();
  };

  private readonly onDocumentClick = (event: MouseEvent): void => {
    if (!this.isOpen || !this.dismissable()) return;
    const target = event.target;
    if (target instanceof Node && (this.toggleEl.contains(target) || this.panel.contains(target)))
      return;
    this.close();
  };
}
