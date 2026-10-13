# search-to-detail Specification

## Purpose
Lets a shopper type any text into the header search box on any page and see exactly that text on the Detail page, which reuses the site header and footer and shows the text in a textarea.

## Requirements

### Requirement: Detail page layout
The Detail page SHALL show the shared header and footer, with the Categories menu collapsed, and between them a labelled, editable, resizable textarea about half the container width on ≥ 1024px and full width below, about 170px tall, as in `docs/design/flow-search-detail.png`.

#### Scenario: Desktop detail
- **WHEN** `detail.html` is loaded at 1440px
- **THEN** the header, a textarea in the left half of the content area, and the footer are shown, and the Categories list is closed

#### Scenario: Mobile detail
- **WHEN** `detail.html` is loaded at 375px
- **THEN** the textarea spans the content width and nothing overflows horizontally

### Requirement: Search from Home shows the text on Detail
Submitting a non-empty query from the header search box (button click or Enter) SHALL navigate to the Detail page, whose textarea SHALL contain exactly the normalised query.

#### Scenario: Design flow
- **WHEN** on Home the user types `Reasonable Price` and clicks the search button
- **THEN** the browser is on `detail.html?q=Reasonable+Price` and the textarea contains `Reasonable Price`

#### Scenario: Enter key
- **WHEN** on Home the user types `serum` and presses Enter
- **THEN** the Detail textarea contains `serum`

#### Scenario: Search again from Detail
- **WHEN** on the Detail page showing `serum` the user searches for `toner`
- **THEN** the Detail page now shows `toner`

### Requirement: Empty query is not submitted
Submitting an empty or whitespace-only query SHALL NOT navigate. The input SHALL get `aria-invalid="true"`, keep focus, and a hint `Please enter a keyword` SHALL be shown and announced; typing again SHALL clear the error state.

#### Scenario: Blank submit
- **WHEN** the user submits `"   "` on Home
- **THEN** the URL does not change, the hint is visible, and the input has `aria-invalid="true"` and focus

#### Scenario: Error clears on typing
- **WHEN** after the blank submit the user types `a`
- **THEN** the hint is hidden and `aria-invalid` is removed

### Requirement: Text is shown literally
The Detail page SHALL display the query as plain text, never as HTML, and SHALL preserve Unicode text such as Vietnamese diacritics and emoji.

#### Scenario: HTML-like input
- **WHEN** the user searches for `<img src=x onerror=alert(1)>`
- **THEN** the textarea shows that exact text, no dialog opens, and no `img` element is created

#### Scenario: Vietnamese and emoji
- **WHEN** the user searches for `Giá hợp lý 😊`
- **THEN** the textarea shows `Giá hợp lý 😊`

### Requirement: Detail state comes from the URL
The Detail page SHALL take the query from its URL, so a reload or an opened link SHALL show the same text, and a URL without a query SHALL show an empty textarea with the placeholder `Nothing searched yet. Use the search box above.`

#### Scenario: Reload keeps the text
- **WHEN** the Detail page showing `Reasonable Price` is reloaded
- **THEN** the textarea still contains `Reasonable Price`

#### Scenario: Direct visit without query
- **WHEN** `detail.html` is opened without `?q=`
- **THEN** the textarea is empty and shows the placeholder

### Requirement: Search works without JavaScript
With JavaScript disabled the search form SHALL still reach the Detail page through a normal GET submit (the textarea may then be empty).

#### Scenario: No JS
- **WHEN** JavaScript is disabled and `serum` is submitted
- **THEN** the browser navigates to `detail.html?q=serum`
