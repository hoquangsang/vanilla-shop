# home-brand-content Specification

## Purpose
Defines the lower half of the Home page (awards, The Nu Skin Way, and news), so the brand story is presented as in the design on every screen size.

## Requirements

### Requirement: Award banner
Under the `Award And Recognition` title pill, a full-width light-grey banner SHALL show the devices photo on the left and right-aligned text `WORLD'S #1 COMPANY FOR`, `Beauty & Wellness Device Systems` and italic `Source: Euromonitor`. Below 768px the text SHALL move below the photo, centred.

#### Scenario: Banner layout
- **WHEN** Home is loaded at 1440px and at 375px
- **THEN** text is right of the photo at 1440px and below it at 375px, fully readable in both

### Requirement: Awards carousel
An awards carousel SHALL list the 6 awards from `docs/design/README.md` item 8, each with a round seal image (self-drawn SVG, alt text naming the award), product name, award text and source. It SHALL show 6 items at ≥ 1280px, 4 at ≥ 1024px, 3 at ≥ 640px and 2 below, with dot pagination.

#### Scenario: Items per width
- **WHEN** Home is loaded at 1440px, then at 375px
- **THEN** 6 award items are fully visible at 1440px and 2 at 375px

#### Scenario: No third-party logos
- **WHEN** the award seal assets are inspected
- **THEN** they are SVG drawn in this repo (circle, ring and text), not copies of award logos

### Requirement: Stats strip
Under `The Nu Skin Way` title pill, a bordered white strip SHALL show `Nu Skin,` / `Improving Lives Everyday` on the left and three stats on the right: `25+` Years of Giving, `20+` Current Social Projects (link), `850M+` Meals Donated through Nourish the Children (link). Below 768px the heading SHALL be on top and the stats below it.

#### Scenario: Stats layout
- **WHEN** Home is loaded at 1440px and at 375px
- **THEN** heading and stats are on one row at 1440px and stacked at 375px, all three stats visible

### Requirement: Image and text blocks
"Being a Force for Good" SHALL show the photo on the left and a light-grey text panel (heading, paragraph, link `Explore our projects`) on the right; "Nature + Science" SHALL mirror it (text left, photo right, link `Discover more`). Below 768px each block SHALL stack with the photo first.

#### Scenario: Desktop alternation
- **WHEN** Home is loaded at 1440px
- **THEN** the first block has the photo on the left and the second has the photo on the right

#### Scenario: Mobile stacking
- **WHEN** Home is loaded at 375px
- **THEN** both blocks show photo then text, full width

### Requirement: News row
Under the `Nu Skin In The News` title pill, the left ~70% SHALL show a `View All >>` link and a news carousel of 5 cards (square image, centred title `38 New Beauty Products Our Editors Are Loving This December`) with prev/next buttons and a pagination bar; the right ~30% SHALL show a tall image card with overlay text `News` and an underlined `Nu Skin In The News`. Below 1024px the side card SHALL go below the carousel at full width and reduced height.

#### Scenario: Desktop news
- **WHEN** Home is loaded at 1440px
- **THEN** about 3 news cards are visible beside the tall side card

#### Scenario: Mobile news
- **WHEN** Home is loaded at 375px
- **THEN** one news card (plus a peek of the next) is visible, the side card is below the carousel, and nothing overflows horizontally

### Requirement: Visual match
At 1440px the regions `awards`, `nu-skin-way` and `news` SHALL match `docs/design/zoom/home-part-3.png`, `home-part-4.png` and `home-part-5.png` in structure, order, colours and proportions.

#### Scenario: Side-by-side comparison
- **WHEN** a 1440px screenshot of these regions is compared with the design images
- **THEN** every element listed in `docs/design/README.md > Home page sections` items 6–14 is present in the same place and colour
