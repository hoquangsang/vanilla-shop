import { DetailController } from "../controllers/detail-controller";
import { SearchController } from "../controllers/search-controller";
import { requireEl } from "../core/dom";
import { browserNavigator } from "../core/navigation";
import { SearchModel } from "../models/search-model";
import { DetailView } from "../views/detail-view";
import { SearchFormView } from "../views/search-form-view";

/** Header search box: validates the query and opens the Detail page. Called by every page. */
export function initSearch(): SearchController {
  const controller = new SearchController(
    new SearchModel(),
    new SearchFormView(
      requireEl<HTMLFormElement>("[data-search-form]"),
      requireEl<HTMLInputElement>("[data-search-input]"),
    ),
    browserNavigator,
  );
  controller.init();
  return controller;
}

/** Detail page: shows the query from the URL in the textarea. */
export function initDetail(): DetailController {
  const controller = new DetailController(
    new SearchModel(),
    new DetailView(requireEl<HTMLTextAreaElement>("[data-detail-text]")),
    window.location.search,
  );
  controller.init();
  return controller;
}
