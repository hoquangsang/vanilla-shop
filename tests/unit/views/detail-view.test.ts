import { describe, expect, it } from "vitest";
import { DetailView } from "../../../src/views/detail-view";

describe("DetailView", () => {
  it("sets the textarea value", () => {
    const textarea = document.createElement("textarea");
    new DetailView(textarea).render("Reasonable Price");
    expect(textarea.value).toBe("Reasonable Price");
  });

  it("keeps HTML-like text as text", () => {
    document.body.innerHTML = "<textarea></textarea>";
    const textarea = document.querySelector("textarea")!;
    new DetailView(textarea).render("<img src=x onerror=alert(1)>");
    expect(textarea.value).toBe("<img src=x onerror=alert(1)>");
    expect(document.querySelector("img")).toBeNull();
  });

  it("keeps Unicode intact", () => {
    const textarea = document.createElement("textarea");
    new DetailView(textarea).render("Giá hợp lý 😊");
    expect(textarea.value).toBe("Giá hợp lý 😊");
  });
});
