# Design reference

The original Figma file needs a login, so these exports are the **source of truth**:

| File | What it shows |
|---|---|
| `home-full.webp` | Whole Home page, desktop (low-res, 440×2000) |
| `zoom/home-part-1..5.png` | The same page cut into 5 parts and upscaled ×3, use these to read details |
| `flow-add-to-cart.png` | Clicking "Add to cart" increments the cart badge (0 → 1) |
| `flow-search-input.png` | Typing in the header search box on Home, then pressing the search button |
| `flow-search-detail.png` | Result: the Detail page shows the typed text inside a textarea, between header and footer |
| `brief.pdf` | Original task brief (Vietnamese) |

The layout is based on the free **MultiShop** template by HTML Codex / ThemeWagon, recoloured purple and filled with Nu Skin content.
Images and copy may be changed (the brief allows it); the **structure, order, colours and proportions must match**.

## Design tokens

Sampled from the exports. Register them as Tailwind v4 `@theme` tokens; do not hard-code hex values in markup.

| Token | Value | Used for |
|---|---|---|
| `--color-primary` | `#551760` | Top bar, Categories button, section title pills, "Add to cart" / "Shop now" buttons, footer |
| `--color-primary-dark` | `#44124e` | Footer bottom bar, button hover |
| `--color-primary-soft` | `#b89bc0` | Thin lines inside the section-title pill |
| `--color-accent` | `#e7ab3c` | Current price, active tab underline |
| `--color-link-active` | `#d19c97` | Active nav link ("Home") |
| `--color-sale` | `#76bc49` | "SALE" ribbon on product cards |
| `--color-teal` | `#1fa58a` | Decorative strokes in "Find out what everyone's talking about" |
| `--color-surface-alt` | `#f3f7f8` | Background of the Most Popular Products band |
| `--color-surface-warm` | `#f2f1ee` | Background of the LumiSpa band |
| `--color-surface-muted` | `#f5f5f5` | Text panels of "Being a Force for Good" / "Nature + Science" |
| `--color-ink` | `#212529` | Body text |
| `--color-ink-muted` | `#6c757d` | Secondary text, old price (strike-through) |

- **Font:** Roboto (400/500/700), self-hosted via `@fontsource/roboto` so it also works offline. Fallback `system-ui, sans-serif`.
- **Icons:** Font Awesome Free (`@fortawesome/fontawesome-free`): solid icons + brand icons for social links and payment cards.
- **Container:** max width ≈ 1320px, centred, 16px side gutter on mobile.
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536). Verify at 375, 768, 1024, 1440.

## Shared shell (both pages)

### Top bar (`--color-primary`, ~36px tall, white text)
- Left: `FAQs | Help | Support` (links, separated by thin vertical bars).
- Right: social icons Facebook, Twitter/X, LinkedIn, Instagram, YouTube.
- Mobile (< md): social icons only, centred.

### Middle row (white)
- Search form, centred, ~50% width on desktop: text input with placeholder `Search for products` + square button with magnifier icon. Full width on mobile.
- Right: two small bordered boxes: heart icon + count, cart icon + count. Icons in `--color-primary`, counts in small grey text. Wishlist count is always `0` (no wishlist feature).
- No logo is visible in the design; add a small text logo on mobile only, so the header is not empty (e.g. `VANILLA SHOP`).

### Nav row
- Left column (same width as the sidebar, ~25%): **Categories** button (`--color-primary`, white bold text, chevron on the right).
  - **Home page, ≥ lg:** the category list is **open** under the button, as a sidebar next to the hero (see `zoom/home-part-1.png`).
  - **Detail page and < lg:** collapsed; clicking the button toggles the list as a dropdown.
  - Items: Dresses (with a caret, sub-menu: Men's Dresses, Women's Dresses, Baby's Dresses), Shirts, Jeans, Swimwear, Sleepwear, Sportswear, Jumpsuits, Blazers, Jackets, Shoes. Items separated by light borders.
- Right: links `Home` (active, `--color-link-active`), `Shop`, `Shop Detail`, `Pages ▾` (dropdown: Shopping Cart, Checkout), `Contact`; far right `Login`, `Register`.
- Mobile (< lg): links collapse into a hamburger button that opens a vertical menu.
- Link targets: `Home` → `index.html`, `Shop Detail` → `detail.html`, everything else `#`.

### Footer (`--color-primary`, white text)
- Column 1 (wide): lorem paragraph "Dolore erat dolor sit lorem vero amet. Sed sit lorem magna, ipsum no sit erat lorem et magna ipsum dolore amet erat.", then 3 rows with icons: `123 Street, New York, USA`, `info@example.com`, `+012 345 67890`.
- Columns 2 and 3: heading **Quick Links**, each a list with a `›` chevron: Home, Our Shop, Shop Detail, Shopping Cart, Checkout, Contact Us.
- Bottom bar (`--color-primary-dark`, thin top border): left `© Your Site Name. All Rights Reserved. Designed by HTML Codex` / `Distributed By ThemeWagon`; right: payment icons Visa, Mastercard, PayPal, Amex, Visa Electron, Maestro (Font Awesome brand icons or small inline SVGs are fine).
- Mobile: columns stack.

## Home page sections (top to bottom)

All section titles ("Most Popular Products", "Award And Recognition", "The Nu Skin Way", "Nu Skin In The News") use the **same title pill**: centred, `--color-primary` background, rounded corners, white bold text ~24px, with a short horizontal `--color-primary-soft` line on each side of the text, inside the pill.

1. **Hero + sidebar** (`home-part-1.png`): sidebar categories (see shell) on the left, hero carousel on the right (~75% width, ~430px tall on desktop). Slides: background image, dark overlay, small uppercase line `10% OFF YOUR FIRST ORDER`, big bold `Reasonable Price`, white `Shop Now` button. Prev/next square arrow buttons on the left/right edges. At least 2 slides, autoplay, loop.
2. **Two promo banners** under the hero, same width as the hero, side by side (stacked on mobile): small uppercase `PREFER CUSTOMER 2025`, bold `Winter Collection`, outlined `Shop Now` button; photo on the right half.
3. **Most Popular Products** title pill.
4. **Products band** (`home-part-2.png`, background `--color-surface-alt`):
   - Left card (~25%, white): text "Find out what everyone's talking about" (large, line per word-group), link "Browse our best", decorative `--color-teal` diagonal strokes (CSS/SVG). Hidden or moved above the carousel on mobile.
   - Right: tabs `DESCRIPTION` (active, `--color-accent` top border) / `SPECIFICATIONS` (grey). `View All >>` link aligned right. Then a product carousel: 3 cards visible on desktop, 2 on tablet, 1.2–1.5 on mobile (peek of the next card), arrows on the sides, pagination bar below.
   - Both tabs show a product carousel (different product subsets are fine).
   - Product card: white image area with `SALE` ribbon (top-left, `--color-sale`) and a round award seal (top-right), brand line (`AGELOC`, tiny grey uppercase, letter-spaced), name, price row (`$14.00` in `--color-accent` bold + old price `$35.00` struck through, grey), full-width `Add to cart` button (`--color-primary`, white). The design says "Add to **card**"; that is a typo, use **"Add to cart"**.
5. **LumiSpa feature band** (background `--color-surface-warm`): image on the left (~50%) with a round `--color-primary` badge on its top-right corner ("Sale Of" / "$29.99"); on the right: tiny red uppercase `AGELOC® LUMISPA® IO`, heading `ageLOC® LumiSpa® iO`, text `Elevate your skincare routine`, `SHOP NOW` button (`--color-primary`, letter-spaced).
6. **Award And Recognition** title pill.
7. **Award banner**: wide light-grey banner, devices image on the left, right-aligned text `WORLD'S #1 COMPANY FOR` / `Beauty & Wellness Device Systems` / italic `Source: Euromonitor`.
8. **Awards carousel**: 6 visible on desktop (2–3 on mobile), each: round award seal image, product name (2–3 lines), small bold award text, small grey source. Dots pagination. Award seals: draw simple SVG badges (circle + text). Do not copy third-party logos.
   Items: ageLOC® LumiSpa® iO, 2023 Best Cleansing Device Award Winner, NewBeauty Awards · Epoch Baobab Body Butter, Body Butter Silver Winner, 2023 Beauty Bible Awards · Nu Skin Enterprises, 2022 Best USA Beauty Brand, Global Makeup Awards · Epoch® Yin & Yang Mask, 2022 Most Sustainable Packaging Silver Winner, Global Green Beauty Awards · ageLOC® Facial Spa, 2021 Readers' Choice Beauty Award Winner, InStyle · Nutricentials® Eye Love Bright Eyes, 2022 Pure Beauty Award Finalist, Pure Beauty Global Awards.
9. **The Nu Skin Way** title pill.
10. **Stats strip** (white card, light border): left `Nu Skin,` / `Improving Lives Everyday` (large); right 3 stats: `25+` Years of Giving · `20+` Current Social Projects (underlined link) · `850M+` Meals Donated through Nourish the Children (underlined link). Stack 1 column on mobile, stats in a row or 3 rows.
11. **Being a Force for Good**: image left (50%), text panel right (`--color-surface-muted`): heading, paragraph, link `Explore our projects`.
12. **Nature + Science**: mirrored, text panel left, image right; link `Discover more`.
   Copy for 11 and 12 is in `zoom/home-part-4.png`; paraphrasing is fine.
13. **Nu Skin In The News** title pill.
14. **News row**: left (~70%): `View All >>` link + news carousel (3 cards visible on desktop with peeks; card = square image + centred title `38 New Beauty Products Our Editors Are Loving This December`), arrows, pagination bar. Right (~30%): tall image card with overlay text `News` (big, white) and `Nu Skin In The News` (underlined). On mobile the tall card goes above or below the carousel, full width.

## Detail page (`flow-search-detail.png`)

Same top bar + middle row + nav row + footer. Categories collapsed. Body: a single `<textarea>` (~50% width on desktop, full width on mobile, ~170px tall, light border, resizable) whose content is the search query. Lots of white space; that is intended.

## Images

Placeholders are already in `public/images/` (see `public/images/CREDITS.md`):

| Slot | File |
|---|---|
| Hero slides | `hero/hero-1.webp`, `hero/hero-2.webp` |
| Promo banners | `banners/promo-1.webp`, `banners/promo-2.webp` |
| LumiSpa | `banners/lumispa.webp` |
| Award banner | `banners/award-devices.webp` |
| Products | `products/product-1..8.webp` (square) |
| Force for Good / Nature + Science | `sections/force-for-good.webp`, `sections/nature-science.webp` |
| News cards | `news/news-1..5.webp` (square) |
| News side card | `news/news-side.webp` (portrait) |

Award seals and the product "award" seal are inline SVG, drawn by us.
