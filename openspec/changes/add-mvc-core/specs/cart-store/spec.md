# Spec Delta

## Purpose

Keeps the shopper's cart (quantity per product) as the single source of truth for the cart count, survives page reloads and navigation between Home and Detail, and stays consistent across browser tabs.

## ADDED Requirements

### Requirement: Empty cart by default
The cart SHALL start with no items and a total count of 0 when nothing valid has been saved before.

#### Scenario: First visit
- **WHEN** the cart is created and storage has no entry under key `vanilla-shop:cart`
- **THEN** the total count is 0 and the item list is empty

### Requirement: Adding a product increments the count
Each add of a product id SHALL increase that product's quantity by exactly 1 and the total count by exactly 1, with no upper limit on the number of adds.

#### Scenario: Add one product
- **WHEN** product `p1` is added once to an empty cart
- **THEN** the quantity of `p1` is 1 and the total count is 1

#### Scenario: Add the same product repeatedly
- **WHEN** product `p1` is added 3 times
- **THEN** the quantity of `p1` is 3 and the total count is 3

#### Scenario: Add different products
- **WHEN** `p1` is added twice and `p2` once
- **THEN** the total count is 3

### Requirement: Invalid product ids are ignored
An add with an empty or whitespace-only product id SHALL leave the cart unchanged and SHALL NOT throw or notify.

#### Scenario: Empty id
- **WHEN** an add is attempted with id `""` or `"   "`
- **THEN** the total count does not change and no change notification is sent

### Requirement: Change notifications
After every successful change the cart SHALL notify all subscribers once with the new total count and items. A subscriber SHALL be able to unsubscribe.

#### Scenario: Subscriber is told about an add
- **WHEN** a subscriber is registered and `p1` is added
- **THEN** the subscriber is called once with total count 1

#### Scenario: Unsubscribed listener is not called
- **WHEN** a subscriber unsubscribes and then `p1` is added
- **THEN** that subscriber is not called

### Requirement: Persistence
After every successful change the cart SHALL save `{"version":1,"items":{"<id>":<qty>}}` as JSON under the storage key `vanilla-shop:cart`, and a newly created cart SHALL restore that state.

#### Scenario: Survives reload
- **WHEN** `p1` is added twice, and a new cart instance is created on the same storage
- **THEN** the new cart has total count 2

### Requirement: Corrupted or unavailable storage is tolerated
The cart SHALL treat unparsable JSON, a wrong `version`, a non-object `items`, or non-positive / non-integer quantities as an empty cart (dropping only the invalid entries where possible), and SHALL keep working in memory if storage throws on read or write.

#### Scenario: Garbage in storage
- **WHEN** storage contains `"{not json"` under `vanilla-shop:cart` and a cart is created
- **THEN** the total count is 0 and no error is thrown

#### Scenario: Partly invalid items
- **WHEN** storage contains `{"version":1,"items":{"p1":2,"p2":-1,"p3":"x","p4":1.5}}`
- **THEN** the cart restores only `p1` with quantity 2 and the total count is 2

#### Scenario: Storage disabled
- **WHEN** every storage read and write throws (for example in private mode) and `p1` is added
- **THEN** the total count is 1, subscribers are notified, and no error escapes

### Requirement: Cross-tab synchronisation
When another tab of the same site changes the saved cart, this cart SHALL reload the saved state and notify subscribers.

#### Scenario: Other tab adds a product
- **WHEN** a storage change event for key `vanilla-shop:cart` arrives with a saved total of 4
- **THEN** this cart's total count becomes 4 and subscribers are notified once
