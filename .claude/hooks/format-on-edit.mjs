#!/usr/bin/env node
// PostToolUse (Write|Edit|MultiEdit): format the touched file. Never blocks.
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const { tool_input: t = {} } = JSON.parse(readFileSync(0, "utf8"));
const file = t.file_path;
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const bin = (name) => join(root, "node_modules", ".bin", name);
if (!file || !existsSync(file) || file.includes("node_modules")) process.exit(0);

const run = (name, args) => {
  if (!existsSync(bin(name))) return;
  try {
    execFileSync(bin(name), args, { cwd: root, stdio: "ignore", timeout: 20_000 });
  } catch {
    /* lint errors surface in `pnpm check`; don't block the edit */
  }
};

if (/\.(ts|js|mjs|css|html|json|md|ya?ml)$/.test(file)) run("prettier", ["--write", "--log-level", "silent", file]);
if (/\.(ts|js|mjs)$/.test(file)) run("eslint", ["--fix", file]);
