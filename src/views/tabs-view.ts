/**
 * ARIA tabs. Expects `[role="tab"]` buttons whose `aria-controls` point at `[role="tabpanel"]` elements.
 * Click and Left/Right/Home/End select a tab; hidden panels use the `hidden` attribute.
 */
export class TabsView {
  private readonly tabs: HTMLElement[];

  constructor(
    root: HTMLElement,
    private readonly onSelect: (tabId: string) => void = () => {},
  ) {
    this.tabs = [...root.querySelectorAll<HTMLElement>('[role="tab"]')];
    this.tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => this.select(index));
      tab.addEventListener("keydown", (event) => this.onKeydown(event, index));
    });
    const initial = this.tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    this.apply(Math.max(initial, 0));
  }

  select(index: number, focus = false): void {
    const tab = this.tabs[index];
    if (!tab) return;
    this.apply(index);
    if (focus) tab.focus();
    this.onSelect(tab.id);
  }

  private apply(selected: number): void {
    this.tabs.forEach((tab, index) => {
      const active = index === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
      if (panel) panel.hidden = !active;
    });
  }

  private onKeydown(event: KeyboardEvent, index: number): void {
    const last = this.tabs.length - 1;
    const target =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : undefined;
    if (target === undefined) return;
    event.preventDefault();
    this.select(target, true);
  }
}
