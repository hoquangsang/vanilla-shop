# site-layout Specification

## Purpose
Defines the header and footer shared by every page of the shop (content, responsive layout, menus and accessibility), so that Home and Detail look and behave the same around their page-specific content.

## Requirements

### Requirement: Same shell on every page
Home and Detail SHALL render the same header and footer markup from a single source, matching `docs/design/README.md > Shared shell`.

#### Scenario: Identical header and footer
- **WHEN** Home and Detail are loaded at 1440px
- **THEN** the header and footer HTML of both pages are identical except for which nav link is marked current

### Requirement: Top bar content
The top bar SHALL show the links FAQs, Help and Support on the left and five social icon links (Facebook, Twitter/X, LinkedIn, Instagram, YouTube), each with an accessible name, on the right. Below 768px only the social icons SHALL be shown, centred.

#### Scenario: Desktop top bar
- **WHEN** a page is loaded at 1440px
- **THEN** FAQs, Help, Support and 5 labelled social links are visible on a `#551760` bar

#### Scenario: Mobile top bar
- **WHEN** a page is loaded at 375px
- **THEN** FAQs/Help/Support are hidden and the 5 social links are visible

### Requirement: Search form
The header SHALL contain a search form with a labelled text input (placeholder `Search for products`, `name="q"`, `maxlength="200"`) and an icon submit button with an accessible name. Without JavaScript the form SHALL submit with GET to `detail.html`.

#### Scenario: Native submit
- **WHEN** JavaScript is disabled and `serum` is submitted
- **THEN** the browser navigates to `detail.html?q=serum`

### Requirement: Wishlist and cart boxes
The search row SHALL show a wishlist box (heart icon, count `0`) and a cart box (cart icon, count `0` until T7), each a link with an accessible name.

#### Scenario: Initial counts
- **WHEN** a page is loaded with an empty cart
- **THEN** the wishlist and cart boxes both show `0`

### Requirement: Main navigation
The nav row SHALL show the links Home, Shop, Shop Detail, Pages (sub-menu: Shopping Cart, Checkout) and Contact, plus Login and Register on the right. Home links to `index.html`, Shop Detail to `detail.html`, others to `#`. The link of the current page SHALL have `aria-current="page"` and the active colour.

#### Scenario: Current page on Home
- **WHEN** Home is loaded
- **THEN** the Home link has `aria-current="page"` and colour `#a15e58` (`--color-link-active-ink`, a darker shade of the design's `#d19c97` that reaches 4.5:1 on white), and no other nav link has `aria-current`

#### Scenario: Current page on Detail
- **WHEN** Detail is loaded
- **THEN** the Shop Detail link has `aria-current="page"`

### Requirement: Collapsible navigation on small screens
Below 1024px the main nav and Login/Register SHALL be hidden behind a hamburger button that toggles them open and closed, updates `aria-expanded`, and closes on Escape (returning focus to the button).

#### Scenario: Open and close the menu
- **WHEN** at 375px the hamburger is clicked, then Escape is pressed
- **THEN** the menu becomes visible with `aria-expanded="true"`, then hides with `aria-expanded="false"` and focus is on the hamburger

#### Scenario: Desktop shows the nav inline
- **WHEN** a page is loaded at 1440px
- **THEN** the hamburger is not visible and all nav links are visible

### Requirement: Categories menu
The Categories button SHALL toggle a list of 10 categories (Dresses with a sub-menu of 3 items, Shirts, Jeans, Swimwear, Sleepwear, Sportswear, Jumpsuits, Blazers, Jackets, Shoes) and keep `aria-expanded` in sync. On Home at ≥ 1024px the list SHALL be open on load and sit over the left column next to the hero; everywhere else it SHALL be closed on load. Clicking outside or pressing Escape SHALL close it only when it was opened as a dropdown (not on Home ≥ 1024px).

#### Scenario: Home desktop
- **WHEN** Home is loaded at 1440px
- **THEN** the category list is visible without any click and the button has `aria-expanded="true"`

#### Scenario: Detail desktop
- **WHEN** Detail is loaded at 1440px and Categories is clicked
- **THEN** the list was hidden before the click and is visible after it

#### Scenario: Mobile dropdown closes on outside click
- **WHEN** at 375px Categories is opened and the user clicks elsewhere on the page
- **THEN** the list hides and `aria-expanded="false"`

### Requirement: Footer content
The footer SHALL show the description text, address, email and phone with icons, two Quick Links columns (Home, Our Shop, Shop Detail, Shopping Cart, Checkout, Contact Us), and a bottom bar with the copyright text and six payment icons with accessible names. Columns SHALL stack on screens below 768px.

#### Scenario: Footer on desktop
- **WHEN** a page is loaded at 1440px
- **THEN** the three footer columns are side by side on a `#551760` background and the bottom bar shows copyright left and payment icons right

#### Scenario: Footer on mobile
- **WHEN** a page is loaded at 375px
- **THEN** the footer columns are stacked vertically and nothing overflows horizontally

### Requirement: Visual match with the design
At 1440px the header and footer SHALL match `docs/design/zoom/home-part-1.png` (header) and `docs/design/zoom/home-part-5.png` (footer) in structure, order, colours and proportions.

#### Scenario: Side-by-side comparison
- **WHEN** a 1440px screenshot of Home is compared with the two design images
- **THEN** every element listed in `docs/design/README.md > Shared shell` is present in the same position and colour
