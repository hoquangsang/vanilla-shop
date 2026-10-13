import { SearchModel } from "../models/search-model";
import type { DetailView } from "../views/detail-view";

export class DetailController {
  constructor(
    private readonly model: SearchModel,
    private readonly view: Pick<DetailView, "render">,
    private readonly search: string,
  ) {}

  init(): void {
    this.model.on("change", (query) => this.view.render(query));
    const query = SearchModel.fromSearch(this.search);
    if (query !== "") this.model.submit(query);
    else this.view.render(this.model.query);
  }
}
