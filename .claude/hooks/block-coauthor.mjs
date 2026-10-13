#!/usr/bin/env node
// PreToolUse (Bash): refuse git commits that carry AI attribution trailers.
import { readFileSync } from "node:fs";

const { tool_input: t = {} } = JSON.parse(readFileSync(0, "utf8"));
const cmd = t.command ?? "";
if (/\bgit\b[^\n]*\bcommit\b/.test(cmd) && /co-authored-by|generated with \[?claude/i.test(cmd)) {
  console.error(
    "Commit blocked: this repo does not use Co-Authored-By / 'Generated with Claude' trailers. " +
      "Remove the trailer and commit again.",
  );
  process.exit(2);
}
