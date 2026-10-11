import next, { cyclicPrev } from '../../dist/cyclic-prev.mjs';
const result: number = next(5) + cyclicPrev(5, 2);
void result;
