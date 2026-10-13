import { requireEl } from "../core/dom";
import { ProductListController } from "../controllers/product-list-controller";
import { ProductModel } from "../models/product-model";
import { CarouselView } from "../views/carousel-view";
import { ProductListView } from "../views/product-list-view";
import { TabsView } from "../views/tabs-view";

/** Hero carousel + "Most Popular Products" (tabs and product carousels). */
export function initHomeShowcase(): void {
  new CarouselView(requireEl('[data-carousel="hero"]'), { loop: true, autoplayMs: 5000 });

  const lists = {
    description: new ProductListView(requireEl('[data-product-list="description"]')),
    specifications: new ProductListView(requireEl('[data-product-list="specifications"]')),
  };
  new TabsView(requireEl("[data-tabs]"), (tabId) => {
    const tab = tabId.replace("tab-", "") as keyof typeof lists;
    lists[tab]?.update();
  });

  void new ProductListController(new ProductModel(), lists).init();
}
