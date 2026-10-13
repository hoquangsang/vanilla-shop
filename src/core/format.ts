const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** `14` → `$14.00` */
export function formatPrice(value: number): string {
  return usd.format(value);
}
