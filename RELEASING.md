# Releases

## Branches

- `develop`: active development and CI. Does not publish or deploy.
- `master`: stable source, default branch, npm releases, and Pages deployment.

## First publication

The first npm release requires an authenticated maintainer because trusted publisher configuration belongs to an existing npm package. Run `npm run validate`, then publish version 1.0.0 from the committed master branch with `npm publish --access public`. Complete npm's browser or two-factor challenge if requested. Keep credentials outside the repository.

On npm, open the cyclic-prev package settings and configure a GitHub Actions trusted publisher with:

| Field | Value |
| --- | --- |
| Organization or user | `abhisekp` |
| Repository | `cyclic-prev` |
| Workflow filename | `publish.yml` |
| Environment name | `npm` |
| Allowed action | direct publishing (`npm publish`) |

No npm token is needed in GitHub secrets. The release job has `id-token: write` and runs npm 11.19.1 on a GitHub-hosted Node 24 runner. Restrict the `npm` GitHub environment to the `master` branch. Run the Publish to npm workflow on master after first publication to create its matching GitHub release.

## Later releases

1. Update the implementation, tests, README, and changelog on `develop`.
2. Run `npm version patch --no-git-tag-version` (or minor/major) to update both manifests.
3. Commit and open a pull request from develop to master; wait for CI.
4. Merge. Publish to npm validates the entire runtime matrix before publication; Deploy playground validates and deploys the site.
5. Confirm the npm version, GitHub release, and Pages site. Sync develop with master.

Only stable semver versions from master are eligible. Registry outages fail closed; only a 404 is treated as unpublished. Existing versions are never overwritten. Workflow dispatch supports retrying failed deployment or release operations.
