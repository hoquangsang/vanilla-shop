import type { ProductModel } from "../models/product-model";
import type { ProductTab } from "../types/product";
import type { ProductListView } from "../views/product-list-view";

type ListView = Pick<ProductListView, "render">;

/** Loads the products of each tab from the model and renders them in that tab's view. */
export class ProductListController {
  constructor(
    private readonly model: ProductModel,
    private readonly views: Record<ProductTab, ListView>,
  ) {}

  async init(): Promise<void> {
    const tabs = Object.keys(this.views) as ProductTab[];
    await Promise.all(
      tabs.map(async (tab) => this.views[tab].render(await this.model.getByTab(tab))),
    );
  }
}
