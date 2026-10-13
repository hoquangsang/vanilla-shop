import type { PageNavigator } from "../core/navigation";
import type { SearchModel } from "../models/search-model";
import type { SearchFormView } from "../views/search-form-view";

export const EMPTY_QUERY_MESSAGE = "Please enter a keyword";

export class SearchController {
  constructor(
    private readonly model: SearchModel,
    private readonly view: Pick<SearchFormView, "bindSubmit" | "showError">,
    private readonly navigator: PageNavigator,
  ) {}

  init(): void {
    this.view.bindSubmit((raw) => {
      if (this.model.submit(raw)) this.navigator.go(this.model.toDetailUrl());
      else this.view.showError(EMPTY_QUERY_MESSAGE);
    });
  }
}
