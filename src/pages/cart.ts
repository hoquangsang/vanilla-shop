import { CartController } from "../controllers/cart-controller";
import { createBrowserStorage } from "../core/storage";
import { CartModel } from "../models/cart-model";
import { AddToCartView } from "../views/add-to-cart-view";
import { CartBadgeView } from "../views/cart-badge-view";

/** Cart badge + "Add to cart" buttons. Called by every page (the badge lives in the shared header). */
export function initCart(): CartController {
  const controller = new CartController(
    new CartModel(createBrowserStorage()),
    new CartBadgeView(),
    new AddToCartView(),
  );
  controller.init();
  return controller;
}
