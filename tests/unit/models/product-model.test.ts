import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ProductModel } from "../../../src/models/product-model";

const ids = (products: { id: string }[]) => products.map((p) => p.id);

describe("ProductModel", () => {
  it("has 8 valid products with existing images", async () => {
    const all = await new ProductModel().getAll();
    expect(ids(all)).toEqual(["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"]);
    for (const p of all) {
      expect(p.price).toBeGreaterThan(0);
      expect(p.oldPrice).toBeGreaterThan(p.price);
      expect(p.tabs.length).toBeGreaterThan(0);
      expect(existsSync(resolve(__dirname, "../../../public", p.image))).toBe(true);
    }
  });

  it("returns p1..p6 for the description tab", async () => {
    expect(ids(await new ProductModel().getByTab("description"))).toEqual([
      "p1",
      "p2",
      "p3",
      "p4",
      "p5",
      "p6",
    ]);
  });

  it("returns p3..p8 for the specifications tab", async () => {
    expect(ids(await new ProductModel().getByTab("specifications"))).toEqual([
      "p3",
      "p4",
      "p5",
      "p6",
      "p7",
      "p8",
    ]);
  });

  it("returns an empty list for an unknown tab", async () => {
    expect(await new ProductModel().getByTab("reviews")).toEqual([]);
  });

  it("returns Promises", () => {
    const model = new ProductModel();
    expect(model.getByTab("description")).toBeInstanceOf(Promise);
    expect(model.getAll()).toBeInstanceOf(Promise);
  });
});
