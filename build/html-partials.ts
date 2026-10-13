import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

export interface HtmlPartialsOptions {
  /** Folder that holds the partial files, relative to the project root. */
  root: string;
}

const INCLUDE = /<!--\s*@include\s+partials\/([\w-]+\.html)\s*-->/g;

/** Replaces every `<!-- @include partials/<file>.html -->` with the content of `<dir>/<file>.html`. */
export function inlinePartials(html: string, dir: string): string {
  return html.replace(INCLUDE, (_match, file: string) => {
    const path = resolve(dir, file);
    if (!existsSync(path)) throw new Error(`[html-partials] Partial not found: ${path}`);
    return readFileSync(path, "utf8").trim();
  });
}

/** Vite plugin: inlines HTML partials in dev and build, and reloads the page when one changes. */
export function htmlPartials({ root }: HtmlPartialsOptions): Plugin {
  let dir = resolve(root);
  return {
    name: "html-partials",
    configResolved(config) {
      dir = resolve(config.root, root);
    },
    transformIndexHtml: {
      order: "pre",
      handler: (html) => inlinePartials(html, dir),
    },
    configureServer(server) {
      server.watcher.add(dir);
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(dir) && file.endsWith(".html")) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}
