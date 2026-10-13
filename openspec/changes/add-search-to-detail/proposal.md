# Proposal

## Why

Roadmap **T8**. Depends on T3 (`SearchModel`) and T4 (header search form, shared shell). The brief asks for a simple Detail page (Home header + footer + a textarea) and, **using MVC**, to show the text typed into the search box on that Detail page (`docs/design/flow-search-input.png` → `flow-search-detail.png`). This is the requirement the reviewers will check most closely for MVC, so the triangle must be explicit and tested.

## What Changes

- Detail page body (region `detail`): a heading (visually hidden) and a labelled `<textarea data-detail-text>` showing the search query.
- `SearchFormView` + `SearchController` (both pages): intercept the header form submit, validate through `SearchModel`, navigate to `detail.html?q=…`, or show an inline hint when the query is empty.
- `DetailView` + `DetailController` (Detail page): read the query from the URL through `SearchModel.fromSearch(location.search)` and render it into the textarea.
- `src/pages/search.ts` with `initSearch()` (both pages) and `initDetail()` (Detail page).
- `docs/mvc.md`: a one-page diagram + explanation of this flow, since it is what the brief evaluates.

## Capabilities

### New Capabilities

- `search-to-detail`: submitting a query from the header search box on any page and seeing it on the Detail page, including validation, special characters, reloads and the Detail page layout.

### Modified Capabilities

None. (`search-query` rules from T3 are used unchanged.)

## Out of scope

- Real product search / results list.
- Pre-filling the header search input on Detail (the design shows it empty).
- Cart → T7.

## Impact

- Modified: `detail.html` (region `detail`), `src/pages/home.ts`, `src/pages/detail.ts` (one import + call each).
- New: `src/views/{search-form,detail}-view.ts`, `src/controllers/{search,detail}-controller.ts`, `src/pages/search.ts`, `src/core/navigation.ts`, unit tests, `tests/e2e/search.spec.ts`, `docs/mvc.md`.
