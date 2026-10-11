'use strict';
var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var prev = require('../dist/index.js');
var count = 0;
function same(actual, expected) { assert.strictEqual(actual, expected); count++; }
same(prev(5), 4);
same(prev(5, undefined, undefined), 4);
same(prev(5, 0), 4);
same(prev(5, 1), 0);
same(prev(5, 2), 1);
same(prev(5, 3), 2);
same(prev(5, 4), 3);
same(prev(5, 0, 3), 2);
same(prev(5, 0, 13), 2);
same(prev(5, -1), 3);
same(prev(5, 12), 1);
same(prev(5, 4, -3), 2);
same(prev(5, 2, 0), 2);
same(prev(1, -19, 27), 0);
same(1 / prev(5, -0, 0), Infinity);
same(prev(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER), 0);
same(prev(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1, -2), 1);
same(prev(Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER + 1, 2), Number.MAX_SAFE_INTEGER - 1);
for (var max = 1; max <= 32; max++) {
  for (var curr = -64; curr <= 64; curr++) {
    for (var dec = -64; dec <= 64; dec++) {
      // Independent oracle: walk one position at a time, wrapping at the bounds.
      var expected = curr;
      while (expected < 0) expected += max;
      while (expected >= max) expected -= max;
      for (var step = 0; step < Math.abs(dec); step++) {
        expected += dec < 0 ? 1 : -1;
        if (expected < 0) expected = max - 1;
        if (expected === max) expected = 0;
      }
      same(prev(max, curr, dec), expected);
    }
  }
}
var invalid = [null, NaN, Infinity, -Infinity, 0.5, '2', {}, Number.MAX_SAFE_INTEGER + 1];
invalid.concat([undefined, 0, -1]).forEach(function (value) { assert.throws(function () { prev(value); }, RangeError); });
invalid.forEach(function (value) {
  assert.throws(function () { prev(5, value); }, TypeError);
  assert.throws(function () { prev(5, 0, value); }, TypeError);
});
same(typeof prev, 'function');
same(prev.cyclicPrev, prev);
same(prev.default, prev);
same(require('../lib/index.js'), prev);
same(require('../index.js'), prev);
same(require('../dist/cyclic-prev.cjs.js').cyclicPrev(5, 0), 4);
var context = {};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/cyclic-prev.umd.js'), 'utf8'), context);
same(context.cyclicPrev.cyclicPrev(5, 0), 4);
same(context.cyclicPrev.default, context.cyclicPrev.cyclicPrev);
console.log('Passed ' + count + ' arithmetic and import assertions on ' + process.version);
