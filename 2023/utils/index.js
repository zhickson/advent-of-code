/**
 * Utils package.
 *
 * These are commonly reoccuring functions that are helpful.
 */

/**
 * Check if a number is between two numbers.
 *
 * @param {number} x Number to check
 * @param {number} min Range start
 * @param {number} max Range end
 * @returns {boolean} True if x is between min and max
 */
function between(x, min, max) {
  return x >= min && x <= max;
}

/**
 * Create array of numbers starting from {min} and ending at {max}.
 *
 * @param {number} min Range start
 * @param {number} max Range end
 * @returns {array} Array of numbers between min and max
 */
function fill(min, max) {
  let list = [];
  for (let i = min; i <= max; i++) {
    list.push(i);
  }
  return list;
}

/**
 * Generate an array of numbers of N size starting at x
 *
 * @param {number} size Size of array to create
 * @param {number} startAt Number to start at
 * @returns {array} Array of numbers
 */
function rangeSize(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

/**
 * Create array of numbers between start and stop with step.
 *
 * @param {number} start Range start
 * @param {number} stop Range stop
 * @param {number} step Range step
 * @returns {array} Array of numbers
 */
function arrayRange(start, stop, step) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );
}

/**
 * Generate an array of numbers given a start and end.
 *
 * Note: This is a generator function.
 *
 * @param {number} start Range start
 * @param {number} end Range end
 *
 * @yields {number} Number in range
 */
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

/**
 * JS version of Python's zip function.
 *
 * Combines two arrays of equal length, matching each index.
 *
 * @param {array} rows Array of arrays
 * @returns {array} Array of arrays (grouped)
 */
function zip(rows) {
  return rows[0].map((_, c) => rows.map((row) => row[c]));
}
