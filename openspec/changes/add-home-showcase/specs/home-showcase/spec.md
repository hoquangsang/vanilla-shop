# Spec Delta

## Purpose

Defines the top half of the Home page: hero carousel, promo banners, the "Most Popular Products" band with its tabs and product cards, and the LumiSpa feature band, on every screen size.

## ADDED Requirements

### Requirement: Hero carousel
The Home page SHALL show a hero carousel with at least 2 slides. Each slide SHALL show a background photo with a dark overlay, the line `10% OFF YOUR FIRST ORDER`, the heading `Reasonable Price`, and a `Shop Now` button. It SHALL have labelled previous/next buttons, loop, and autoplay unless the user prefers reduced motion. On ≥ 1024px it SHALL occupy the right three quarters of the row, leaving the left quarter for the Categories list.

#### Scenario: Desktop hero
- **WHEN** Home is loaded at 1440px
- **THEN** the hero starts at about 25% of the container width, is about 430px tall, and shows the slide text centred

#### Scenario: Mobile hero
- **WHEN** Home is loaded at 375px
- **THEN** the hero spans the full container width and the heading fits without horizontal overflow

#### Scenario: Navigate slides
- **WHEN** the next button is clicked
- **THEN** the second slide becomes visible

### Requirement: Promo banners
Below the hero, two banners SHALL each show `PREFER CUSTOMER 2025`, `Winter Collection`, an outlined `Shop Now` button and a photo. They SHALL sit side by side on ≥ 768px and stack below that.

#### Scenario: Banner layout by width
- **WHEN** Home is loaded at 1440px and at 375px
- **THEN** the banners are side by side at 1440px and stacked at 375px

### Requirement: Section title pill
Section titles SHALL use the shared title pill: centred, purple background, white bold text, a short light line on each side of the text inside the pill.

#### Scenario: Most Popular Products title
- **WHEN** Home is loaded
- **THEN** a level-2 heading `Most Popular Products` is shown as the title pill above the products band

### Requirement: Products band layout
The products band SHALL have a light background, a white intro card ("Find out what everyone's talking about", link `Browse our best`, teal decorative strokes) on the left quarter at ≥ 1024px, and on the right the tabs, a right-aligned `View All >>` link, and the product carousel. Below 1024px the intro card SHALL appear above the carousel as a compact full-width block.

#### Scenario: Desktop band
- **WHEN** Home is loaded at 1440px
- **THEN** the intro card is on the left and 3 product cards are fully visible on the right, with a part of a 4th card visible as in `docs/design/zoom/home-part-2.png`

#### Scenario: Mobile band
- **WHEN** Home is loaded at 375px
- **THEN** the intro text is above the carousel, one product card is fully visible with part of the next card peeking, and nothing overflows the page horizontally

### Requirement: Product tabs
The tabs DESCRIPTION and SPECIFICATIONS SHALL switch which product carousel is shown, following the ARIA tabs pattern (`role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`, arrow-key navigation). DESCRIPTION SHALL be selected on load and marked with the accent top border.

#### Scenario: Default tab
- **WHEN** Home is loaded
- **THEN** DESCRIPTION has `aria-selected="true"` and its panel shows products `p1`…`p6`

#### Scenario: Switch tab
- **WHEN** SPECIFICATIONS is clicked
- **THEN** its panel becomes visible showing products `p3`…`p8`, and the DESCRIPTION panel is hidden

### Requirement: Product card
Each product card SHALL show the product image (with alt text = product name), a `SALE` ribbon when `onSale`, a round award seal when `hasAward`, the brand in small uppercase, the name, the price formatted as `$X.XX` in the accent colour, the old price struck through, and a full-width `Add to cart` button carrying `data-add-to-cart="<id>"`. The text SHALL say "Add to cart", not "Add to card".

#### Scenario: Card content
- **WHEN** Home is loaded
- **THEN** the card for `p2` shows its name, `$` prices with two decimals, the SALE ribbon, and a button `Add to cart` with `data-add-to-cart="p2"`

#### Scenario: Product text is not interpreted as HTML
- **WHEN** a product name contains `<b>`
- **THEN** it is shown literally (cards are built with `textContent`, not `innerHTML`, for data fields)

### Requirement: LumiSpa band
A band with a warm light background SHALL show the LumiSpa photo with a round purple badge `Sale Of` / `$29.99` on its top-right corner, and next to it the small red uppercase label `AGELOC® LUMISPA® IO`, heading `ageLOC® LumiSpa® iO`, text `Elevate your skincare routine` and a `SHOP NOW` button. Image and text SHALL be side by side on ≥ 768px and stacked below.

#### Scenario: LumiSpa layout
- **WHEN** Home is loaded at 1440px and at 375px
- **THEN** image and text are side by side at 1440px and stacked (image first) at 375px, with the badge fully visible in both

### Requirement: Visual match
At 1440px the regions `hero`, `popular-products` and `lumispa` SHALL match `docs/design/zoom/home-part-1.png` and `home-part-2.png` in structure, order, colours and proportions (images and copy may differ where the design README allows).

#### Scenario: Side-by-side comparison
- **WHEN** a 1440px screenshot of these regions is compared with the design images
- **THEN** every element listed in `docs/design/README.md > Home page sections` items 1–5 is present in the same place and colour
