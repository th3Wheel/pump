#!/usr/bin/env node
/**
 * Cross-platform helper: lint only changed/untracked lintable files.
 * Equivalent to the `lint:changed` npm script, but avoids shell-specific
 * constructs so it works on Windows, macOS, and Linux.
 */

import { spawnSync } from 'child_process';

const LINTABLE = /\.(js|mjs|cjs|ts|mts|cts|json|jsonc|json5|md|css)$/;

function gitLines(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.error) throw result.error;
  return result.stdout.split('\n').map(f => f.trim()).filter(Boolean);
}

const staged = gitLines(['diff', '--name-only', '--diff-filter=ACMRTUXB', 'HEAD']);
const untracked = gitLines(['ls-files', '--others', '--exclude-standard']);

const files = [...new Set([...staged, ...untracked])].filter(f => LINTABLE.test(f));

if (files.length === 0) {
  console.log('No changed lintable files.');
  process.exit(0);
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(npx, ['eslint', '--no-warn-ignored', ...files], { stdio: 'inherit', shell: false });
process.exit(result.status ?? 1);
