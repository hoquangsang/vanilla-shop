import type { CartModel } from "../models/cart-model";
import type { AddToCartView } from "../views/add-to-cart-view";
import type { CartBadgeView } from "../views/cart-badge-view";

export class CartController {
  constructor(
    private readonly model: CartModel,
    private readonly badge: Pick<CartBadgeView, "render" | "announce">,
    private readonly buttons: Pick<AddToCartView, "bindAdd" | "showAdded">,
  ) {}

  init(): void {
    this.badge.render(this.model.count);
    this.model.on("change", (state) => {
      this.badge.render(state.count);
      this.badge.announce(state.count);
    });
    this.buttons.bindAdd((id, button) => {
      this.model.add(id);
      this.buttons.showAdded(button);
    });
  }
}
