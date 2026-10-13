# Spec Delta

## Purpose

Shows the shopper, in the header cart box, how many items they have added, updating instantly on every "Add to cart" click and staying correct across reloads, pages and tabs.

## ADDED Requirements

### Requirement: Count increases on every click
Each click on any "Add to cart" button SHALL increase the number in the header cart box by exactly 1, immediately and without a page reload, for any number of clicks on the same or different products.

#### Scenario: Design flow
- **WHEN** the cart shows `0` and "Add to cart" on the first product card is clicked once
- **THEN** the cart box shows `1` (as in `docs/design/flow-add-to-cart.png`)

#### Scenario: Repeated clicks
- **WHEN** "Add to cart" is clicked 3 times on one product and 2 times on another
- **THEN** the cart box shows `5`

#### Scenario: Buttons in any tab or slide
- **WHEN** the SPECIFICATIONS tab is selected and "Add to cart" is clicked on a product there
- **THEN** the cart count increases by 1

### Requirement: Count persists across reloads and pages
The cart count SHALL be the same after reloading the page and on the Detail page.

#### Scenario: Reload
- **WHEN** the cart shows `2` and the page is reloaded
- **THEN** the cart box shows `2`

#### Scenario: Navigate to Detail
- **WHEN** the cart shows `2` and the shopper goes to the Detail page
- **THEN** the Detail page header cart box shows `2`

### Requirement: Display cap
When the count is greater than 99 the cart box SHALL show `99+`, while the accessible name keeps the exact number.

#### Scenario: Large count
- **WHEN** the cart count is 120
- **THEN** the box shows `99+` and its accessible name is `Cart, 120 items`

### Requirement: Accessible count
The cart link's accessible name SHALL be `Cart, N items` (`Cart, 1 item` for one), and each change SHALL be announced to screen readers through a polite live region without moving focus.

#### Scenario: Screen reader label
- **WHEN** one product has been added
- **THEN** the cart link's accessible name is `Cart, 1 item` and a polite live region contains `Cart updated: 1 item`

#### Scenario: Focus stays on the button
- **WHEN** "Add to cart" is activated with the keyboard (Enter or Space)
- **THEN** the count increases and focus remains on the same button

### Requirement: Button feedback
After a click the button SHALL show `Added ✓` for about 1 second and then return to `Add to cart`; it SHALL stay clickable during that time and every click SHALL count.

#### Scenario: Feedback text
- **WHEN** "Add to cart" is clicked
- **THEN** the button reads `Added ✓` and reads `Add to cart` again after about 1 second

#### Scenario: Fast double click
- **WHEN** the same button is clicked twice within 200ms
- **THEN** the count increases by 2
