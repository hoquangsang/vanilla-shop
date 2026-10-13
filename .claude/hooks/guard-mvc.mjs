#!/usr/bin/env node
// PreToolUse (Write|Edit|MultiEdit): block code that breaks the MVC layering.
// Exit 2 = block the tool call and show stderr to Claude.
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const { tool_input: t = {} } = input;
const file = (t.file_path ?? "").replaceAll("\\", "/");
if (!/\/src\/(models|views|controllers)\/.+\.ts$/.test(file)) process.exit(0);

const code = [t.content, t.new_string, ...(t.edits ?? []).map((e) => e.new_string)]
  .filter(Boolean)
  .join("\n");
const imports = [...code.matchAll(/(?:import|export)[^'"]*?from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
const problems = [];

if (file.includes("/src/views/")) {
  for (const p of imports) if (/(^|\/)(models|controllers)(\/|$)/.test(p)) problems.push(`view imports "${p}"`);
}
if (file.includes("/src/models/")) {
  for (const p of imports) if (/(^|\/)(views|controllers)(\/|$)/.test(p)) problems.push(`model imports "${p}"`);
  if (/\b(document|querySelector|getElementById|innerHTML)\b/.test(code)) problems.push("model touches the DOM");
}

if (problems.length) {
  console.error(
    `MVC guard blocked ${file}:\n- ${problems.join("\n- ")}\n` +
      "Views must not know models; models must not know views/controllers or the DOM. " +
      "Put the wiring in a controller (see CLAUDE.md > Architecture).",
  );
  process.exit(2);
}
