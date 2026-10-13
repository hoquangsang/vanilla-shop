const FEEDBACK_MS = 1000;
const ADDED_TEXT = "Added ✓";

export class AddToCartView {
  private readonly timers = new WeakMap<HTMLButtonElement, number>();
  private readonly labels = new WeakMap<HTMLButtonElement, string>();

  constructor(private readonly root: ParentNode = document) {}

  bindAdd(handler: (productId: string, button: HTMLButtonElement) => void): void {
    this.root.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>("[data-add-to-cart]");
      const id = button?.dataset.addToCart;
      if (button && id) handler(id, button);
    });
  }

  showAdded(button: HTMLButtonElement): void {
    const pending = this.timers.get(button);
    if (pending === undefined) this.labels.set(button, button.textContent ?? "");
    else window.clearTimeout(pending);
    button.textContent = ADDED_TEXT;
    this.timers.set(
      button,
      window.setTimeout(() => {
        button.textContent = this.labels.get(button) ?? "";
        this.timers.delete(button);
      }, FEEDBACK_MS),
    );
  }
}
