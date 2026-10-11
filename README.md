# cyclic-prev

[![npm](https://img.shields.io/npm/v/cyclic-prev)](https://www.npmjs.com/package/cyclic-prev)
[![CI](https://github.com/abhisekp/cyclic-prev/actions/workflows/ci.yml/badge.svg)](https://github.com/abhisekp/cyclic-prev/actions/workflows/ci.yml)
[![MIT](https://img.shields.io/npm/l/cyclic-prev)](LICENSE)

Cycle backward through indexes. From `0`, wrap to the last position. The companion to [cyclic-next](https://github.com/abhisekp/cyclic-next), with zero runtime dependencies, CommonJS, ES modules, browser bundles, and TypeScript declarations.

**[Try the playground](https://abhisekp.github.io/cyclic-prev/)** — the same look and feel as cyclic-next, using the actual package bundle. All playground assets work offline after download.

## Install

```sh
npm install cyclic-prev
```

## Usage

```js
const cyclicPrev = require('cyclic-prev');
// Also: const { cyclicPrev } = require('cyclic-prev');
// ESM: import cyclicPrev, { cyclicPrev as prev } from 'cyclic-prev';

cyclicPrev(5);        // 4
cyclicPrev(5, 0);     // 4
cyclicPrev(5, 1);     // 0
cyclicPrev(5, 4);     // 3
cyclicPrev(5, 0, 3);  // 2
cyclicPrev(5, 0, 13); // 2 (multiple wraps)
cyclicPrev(5, -1);    // 3 (current position is normalized)
cyclicPrev(5, 4, -3); // 2 (a negative step moves forward)
cyclicPrev(5, 2, 0);  // 2
```

## API

```ts
cyclicPrev(max: number, curr?: number, dec?: number): number
```

| Parameter | Default | Meaning |
| --- | --- | --- |
| `max` | required | Positive safe integer; the exclusive upper bound. `5` means indexes `0–4`. |
| `curr` | `0` | Safe integer current position; negative and out-of-range indexes are normalized. |
| `dec` | `1` | Safe integer number of positions to move backward. Negative values move forward. |

Returns an integer in `[0, max)`. Throws `RangeError` for an invalid `max` and `TypeError` for invalid `curr` or `dec`. Fractions, strings, `null`, infinity, and unsafe integers are rejected. Explicit `undefined` uses the defaults. Operands are reduced before subtraction, keeping even extreme safe integers accurate. Zero is always positive zero.

Unlike cyclic-next v1's JavaScript remainder behavior, cyclic-prev normalizes the result so stepping backward from zero produces a valid index.

## Companion: cyclic-next

Use [cyclic-next](https://github.com/abhisekp/cyclic-next) for next-slide controls, stepping forward through weekdays, and advancing game turns. Both packages have zero runtime dependencies, CommonJS and ES module bundles, and TypeScript declarations.

```sh
npm install cyclic-next cyclic-prev
```

```js
const cyclicNext = require('cyclic-next');
const cyclicPrev = require('cyclic-prev');

cyclicNext(5, 4); // 0: after the last position, return to the first
cyclicPrev(5, 0); // 4: before the first position, return to the last
```

For array navigation, use a positive safe integer cycle size and non-negative safe integer indexes and steps. The edge-case contracts differ: cyclic-next v1 preserves JavaScript remainder behavior without input validation; cyclic-prev validates safe integers and normalizes the result into `[0, max)`. For example, `cyclicNext(5, 0, -1)` returns `-1`, while `cyclicPrev(5, 0)` returns `4`.

[cyclic-next documentation](https://github.com/abhisekp/cyclic-next#readme) · [npm package](https://www.npmjs.com/package/cyclic-next) · [Interactive playground](https://cyclic-next.js.org/)

## Recipes

```js
import cyclicPrev from 'cyclic-prev';

const slides = ['mountains', 'ocean', 'city'];
let index = 0;
index = cyclicPrev(slides.length, index);
slides[index]; // 'city'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
days[cyclicPrev(days.length, 0)]; // 'Sun'
days[cyclicPrev(days.length, 4, 3)]; // 'Tue'
```

Browser usage (the CDN becomes available after npm publication):

```html
<script src="https://cdn.jsdelivr.net/npm/cyclic-prev@1.0.1/dist/cyclic-prev.umd.js"></script>
<script>
  const { cyclicPrev } = window.cyclicPrev;
  console.log(cyclicPrev(5, 0)); // 4
</script>
```

Native ESM bundle: `cyclic-prev/dist/cyclic-prev.mjs`. The package supports Node 4+; development tooling requires Node 22.14+.

## Development and releases

```sh
npm ci
npm run validate
npm run dev
```

Work on `develop`, open a pull request into `master`, and bump `package.json` and `package-lock.json` for a release. CI validates both branches and all pull requests on Linux and Windows, checks Node 4–24 runtime compatibility, types, the packed consumer package, and 100% core coverage. New versions on `master` publish automatically through npm trusted publishing; unchanged versions are skipped. A GitHub release is created only after npm publication succeeds. Pages deploys from validated `master` source through GitHub Actions.

See [RELEASING.md](RELEASING.md) for first-publication and trusted-publisher setup.

## License

[MIT](LICENSE) © Abhisek Pattnaik. Playground and build structure adapted from cyclic-next.
