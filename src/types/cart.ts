export interface CartState {
  items: Readonly<Record<string, number>>;
  count: number;
}
