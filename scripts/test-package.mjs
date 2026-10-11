import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const run = args => execFileSync(process.execPath, [process.env.npm_execpath, ...args], { encoding: 'utf8' });
const [packed] = JSON.parse(run(['pack', '--ignore-scripts', '--json']));
const folder = await mkdtemp(join(tmpdir(), 'cyclic-prev-'));
try {
  run(['install', '--prefix', folder, resolve(packed.filename), '--offline', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', '--package-lock=false']);
  const require = createRequire(join(folder, 'consumer.cjs'));
  const next = require('cyclic-prev');
  assert.equal(next(5, 0), 4);
  assert.equal(next.cyclicPrev, next);
  assert.equal(next.default, next);
  assert.equal(require('cyclic-prev/lib/index.js'), next);
  assert.equal(require('cyclic-prev/index.js'), next);
  assert.equal(require('cyclic-prev/dist/cyclic-prev.cjs.js').cyclicPrev(5, 0, 3), 2);
  const native = await import(pathToFileURL(require.resolve('cyclic-prev')));
  assert.equal(native.default(5, 0), 4);
  assert.equal(native.cyclicPrev(5, 0, 3), 2);
  const esm = await import(pathToFileURL(require.resolve('cyclic-prev/dist/cyclic-prev.mjs')));
  assert.equal(esm.default(5, 0), 4);
  assert.equal(esm.cyclicPrev(5, 0, 3), 2);
  const manifest = JSON.parse(await readFile(require.resolve('cyclic-prev/package.json'), 'utf8'));
  assert.equal(Object.keys(manifest.dependencies || {}).length, 0);
  const paths = packed.files.map(f => f.path);
  for (const expected of ['LICENSE', 'README.md', 'dist/index.d.ts', 'dist/cyclic-prev.d.mts', 'lib/index.js']) assert(paths.includes(expected));
  assert(!paths.some(path => /^(docs|scripts|tests|node_modules)\//.test(path)));
  console.log(`Installed and verified ${packed.filename}: ${packed.size} bytes, zero runtime dependencies.`);
} finally {
  await rm(folder, { recursive: true, force: true });
  await rm(packed.filename, { force: true });
}
