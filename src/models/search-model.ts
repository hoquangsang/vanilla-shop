import { EventEmitter } from "../core/event-emitter";

export class SearchModel extends EventEmitter<{ change: string }> {
  static readonly MAX_LENGTH = 200;
  static readonly DETAIL_PATH = "detail.html";

  private current = "";

  static normalise(raw: string): string {
    return Array.from(raw.trim()).slice(0, SearchModel.MAX_LENGTH).join("");
  }

  static fromSearch(search: string): string {
    try {
      return SearchModel.normalise(new URLSearchParams(search).get("q") ?? "");
    } catch {
      return "";
    }
  }

  get query(): string {
    return this.current;
  }

  submit(raw: string): boolean {
    const query = SearchModel.normalise(raw);
    if (query === "") return false;
    this.current = query;
    this.emit("change", query);
    return true;
  }

  toDetailUrl(query: string = this.current): string {
    return `${SearchModel.DETAIL_PATH}?${new URLSearchParams({ q: query }).toString()}`;
  }
}
