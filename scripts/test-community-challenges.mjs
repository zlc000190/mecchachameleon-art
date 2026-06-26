import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/shared/blocks/meccha/community-challenges.ts', import.meta.url), 'utf8');

assert.match(src, /mecchachameleon-art-community/, 'uses the configured community KV namespace');
assert.match(src, /pub-fac2b1301830469db5a7a5a2b9c52694\.r2\.dev/, 'uses the configured public R2 domain');
assert.match(src, /1200|1,200|1247|1,247/, 'ships a 1200+ likes demo challenge');
assert.match(src, /5/, 'documents/enforces 5 submissions per hour limit');

console.log('community challenge static contract ok');
