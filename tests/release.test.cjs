const { test } = require('node:test');
const assert = require('node:assert/strict');
const { releasePolicy, registryState } = require('../scripts/release-policy.cjs');
test('stable versions publish only from master', () => {
  assert.deepEqual(releasePolicy('master', '1.0.0'), { tag: 'latest', gitTag: 'v1.0.0' });
  assert.equal(releasePolicy('master', '2.0.0').tag, 'latest');
  for (const branch of ['develop', 'gh-pages', 'feature/test', '1.x', '']) assert.throws(() => releasePolicy(branch, '1.0.0'));
  for (const version of ['1.0.0-beta.1', 'v1.0.0', '1.0', '01.0.0', '1.01.0', '1.0.01', '']) assert.throws(() => releasePolicy('master', version));
});
test('registry failures are never treated as an unpublished package', () => {
  assert.equal(registryState(200), 'published');
  assert.equal(registryState(404), 'unpublished');
  for (const status of [401, 403, 429, 500, 503]) assert.throws(() => registryState(status));
});
