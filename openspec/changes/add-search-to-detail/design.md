# Design

## Context

Available after T3/T4: `SearchModel` (`submit`, `query`, `toDetailUrl`, static `fromSearch`, `on("change")`), header form `[data-search-form]` (`action="detail.html"`, GET) with `[data-search-input]` (`name="q"`, `maxlength=200`), shared shell, `detail.html` with `<!-- region:detail -->`. Layer rules: `CLAUDE.md`, `.claude/skills/mvc-feature`.

## Goals / Non-Goals

**Goals:** the clearest possible MVC example in the repo (it is what the brief grades), full unit + e2e coverage, progressive enhancement.
**Non-Goals:** search suggestions, history, results list.

## Decisions

### Data flow
```
Home / Detail header                                   Detail page
SearchFormView --submit(raw)--> SearchController        DetailController
                                  | model.submit(raw)     | SearchModel.fromSearch(location.search)
                                  | ok?                   v
                                  |  yes -> navigator.go(model.toDetailUrl())   DetailView.render(query)
                                  |  no  -> view.showError("Please enter a keyword")
SearchModel (state + rules, from T3)
```
The URL is the hand-off between pages: Model state on Home → URL → Model state on Detail. No storage is needed, links are shareable, reload works.

### Classes
```ts
// src/views/search-form-view.ts
export class SearchFormView {
  constructor(form: HTMLFormElement, input: HTMLInputElement);
  bindSubmit(handler: (raw: string) => void): void;  // preventDefault, pass input.value
  showError(message: string): void;                  // aria-invalid, aria-describedby → hint element (role="status"), keep focus
  clearError(): void;                                // called by the view itself on "input"
}
// src/views/detail-view.ts
export class DetailView {
  constructor(textarea: HTMLTextAreaElement);
  render(query: string): void;                       // textarea.value = query (never innerHTML)
}
// src/core/navigation.ts
export interface PageNavigator { go(url: string): void; }
export const browserNavigator: PageNavigator = { go: (url) => window.location.assign(url) };
// src/controllers/search-controller.ts
export class SearchController {
  constructor(model: SearchModel, view: Pick<SearchFormView, "bindSubmit" | "showError">, navigator: PageNavigator);
  init(): void;
}
// src/controllers/detail-controller.ts
export class DetailController {
  constructor(model: SearchModel, view: Pick<DetailView, "render">, search: string);
  init(): void; // model.submit(SearchModel.fromSearch(search)) if non-empty; view.render(model.query)
}
```
`PageNavigator` (not `Navigator`, which is a DOM global type) is injected so controller tests assert `go("detail.html?q=…")` without real navigation. The hint element is created by `SearchFormView` (absolutely positioned under the input so the header height does not jump).

### Detail markup (`detail.html`, region `detail`)
```html
<section class="container-page py-8" aria-labelledby="detail-title">
  <h1 id="detail-title" class="sr-only">Search detail</h1>
  <label for="detail-text" class="sr-only">Your search keyword</label>
  <textarea id="detail-text" data-detail-text rows="7"
    placeholder="Nothing searched yet. Use the search box above."
    class="w-full lg:w-1/2 min-h-[170px] resize-y rounded-sm border p-4 …"></textarea>
</section>
```
Add generous bottom spacing (`pb-24`) so the footer sits low as in the design image.

### Wiring
`src/pages/search.ts`:
- `initSearch()`: one `SearchModel`, `SearchFormView` on `[data-search-form]`, `SearchController` with `browserNavigator`. Called from `home.ts` and `detail.ts`.
- `initDetail()`: new `SearchModel`, `DetailView` on `[data-detail-text]`, `DetailController(model, view, location.search)`. Called from `detail.ts` only.

### Docs
`docs/mvc.md`: the data-flow diagram above (as a Mermaid `sequenceDiagram`), a table "file → layer → responsibility" for search **and** cart, and a short note on why the URL is the hand-off. Link it from `README.md` later (T9).

### Tests
- Unit: `search-form-view.test.ts` (preventDefault, error on/off, aria attributes), `detail-view.test.ts` (value set, HTML-like text stays text), `search-controller.test.ts` (valid → `navigator.go` with encoded URL; blank → `showError`, no `go`), `detail-controller.test.ts` (query present/absent/encoded).
- E2E `tests/e2e/search.spec.ts`: one test per spec scenario; listen for `page.on("dialog")` to prove no alert; JS-disabled test via `browser.newContext({ javaScriptEnabled: false })`.

## Risks / Trade-offs

- [Hosting rewrites] → Vercel serves `detail.html` as-is (no `cleanUrls`), same as `vite preview`. Assert on `textarea` content first; assert the URL with `/detail\.html\?q=/`.
- [`location.assign` in happy-dom] → never called in unit tests thanks to the injected `PageNavigator`.
