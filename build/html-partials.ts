import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

const INCLUDE_RE = /<!--\s*@include\s+partials\/([\w./-]+\.html)\s*-->/g;

export interface HtmlPartialsOptions {
  /** Folder that holds the partial files, relative to the project root. */
  root: string;
}

/** Replaces `<!-- @include partials/<file>.html -->` with the content of `<root>/<file>.html`. */
export function inlinePartials(html: string, root: string): string {
  return html.replace(INCLUDE_RE, (_match, file: string) => {
    const path = resolve(root, file);
    if (!existsSync(path)) {
      throw new Error(`html-partials: partial not found: ${path}`);
    }
    return readFileSync(path, "utf-8").trimEnd();
  });
}

export function htmlPartials(options: HtmlPartialsOptions): Plugin {
  const root = resolve(options.root);
  return {
    name: "html-partials",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => inlinePartials(html, root),
    },
    configureServer(server) {
      server.watcher.add(root);
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(root) && file.endsWith(".html")) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
      return undefined;
    },
  };
}
