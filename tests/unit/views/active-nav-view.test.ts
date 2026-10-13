import { beforeEach, describe, expect, it } from "vitest";
import { ActiveNavView } from "../../../src/views/active-nav-view";

beforeEach(() => {
  document.body.innerHTML = `
    <a data-nav="home" href="index.html">Home</a>
    <a data-nav="detail" href="detail.html">Shop Detail</a>
    <a href="#">Shop</a>`;
});

describe("ActiveNavView", () => {
  it.each([
    ["home", "home"],
    ["detail", "detail"],
  ])("marks only the %s link on the %s page", (page, nav) => {
    document.body.dataset.page = page;
    new ActiveNavView(document);
    const current = [...document.querySelectorAll("[aria-current]")];
    expect(current).toHaveLength(1);
    expect(current[0]?.getAttribute("data-nav")).toBe(nav);
    expect(current[0]?.getAttribute("aria-current")).toBe("page");
  });

  it("marks nothing on an unknown page", () => {
    document.body.dataset.page = "other";
    new ActiveNavView(document);
    expect(document.querySelector("[aria-current]")).toBeNull();
  });
});
