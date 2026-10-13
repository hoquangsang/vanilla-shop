export type ProductTab = "description" | "specifications";

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  oldPrice: number;
  /** Path relative to the site root, without a leading slash (the build uses `base: "./"`). */
  image: string;
  onSale: boolean;
  hasAward: boolean;
  tabs: ProductTab[];
}
