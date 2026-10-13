# Spec Delta

## Purpose

Provides the product data shown on the Home page (identity, name, brand, prices, image, badges) and the rules for grouping and displaying it, so that views never hard-code products.

## ADDED Requirements

### Requirement: Product records
The catalogue SHALL contain exactly the 8 products listed in this change's design.md, each with a unique string `id` (`p1`…`p8`), `brand`, `name`, `price`, `oldPrice` (greater than `price`), `image` (path under `images/products/`), `onSale` (boolean), `hasAward` (boolean) and `tabs` (a non-empty subset of `description`, `specifications`).

#### Scenario: Catalogue is complete and valid
- **WHEN** all products are loaded
- **THEN** there are 8 products with unique ids `p1`…`p8`, and every product has `oldPrice > price > 0` and an image path that exists in `public/images/products/`

### Requirement: Products per tab
The catalogue SHALL return, for a tab id, the products whose `tabs` include it, in catalogue order. An unknown tab id SHALL return an empty list.

#### Scenario: Description tab
- **WHEN** products for tab `description` are requested
- **THEN** the result is `p1`, `p2`, `p3`, `p4`, `p5`, `p6` in that order

#### Scenario: Specifications tab
- **WHEN** products for tab `specifications` are requested
- **THEN** the result is `p3`, `p4`, `p5`, `p6`, `p7`, `p8` in that order

#### Scenario: Unknown tab
- **WHEN** products for tab `reviews` are requested
- **THEN** the result is empty

### Requirement: Asynchronous access
Catalogue reads SHALL be asynchronous (return a Promise) so the data source can later become a network API without changing callers.

#### Scenario: Promise-based read
- **WHEN** the products for a tab are requested
- **THEN** a Promise is returned that resolves to the list

### Requirement: Price formatting
Prices SHALL be displayed in US dollars with a `$` sign and exactly two decimals.

#### Scenario: Whole and fractional prices
- **WHEN** `14`, `35.5` and `29.99` are formatted
- **THEN** the results are `$14.00`, `$35.50` and `$29.99`
