# search-query Specification

## Purpose
Holds the text a shopper types into the header search box, decides whether it is a valid query, and carries it to the Detail page through the URL so that the Detail page can display it, including after a reload or when the link is shared.

## Requirements

### Requirement: Query normalisation
A submitted query SHALL be trimmed of leading and trailing whitespace and SHALL be cut to at most 200 characters (counted as Unicode code points, so a character is never split). Inner whitespace and case SHALL be kept as typed.

#### Scenario: Surrounding spaces are removed
- **WHEN** the query `"  Reasonable Price  "` is submitted
- **THEN** the stored query is `"Reasonable Price"`

#### Scenario: Very long input is cut
- **WHEN** a query of 250 characters is submitted
- **THEN** the stored query is its first 200 characters

### Requirement: Empty queries are rejected
A query that is empty after trimming SHALL be rejected: the submit reports failure, the previously stored query stays unchanged, and subscribers are not notified.

#### Scenario: Only spaces
- **WHEN** `"    "` is submitted
- **THEN** the submit reports failure and the stored query is unchanged

### Requirement: Accepted queries notify subscribers
Every accepted query SHALL notify subscribers once with the normalised query.

#### Scenario: Subscriber receives the query
- **WHEN** a subscriber is registered and `"serum"` is submitted
- **THEN** the subscriber is called once with `"serum"`

### Requirement: Detail page URL
For an accepted query the model SHALL produce the relative URL `detail.html?q=<query>` with the query percent-encoded so that any text, including spaces, `&`, `#`, `?`, emoji and Vietnamese diacritics, round-trips unchanged.

#### Scenario: Plain text
- **WHEN** the URL is requested for `"Reasonable Price"`
- **THEN** it is `detail.html?q=Reasonable+Price` (form encoding, as produced by `URLSearchParams`)

#### Scenario: Special characters round-trip
- **WHEN** the query `"Giá hợp lý & <b>#1</b>? 😊"` is turned into a URL and that URL's search part is read back
- **THEN** the read-back query equals `"Giá hợp lý & <b>#1</b>? 😊"`

### Requirement: Reading the query from a URL
The model SHALL read the `q` parameter from a URL search string, apply the same normalisation, and return an empty string when `q` is missing or blank. Reading SHALL NOT throw on malformed percent-encoding; a lone `%` that is not followed by two hex digits is kept literally.

#### Scenario: Query present
- **WHEN** the search string `?q=Reasonable%20Price` is read
- **THEN** the query is `"Reasonable Price"`

#### Scenario: Query missing
- **WHEN** the search string `""` or `?foo=bar` is read
- **THEN** the query is `""`

#### Scenario: Malformed encoding
- **WHEN** the search string `?q=100%` is read
- **THEN** no error is thrown and the query is `"100%"`
