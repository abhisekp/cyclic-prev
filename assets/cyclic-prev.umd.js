(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.cyclicPrev = {}));
})(this, (function (exports) { 'use strict';

  /**
   * Move backward through a cycle of max positions.
   * @param {number} max Exclusive upper bound (the number of positions).
   * @param {number} [curr=0] Current position.
   * @param {number} [dec=1] Number of positions to move backward.
   * @returns {number} A normalized index in [0, max).
   */
  function cyclicPrev(max) {
    var curr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var dec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    if (!Number.isSafeInteger(max) || max <= 0) throw new RangeError('max must be a positive safe integer');
    if (!Number.isSafeInteger(curr)) throw new TypeError('curr must be a safe integer');
    if (!Number.isSafeInteger(dec)) throw new TypeError('dec must be a safe integer');
    // Reduce each operand before subtraction to avoid overflowing safe integers.
    var current = curr % max;
    var step = dec % max;
    if (current < 0) current += max;
    if (step < 0) step += max;
    var result = current - step;
    return (result < 0 ? result + max : result) + 0;
  }

  exports.cyclicPrev = cyclicPrev;
  exports.default = cyclicPrev;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=cyclic-prev.umd.js.map
