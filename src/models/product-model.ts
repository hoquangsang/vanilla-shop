import catalogue from "../data/products.json";
import type { Product } from "../types/product";

const bundled = (): Promise<Product[]> => Promise.resolve(catalogue as Product[]);

/** Read-only product catalogue. Reads are async so the source can become an API later. */
export class ProductModel {
  constructor(private readonly source: () => Promise<Product[]> = bundled) {}

  getAll(): Promise<Product[]> {
    return this.source();
  }

  /** Products whose `tabs` include `tab`, in catalogue order. Unknown tab → `[]`. */
  async getByTab(tab: string): Promise<Product[]> {
    const all = await this.getAll();
    return all.filter((product) => (product.tabs as string[]).includes(tab));
  }
}
