const MAX_DISPLAY = 99;

function itemsLabel(count: number): string {
  return `${count} ${count === 1 ? "item" : "items"}`;
}

export class CartBadgeView {
  private liveRegion: HTMLElement | null = null;

  constructor(private readonly root: ParentNode = document) {}

  render(count: number): void {
    const text = count > MAX_DISPLAY ? `${MAX_DISPLAY}+` : String(count);
    for (const el of this.root.querySelectorAll("[data-cart-count]")) el.textContent = text;
    for (const link of this.root.querySelectorAll("[data-cart-link]")) {
      link.setAttribute("aria-label", `Cart, ${itemsLabel(count)}`);
    }
  }

  announce(count: number): void {
    this.region().textContent = `Cart updated: ${itemsLabel(count)}`;
  }

  private region(): HTMLElement {
    if (!this.liveRegion) {
      const el = document.createElement("div");
      el.className = "sr-only";
      el.setAttribute("aria-live", "polite");
      el.setAttribute("role", "status");
      document.body.append(el);
      this.liveRegion = el;
    }
    return this.liveRegion;
  }
}
