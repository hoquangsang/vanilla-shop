const MAX_DISPLAY = 99;

function itemsLabel(count: number): string {
  return `${count} ${count === 1 ? "item" : "items"}`;
}

export class CartBadgeView {
  private readonly liveRegion: HTMLElement;

  constructor(private readonly root: ParentNode = document) {
    // Created up front so screen readers already watch it when the first update lands.
    this.liveRegion = document.createElement("div");
    this.liveRegion.className = "sr-only";
    this.liveRegion.setAttribute("role", "status");
    this.liveRegion.setAttribute("aria-live", "polite");
    document.body.append(this.liveRegion);
  }

  render(count: number): void {
    const text = count > MAX_DISPLAY ? `${MAX_DISPLAY}+` : String(count);
    for (const el of this.root.querySelectorAll("[data-cart-count]")) el.textContent = text;
    for (const link of this.root.querySelectorAll("[data-cart-link]")) {
      link.setAttribute("aria-label", `Cart, ${itemsLabel(count)}`);
    }
  }

  announce(count: number): void {
    this.liveRegion.textContent = `Cart updated: ${itemsLabel(count)}`;
  }
}
