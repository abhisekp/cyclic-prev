'use strict';
function releasePolicy(branch, version) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) throw new Error('Only stable semver versions can be released.');
  if (branch === 'master') return { tag: 'latest', gitTag: 'v' + version };
  throw new Error('Only master can publish releases.');
}
function registryState(status) {
  if (status === 200) return 'published';
  if (status === 404) return 'unpublished';
  throw new Error('Registry check failed with HTTP ' + status + '; refusing to publish.');
}
module.exports = { releasePolicy: releasePolicy, registryState: registryState };
