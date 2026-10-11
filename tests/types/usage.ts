import legacy = require('cyclic-prev');
import defaultNext, { cyclicPrev } from 'cyclic-prev';
const a: number = legacy(5);
const b: number = cyclicPrev(5, 4, 3);
const c: number = defaultNext(5, undefined, 1);
const d: number = legacy.cyclicPrev(5, 0);
const e: number = legacy.default(5, 0);
void [a, b, c, d, e];
// @ts-expect-error max must be a number
legacy('5');
// @ts-expect-error result is a number
const wrong: string = cyclicPrev(5);
void wrong;
