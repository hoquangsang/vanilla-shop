import { describe, expect, it, vi } from "vitest";
import { ProductListController } from "../../../src/controllers/product-list-controller";
import { ProductModel } from "../../../src/models/product-model";

describe("ProductListController", () => {
  it("renders each tab's products in that tab's view", async () => {
    const views = { description: { render: vi.fn() }, specifications: { render: vi.fn() } };
    await new ProductListController(new ProductModel(), views).init();
    const ids = (fn: typeof views.description.render) =>
      (fn.mock.calls[0]![0] as { id: string }[]).map((p) => p.id);
    expect(ids(views.description.render)).toEqual(["p1", "p2", "p3", "p4", "p5", "p6"]);
    expect(ids(views.specifications.render)).toEqual(["p3", "p4", "p5", "p6", "p7", "p8"]);
  });
});
