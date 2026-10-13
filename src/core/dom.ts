/** Returns the first match of `selector` or throws, so a missing hook fails loudly. */
export function requireEl<T extends HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}
